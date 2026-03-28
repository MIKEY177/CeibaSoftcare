<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/conexion.php';

header("Content-Type: application/json");

// Configurar sesión antes de utilizarla
$host = $_SERVER['HTTP_HOST'] ?? '';
$isLocal = strpos($host, 'localhost') !== false;

session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => $isLocal ? '' : '.onrender.com',
    'secure' => !$isLocal,
    'httponly' => true,
    'samesite' => $isLocal ? 'Lax' : 'None'
]);

session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

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
            "error"   => $debug ? mysqli_error($conn) : "Error en la consulta"
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

// Para GET (listar), el body puede estar vacío
if ($method !== 'GET' && $body === null) {
    http_response_code(400);
    echo json_encode(["success" => false, "errores" => ["general" => "Body JSON inválido o vacío"]], JSON_UNESCAPED_UNICODE);
    exit;
}

// Obtener ID del usuario de la sesión
$id_usuario = $_SESSION['user_id'] ?? null;

// Validar sesión para operaciones que la requieren (POST, PUT, DELETE)
if ($method !== 'GET' && $id_usuario === null) {
    http_response_code(401);
    echo json_encode(["success" => false, "errores" => ["sesion" => "No tienes una sesión activa. Por favor inicia sesión."]], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── POST: registrar producto ─────────────────────────────────────────────────
if ($method === 'POST') {
    $nombre      = trim($body['nombre']      ?? '');
    $descripcion = trim($body['descripcion'] ?? '');
    $tipo_medida = trim($body['tipo_medida'] ?? '');
    $codigo_barras = trim($body['codigo_barras'] ?? '');
    $cantidad_por_unidad = trim($body['cantidad_por_unidad'] ?? '');

    $sql_check = "SELECT id_producto FROM productos WHERE nombre = ? AND codigo_barras = ? AND activo = 1";
    $stmt_check = mysqli_prepare($conn, $sql_check);
    mysqli_stmt_bind_param($stmt_check, "ss", $nombre, $codigo_barras);
    mysqli_stmt_execute($stmt_check);
    mysqli_stmt_store_result($stmt_check);
    $check_nombre = mysqli_stmt_num_rows($stmt_check) > 0;

    $sql_check_codigo = "SELECT id_producto FROM productos WHERE codigo_barras = ? AND activo = 1";
    $stmt_check_codigo = mysqli_prepare($conn, $sql_check_codigo);
    mysqli_stmt_bind_param($stmt_check_codigo, "s", $codigo_barras);
    mysqli_stmt_execute($stmt_check_codigo);
    mysqli_stmt_store_result($stmt_check_codigo);
    $check_codigo_barras = mysqli_stmt_num_rows($stmt_check_codigo) > 0;
     
    if ($check_nombre) {
        $errores['nombre'] = "Ya existe un producto activo con el mismo nombre y código de barras.";
    }

    $errores = [];



    if ($nombre === '') {
        $errores['nombre'] = "El nombre del producto es obligatorio.";
    } elseif (strlen($nombre) > 150) {
        $errores['nombre'] = "El nombre no puede superar los 150 caracteres.";
    } elseif (mysqli_stmt_num_rows($stmt_check) > 0) {
        $errores['nombre'] = "Ya existe un producto activo con el mismo nombre y código de barras.";
    }

    if (strlen($descripcion) > 500) {
        $errores['descripcion'] = "La descripción no puede superar los 500 caracteres.";
    }

    if ($tipo_medida === '') {
        $errores['tipo_medida'] = "El tipo de medida es obligatorio.";
    }
    if ($codigo_barras ===''){
        $errores['codigo_barras'] = "El código de barras es obligatorio.";
    }else if ($check_codigo_barras) {
        $errores['codigo_barras'] = "Ya existe un producto activo con el mismo código de barras.";
    }
    if ($cantidad_por_unidad ===''){
        $errores['cantidad_por_unidad'] = "La cantidad por unidad es obligatoria.";
    }
    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn,
        "INSERT INTO productos (nombre, descripcion, tipo_medida, id_usuario1, codigo_barras, cantidad_por_unidad) VALUES (?, ?, ?, ?, ?, ?)"
    );
    mysqli_stmt_bind_param($stmt, "sssiii", $nombre, $descripcion, $tipo_medida, $id_usuario, $codigo_barras, $cantidad_por_unidad);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "id_producto" => mysqli_insert_id($conn)], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "Error al registrar el producto."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}
if ($method === 'POST') {
    echo json_encode(["debug" => $_SESSION, "user_id" => $_SESSION['user_id'] ?? 'NO EXISTE']);
    exit;
}

// ── PUT: editar producto ─────────────────────────────────────────────────────
if ($method === 'PUT') {
    $id_producto = intval($body['id_producto'] ?? 0);
    $nombre      = trim($body['nombre']        ?? '');
    $descripcion = trim($body['descripcion']   ?? '');
    $tipo_medida = trim($body['tipo_medida']   ?? '');
    $codigo_barras = trim($body['codigo_barras'] ?? '');
    $cantidad_por_unidad = trim($body['cantidad_por_unidad'] ?? '');

    $errores = [];

    $sql_check_codigo = "SELECT id_producto FROM productos WHERE codigo_barras = ? AND activo = 1";
    $stmt_check_codigo = mysqli_prepare($conn, $sql_check_codigo);
    mysqli_stmt_bind_param($stmt_check_codigo, "s", $codigo_barras);
    mysqli_stmt_execute($stmt_check_codigo);
    mysqli_stmt_store_result($stmt_check_codigo);
    $check_codigo_barras = mysqli_stmt_num_rows($stmt_check_codigo) > 0;

    $sql_codigo_barras = "SELECT codigo_barras FROM productos WHERE nombre = ? AND id_producto != ? AND activo = 1";
    $stmt_codigo_barras = mysqli_prepare($conn, $sql_codigo_barras);
    mysqli_stmt_bind_param($stmt_codigo_barras, "si", $nombre, $id_producto);
    mysqli_stmt_execute($stmt_codigo_barras);
    $datos_codigo_barras = mysqli_stmt_get_result($stmt_codigo_barras);
    $row_codigo_barras = mysqli_fetch_assoc($datos_codigo_barras);

    if(!isset($row_codigo_barras['codigo_barras'])){
        $row_codigo_barras['codigo_barras'] = '';
    }
    

    if ($nombre === '') {
        $errores['nombre'] = "El nombre del producto es obligatorio.";
    } elseif (strlen($nombre) > 150) {
        $errores['nombre'] = "El nombre no puede superar los 150 caracteres.";
    }

    if (strlen($descripcion) > 500) {
        $errores['descripcion'] = "La descripción no puede superar los 500 caracteres.";
    }

    if ($tipo_medida === '') {
        $errores['tipo_medida'] = "El tipo de medida es obligatorio.";
    }
    if ($codigo_barras ===''){
        $errores['codigo_barras'] = "El código de barras es obligatorio.";
    }elseif ($check_codigo_barras && $row_codigo_barras['codigo_barras'] != $codigo_barras) {
        $errores['codigo_barras'] = "Ya existe un producto activo con el mismo código de barras.";
    }
    if ($cantidad_por_unidad ===''){
        $errores['cantidad_por_unidad'] = "La cantidad por unidad es obligatoria.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn,
        "UPDATE productos SET nombre = ?, descripcion = ?, tipo_medida = ?, codigo_barras = ?, cantidad_por_unidad = ? WHERE id_producto = ?"
    );
    mysqli_stmt_bind_param($stmt, "sssiii", $nombre, $descripcion, $tipo_medida, $codigo_barras, $cantidad_por_unidad, $id_producto);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "Producto no encontrado."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "Error al actualizar el producto."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── DELETE: eliminar producto ────────────────────────────────────────────────
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

    $stmt = mysqli_prepare($conn, "UPDATE productos SET activo= 0 WHERE id_producto = ?");
    mysqli_stmt_bind_param($stmt, "i", $id_producto);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "Producto no encontrado."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "Error al desactivar el producto."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── Método no permitido ──────────────────────────────────────────────────────
http_response_code(405);
echo json_encode(["success" => false, "errores" => ["general" => "Método no permitido."]], JSON_UNESCAPED_UNICODE);