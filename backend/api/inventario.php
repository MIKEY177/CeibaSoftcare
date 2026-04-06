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

// ── GET: listar productos ────────────────────────────────────────────────────
if ($method === 'GET') {
    $sql = "SELECT p.id_producto, p.nombre, p.descripcion, p.tipo_medida,
                   p.cantidad_por_unidad, u.nombre AS nombre_usuario, p.codigo_barras
            FROM productos p
            INNER JOIN usuarios u ON p.id_usuario1 = u.id_usuario WHERE p.activo = 1";

    $result = mysqli_query($conn, $sql);

    if (!$result) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error"   => $debug ? mysqli_error($conn) : "❗Error en la consulta"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $productos = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $productos[] = $row;
    }

    echo json_encode(["success" => true, "data" => $productos], JSON_UNESCAPED_UNICODE);
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

// ── POST: registrar producto ─────────────────────────────────────────────────
if ($method === 'POST') {
    $nombre              = trim($body['nombre']              ?? '');
    $descripcion         = trim($body['descripcion']         ?? '');
    $tipo_medida         = trim($body['tipo_medida']         ?? '');
    $codigo_barras       = trim($body['codigo_barras']       ?? '');
    $cantidad_por_unidad = trim($body['cantidad_por_unidad'] ?? '');

    $errores = [];

    if ($nombre === '') {
        $errores['nombre'] = "❗El nombre del producto es obligatorio.";
    } elseif (strlen($nombre) > 150) {
        $errores['nombre'] = "❗El nombre no puede superar los 150 caracteres.";
    } else {
        $stmt_check = mysqli_prepare($conn, "SELECT id_producto FROM productos WHERE nombre = ? AND codigo_barras = ? AND activo = 1");
        mysqli_stmt_bind_param($stmt_check, "ss", $nombre, $codigo_barras);
        mysqli_stmt_execute($stmt_check);
        mysqli_stmt_store_result($stmt_check);
        if (mysqli_stmt_num_rows($stmt_check) > 0) {
            $errores['nombre'] = "❗Ya existe un producto activo con el mismo nombre y código de barras.";
        }
        mysqli_stmt_close($stmt_check);
    }

    if (strlen($descripcion) > 500) {
        $errores['descripcion'] = "❗La descripción no puede superar los 500 caracteres.";
    }

    if ($tipo_medida === '') {
        $errores['tipo_medida'] = "❗El tipo de medida es obligatorio.";
    }

    if ($codigo_barras === '') {
        $errores['codigo_barras'] = "❗El código de barras es obligatorio.";
    } else {
        $stmt_check_codigo = mysqli_prepare($conn, "SELECT id_producto FROM productos WHERE codigo_barras = ? AND activo = 1");
        mysqli_stmt_bind_param($stmt_check_codigo, "s", $codigo_barras);
        mysqli_stmt_execute($stmt_check_codigo);
        mysqli_stmt_store_result($stmt_check_codigo);
        if (mysqli_stmt_num_rows($stmt_check_codigo) > 0) {
            $errores['codigo_barras'] = "❗Ya existe un producto activo con el mismo código de barras.";
        }
        mysqli_stmt_close($stmt_check_codigo);
    }

    if ($cantidad_por_unidad === '') {
        $errores['cantidad_por_unidad'] = "❗La cantidad por unidad es obligatoria.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn,
        "INSERT INTO productos (nombre, descripcion, tipo_medida, id_usuario1, codigo_barras, cantidad_por_unidad) VALUES (?, ?, ?, ?, ?, ?)"
    );
    mysqli_stmt_bind_param($stmt, "sssiss", $nombre, $descripcion, $tipo_medida, $id_usuario, $codigo_barras, $cantidad_por_unidad);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "id_producto" => mysqli_insert_id($conn)], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al registrar el producto."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── PUT: editar producto ─────────────────────────────────────────────────────
if ($method === 'PUT') {
    $id_producto         = intval($body['id_producto']       ?? 0);
    $nombre              = trim($body['nombre']              ?? '');
    $descripcion         = trim($body['descripcion']         ?? '');
    $tipo_medida         = trim($body['tipo_medida']         ?? '');
    $codigo_barras       = trim($body['codigo_barras']       ?? '');
    $cantidad_por_unidad = trim($body['cantidad_por_unidad'] ?? '');

    $errores = [];

    if ($nombre === '') {
        $errores['nombre'] = "❗El nombre del producto es obligatorio.";
    } elseif (strlen($nombre) > 150) {
        $errores['nombre'] = "❗El nombre no puede superar los 150 caracteres.";
    }

    if (strlen($descripcion) > 500) {
        $errores['descripcion'] = "❗La descripción no puede superar los 500 caracteres.";
    }

    if ($tipo_medida === '') {
        $errores['tipo_medida'] = "❗El tipo de medida es obligatorio.";
    }

    if ($codigo_barras === '') {
        $errores['codigo_barras'] = "❗El código de barras es obligatorio.";
    } else {
        $stmt_check_codigo = mysqli_prepare($conn, "SELECT id_producto FROM productos WHERE codigo_barras = ? AND id_producto != ? AND activo = 1");
        mysqli_stmt_bind_param($stmt_check_codigo, "si", $codigo_barras, $id_producto);
        mysqli_stmt_execute($stmt_check_codigo);
        mysqli_stmt_store_result($stmt_check_codigo);
        if (mysqli_stmt_num_rows($stmt_check_codigo) > 0) {
            $errores['codigo_barras'] = "❗Ya existe un producto activo con el mismo código de barras.";
        }
        mysqli_stmt_close($stmt_check_codigo);
    }

    if ($cantidad_por_unidad === '') {
        $errores['cantidad_por_unidad'] = "❗La cantidad por unidad es obligatoria.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn,
        "UPDATE productos SET nombre = ?, descripcion = ?, tipo_medida = ?, codigo_barras = ?, cantidad_por_unidad = ? WHERE id_producto = ?"
    );
    mysqli_stmt_bind_param($stmt, "sssssi", $nombre, $descripcion, $tipo_medida, $codigo_barras, $cantidad_por_unidad, $id_producto);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗Producto no encontrado."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al actualizar el producto."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── DELETE: desactivar producto ──────────────────────────────────────────────
if ($method === 'DELETE') {
    $id_producto = intval($body['id_producto'] ?? 0);

    if ($id_producto === 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "ID de producto inválido."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn, "UPDATE productos SET activo = 0 WHERE id_producto = ?");
    mysqli_stmt_bind_param($stmt, "i", $id_producto);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗Producto no encontrado."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al desactivar el producto."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── Método no permitido ──────────────────────────────────────────────────────
http_response_code(405);
echo json_encode(["success" => false, "errores" => ["general" => "Método no permitido."]], JSON_UNESCAPED_UNICODE);