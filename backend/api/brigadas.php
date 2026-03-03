<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/conexion.php';

header("Content-Type: application/json");

$debug = (getenv('APP_ENV') === 'development' || (isset($_SERVER['APP_ENV']) && $_SERVER['APP_ENV'] === 'development'));

$sql = "SELECT id_brigada, nombre, lugar, descripcion, fecha_hora FROM brigadas ORDER BY fecha_hora ASC LIMIT 5";
$result = mysqli_query($conn, $sql);

if (!$result) {
    http_response_code(500);
    $msg = $debug ? mysqli_error($conn) : "Error en la consulta";
    echo json_encode([
        "success" => false,
        "error" => $msg
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$brigadas = [];

while ($row = mysqli_fetch_assoc($result)) {
    $brigadas[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $brigadas
], JSON_UNESCAPED_UNICODE);

if (isset($result) && $result) mysqli_free_result($result);
if (isset($conn) && $conn) mysqli_close($conn);