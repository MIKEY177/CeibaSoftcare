<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';

header("Content-Type: application/json");
$host = $_SERVER['HTTP_HOST'] ?? '';
$isLocal = strpos($host, 'localhost') !== false;
$isLocal = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');

session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => $isLocal ? '' : $_SERVER['HTTP_HOST'],
    'secure' => !$isLocal, // True en Render (HTTPS), False en Local
    'httponly' => true,
    'samesite' =>'Lax' // None es necesario para Cross-Site en Render
]);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Método no permitido."]);
    exit;
}

$q = trim($_GET['q'] ?? '');

if (strlen($q) < 1) {
    echo json_encode(["success" => true, "data" => []]);
    exit;
}

$like = "%" . mysqli_real_escape_string($conn, $q) . "%";

$sql = "SELECT id_producto, nombre, codigo_barras, cantidad_por_unidad, tipo_medida
        FROM productos
        WHERE activo = 1
          AND (nombre LIKE ? OR codigo_barras LIKE ?)
        LIMIT 10";

$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "ss", $like, $like);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$productos = [];
while ($row = mysqli_fetch_assoc($result)) {
    $productos[] = $row;
}

echo json_encode(["success" => true, "data" => $productos], JSON_UNESCAPED_UNICODE);
mysqli_stmt_close($stmt);
mysqli_close($conn);
exit;