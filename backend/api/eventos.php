<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';

header("Content-Type: application/json");

$isLocal = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');

session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => $isLocal ? '' : $_SERVER['HTTP_HOST'],
    'secure' => !$isLocal,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

$debug = (getenv('APP_ENV') === 'development' || (isset($_SERVER['APP_ENV']) && $_SERVER['APP_ENV'] === 'development'));

$method = $_SERVER['REQUEST_METHOD'];

// ── GET: listar eventos ────────────────────────────────────────────────────
if ($method === 'GET') {
    $sql = "SELECT e.id_evento, e.nombre, e.descripcion, e.fecha_hora, e.lugar, e.requiere_producto
FROM eventos e
WHERE e.activo = 1";

    $result = mysqli_query($conn, $sql);

    if (!$result) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error"   => $debug ? mysqli_error($conn) : "❗Error en la consulta"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $eventos = [];
    while ($row = mysqli_fetch_assoc($result)) {
    $row["requiere_producto"] = (int)$row["requiere_producto"];
    $eventos[] = $row;
}

    echo json_encode(["success" => true, "data" => $eventos], JSON_UNESCAPED_UNICODE);
    mysqli_free_result($result);
    mysqli_close($conn);
    exit;
}

// ── Leer body JSON ───────────────────────────────────────────────────────────
$body = json_decode(file_get_contents("php://input"), true);

if ($method !== 'GET' && $body === null) {
    http_response_code(400);
    echo json_encode(["success" => false, "errores" => ["general" => "Body JSON inválido o vacío"]], JSON_UNESCAPED_UNICODE);
    exit;
}

$id_usuario = $_SESSION['user_id'] ?? null;

if ($method !== 'GET' && $id_usuario === null) {
    http_response_code(401);
    echo json_encode(["success" => false, "errores" => ["sesion" => "❗No tienes una sesión activa. Por favor inicia sesión."]], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── POST: registrar evento ─────────────────────────────────────────────────
if ($method === 'POST') {
    $nombre  = trim($body['nombre'] ?? '');
    $descripcion = trim($body['descripcion'] ?? '');
    $fecha_hora  = trim($body['fecha_hora'] ?? '');
    $lugar  = trim($body['lugar']?? '');
    $requiere_producto = isset($body['requiere_producto']) ? intval($body['requiere_producto']) : 0;

    $errores = [];

    if ($nombre === '') {
        $errores['nombre'] = "❗El nombre del evento es obligatorio.";
    } elseif (strlen($nombre) > 100) {
        $errores['nombre'] = "❗El nombre no puede superar los 100 caracteres.";
    }

    if (strlen($descripcion) > 100) {
        $errores['descripcion'] = "❗La descripción no puede superar los 100 caracteres.";
    }

 if ($fecha_hora === '') {
    $errores['fecha_hora'] = "❗La fecha y hora son obligatorias.";
} else {
    $dt = new DateTime($fecha_hora);

    if (!$dt) {
        $errores['fecha_hora'] = "❗Formato inválido.";
    } elseif ($dt <= new DateTime()) {
        $errores['fecha_hora'] = "❗Debe ser una fecha futura.";
    }
}

    if ($lugar === '') {
        $errores['lugar'] = "❗El lugar es obligatorio.";
    } elseif (strlen($lugar) > 100) {
        $errores['lugar'] = "❗El lugar no puede superar los 100 caracteres.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn,
        "INSERT INTO eventos (nombre, descripcion, fecha_hora, lugar, requiere_producto) VALUES (?, ?, ?, ?, ?)"
    );
    mysqli_stmt_bind_param($stmt, "ssssi", $nombre, $descripcion, $fecha_hora, $lugar, $requiere_producto);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "id_evento" => mysqli_insert_id($conn)], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al registrar el evento."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── PUT: editar evento ─────────────────────────────────────────────────────
if ($method === 'PUT') {

    $id_evento = intval($body['id_evento'] ?? 0);
    $nombre = trim($body['nombre'] ?? '');
    $descripcion = trim($body['descripcion'] ?? '');
    $fecha_hora = trim($body['fecha_hora'] ?? '');
    $lugar = trim($body['lugar'] ?? '');
    $requiere_producto = isset($body['requiere_producto']) ? intval($body['requiere_producto']) : 0;

    $errores = [];

    if ($nombre === '') {
        $errores['nombre'] = "❗El nombre es obligatorio.";
    } elseif (strlen($nombre) > 100) {
        $errores['nombre'] = "❗El nombre no puede superar los 100 caracteres.";
    }

 if ($fecha_hora === '') {
    $errores['fecha_hora'] = "❗La fecha y hora son obligatorias.";
} else {
    try {
        $dt = new DateTime($fecha_hora);

        if ($dt <= new DateTime()) {
            $errores['fecha_hora'] = "❗Debe ser una fecha futura.";
        }
    } catch (Exception $e) {
        $errores['fecha_hora'] = "❗Formato inválido.";
    }
}
 if (strlen($descripcion) > 100) {
        $errores['descripcion'] = "❗La descripción no puede superar los 100 caracteres.";
    }

    if ($lugar === '') {
        $errores['lugar'] = "❗El lugar es obligatorio.";
    } elseif (strlen($lugar) > 100) {
        $errores['lugar'] = "❗El lugar no puede superar los 100 caracteres.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores]);
        exit;
    }

    $stmt = mysqli_prepare($conn,
        "UPDATE eventos 
         SET nombre = ?, descripcion = ?, fecha_hora = ?, lugar = ?, requiere_producto = ?
         WHERE id_evento = ?"
    );

    mysqli_stmt_bind_param($stmt, "ssssii",
        $nombre, $descripcion, $fecha_hora, $lugar, $requiere_producto, $id_evento
    );

    if (mysqli_stmt_execute($stmt)) {

        if (mysqli_stmt_affected_rows($stmt) === 0) {
            echo json_encode([
                "success" => true,
                "mensaje" => "No se realizaron cambios."
            ]);
        } else {
            echo json_encode([
                "success" => true,
                "mensaje" => "Evento actualizado correctamente."
            ]);
        }

    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => mysqli_stmt_error($stmt)]
        ]);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── DELETE: desactivar evento ──────────────────────────────────────────────
if ($method === 'DELETE') {
    $id_evento = intval($body['id_evento'] ?? 0);

    if ($id_evento === 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "ID de evento inválido."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn, "UPDATE eventos SET activo = 0 WHERE id_evento = ?");
    mysqli_stmt_bind_param($stmt, "i", $id_evento);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗Evento no encontrado."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al desactivar el evento."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── Método no permitido ──────────────────────────────────────────────────────
http_response_code(405);
echo json_encode(["success" => false, "errores" => ["general" => "Método no permitido."]], JSON_UNESCAPED_UNICODE);