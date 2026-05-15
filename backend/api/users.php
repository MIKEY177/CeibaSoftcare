<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . '/config/session_config.php';
require_once dirname(__DIR__) . '/config/env.php';
loadEnv(__DIR__ . '/../../.env.development');

$method = $_SERVER['REQUEST_METHOD'];
header("Content-Type: application/json");

function sendToN8n($nombre, $email, $code) {

    $url = getenv("USER_WEBHOOK_URL");

    $payload = [
        "name" => $nombre,
        "email" => $email,
        "code" => $code
    ];

    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    // Seguridad activa (NO desactivar SSL)
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json"
    ]);

    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);


    if ($error) {
        return ["success" => false, "error" => $error];
    }

    if ($statusCode >= 400) {
        return [
            "success" => false,
            "error" => "Error HTTP $statusCode",
            "response" => $response
        ];
    }

    return ["success" => true];
}

if($method === 'GET') {
    $sql = "SELECT u.id_usuario, u.nombre, u.correo, u.contrasena, u.foto_perfil, r.nombre as rol , r.id_rol FROM usuarios u JOIN roles r ON u.id_rol1 = r.id_rol WHERE u.activo = 1 AND u.id_usuario != ? ORDER BY u.id_usuario ASC";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i",  $_SESSION['user_id']);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if (mysqli_stmt_affected_rows($stmt) > 0) {
        $usuarios = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $usuarios[] = $row;
        }

        echo json_encode([
            "success" => true,
            "data" => $usuarios
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Usuario no encontrado"]);
    }    
}
$body = json_decode(file_get_contents("php://input"), true);
// ── POST: registrar producto ─────────────────────────────────────────────────
if ($method === 'POST') {
    $nombre              = trim($body['nombre']              ?? '');
    $correo              = trim($body['correo']              ?? '');
    $contrasena          = trim($body['contraseña']         ?? '');
    $rol       = trim($body['rol']       ?? '');

    $errores = [];

    if ($nombre === '') {
        $errores['nombre'] = "❗El nombre del usuario es obligatorio.";
    } elseif (strlen($nombre) < 3 ){
        $errores['nombre'] = "❗El nombre debe tener mínimo 3  caracteres.";
    } else {
        $stmt_check = mysqli_prepare($conn, "SELECT id_usuario FROM usuarios WHERE nombre = ? AND activo = 1");
        mysqli_stmt_bind_param($stmt_check, "s", $nombre);
        mysqli_stmt_execute($stmt_check);
        mysqli_stmt_store_result($stmt_check);
        if (mysqli_stmt_num_rows($stmt_check) > 0) {
            $errores['nombre'] = "❗Ya existe un usuario activo con el mismo nombre";
        }
        mysqli_stmt_close($stmt_check);
    }

    if ($correo === "" || $correo === null) {
        $errores['correo'] = "❗el correo es obligatorio.";
    }elseif(!filter_var( $correo, FILTER_VALIDATE_EMAIL)){
        $errores['correo'] = "❗el correo es invalido.";
    }

    if ($rol === '' || $rol === null) {
        $errores['rol'] = "❗El rol es obligatorio.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $contrasena_hashed = password_hash($contrasena, PASSWORD_DEFAULT);

    $stmt = mysqli_prepare($conn,
        "INSERT INTO usuarios (nombre, correo, contrasena, id_rol1) VALUES (?, ?, ?, ?)"
    );
    mysqli_stmt_bind_param($stmt, "sssi", $nombre, $correo, $contrasena_hashed, $rol);

    if (mysqli_stmt_execute($stmt)) {
        sendToN8n($nombre, $correo, $contrasena);
        echo json_encode(["success" => true, "id_usuario" => mysqli_insert_id($conn)], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al registrar el usuario."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── PUT: editar usuario ─────────────────────────────────────────────────────
if ($method === 'PUT') {
    $id_usuario         = intval($body['id_usuario']         ?? 0);
    $nombre              = trim($body['nombre']              ?? '');
    $correo              = trim($body['correo']              ?? '');
    $rol       = trim($body['rol']       ?? '');

    $errores = [];

    $sql_check = "SELECT * FROM usuarios WHERE id_usuario = ? AND activo = 1";

    $stmt_check = mysqli_prepare($conn, $sql_check);

    mysqli_stmt_bind_param($stmt_check, "i", $id_usuario);

    mysqli_stmt_execute($stmt_check);

    $result_check = mysqli_stmt_get_result($stmt_check);

    $usuario_inicial = null;

    if ($result_check && mysqli_num_rows($result_check) > 0) {

        $usuario_inicial = mysqli_fetch_assoc($result_check);

    } else {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "errores" => [
                "general" => "❗Usuario no encontrado."
            ]
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    mysqli_stmt_close($stmt_check);

    if ($nombre === $usuario_inicial['nombre'] && $correo === $usuario_inicial['correo'] && $rol == $usuario_inicial['id_rol1']) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "❗No se han realizado cambios."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

     if ($nombre === '') {
        $errores['nombre'] = "❗El nombre del usuario es obligatorio.";
    } elseif (strlen($nombre) < 3 ){
        $errores['nombre'] = "❗El nombre debe tener mínimo 3 caracteres.";
    } else {
        $stmt_check = mysqli_prepare($conn, "SELECT id_usuario FROM usuarios WHERE nombre = ? AND activo = 1 AND id_usuario != ?");
        mysqli_stmt_bind_param($stmt_check, "si", $nombre, $id_usuario);
        mysqli_stmt_execute($stmt_check);
        mysqli_stmt_store_result($stmt_check);
        if (mysqli_stmt_num_rows($stmt_check) > 0) {
            $errores['nombre'] = "❗Ya existe un usuario activo con el mismo nombre";
        }
        mysqli_stmt_close($stmt_check);
    }

    if ($id_usuario === 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "ID de usuario inválido."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($nombre === '') {
        $errores['nombre'] = "❗El nombre del usuario es obligatorio.";
    } elseif (strlen($nombre) < 3 ){
        $errores['nombre'] = "❗El nombre debe tener mínimo 3 caracteres.";
    }

    if ($correo === "" || $correo === null) {
        $errores['correo'] = "❗el correo es obligatorio.";
    }elseif(!filter_var( $correo, FILTER_VALIDATE_EMAIL)){
        $errores['correo'] = "❗el correo es invalido.";
    }

    if ($rol === '' || $rol === null) {
        $errores['rol'] = "❗El rol es obligatorio.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn,
        "UPDATE usuarios SET nombre = ?, correo = ?, id_rol1 = ? WHERE id_usuario = ?"
    );
    mysqli_stmt_bind_param($stmt, "ssii", $nombre, $correo, $rol, $id_usuario);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗Usuario no encontrado o sin cambios."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al editar el usuario."]
        ], JSON_UNESCAPED_UNICODE);
    }
}

// ── DELETE: desactivar producto ──────────────────────────────────────────────
if ($method === 'DELETE') {
    $id_usuario = intval($body['id_usuario'] ?? 0);

    if ($id_usuario === 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "ID de usuario inválido."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn, "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?");
    mysqli_stmt_bind_param($stmt, "i", $id_usuario);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗Usuario no encontrado."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al desactivar el usuario."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

