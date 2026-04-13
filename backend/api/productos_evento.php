<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';

header("Content-Type: application/json");
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'GET' || empty($_GET['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false], JSON_UNESCAPED_UNICODE);
    exit;
}

$id_evento = intval($_GET['id']);

$stmt = mysqli_prepare($conn,
    "SELECT dp.id_producto1 AS id_producto, p.nombre, p.tipo_medida,
            p.cantidad_por_unidad, dp.cantidad_presentacion, dp.cantidad_total
     FROM detalles_salidas_pro dp
     JOIN productos p ON p.id_producto = dp.id_producto1
     JOIN salidas_productos sp ON sp.id_salida = dp.id_salida1
     WHERE sp.id_evento1 = ? AND dp.activo = 1"
);
mysqli_stmt_bind_param($stmt, "i", $id_evento);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$productos = [];
while ($row = mysqli_fetch_assoc($result)) {
    $productos[] = $row;
}

mysqli_stmt_close($stmt);
mysqli_close($conn);

echo json_encode(['success' => true, 'data' => $productos], JSON_UNESCAPED_UNICODE);