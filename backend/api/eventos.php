<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';

header("Content-Type: application/json");

$debug = (getenv('APP_ENV') === 'aiven' || (isset($_SERVER['APP_ENV']) && $_SERVER['APP_ENV'] === 'local'));
  
$sql = "SELECT id_evento, nombre, lugar, descripcion, fecha_hora FROM eventos ORDER BY fecha_hora ASC LIMIT 5";
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

$eventos = [];

while ($row = mysqli_fetch_assoc($result)) {
    $eventos[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $eventos
], JSON_UNESCAPED_UNICODE);

if (isset($result) && $result) mysqli_free_result($result);
if (isset($conn) && $conn) mysqli_close($conn);