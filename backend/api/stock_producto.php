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

$id = intval($_GET['id']);

$stmt = mysqli_prepare($conn, "SELECT cantidad_actual FROM stocks WHERE id_producto1 = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$row = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);
mysqli_close($conn);

if (!$row) {
    echo json_encode(['success' => false, 'stock' => 0], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['success' => true, 'stock' => (float)$row['cantidad_actual']], JSON_UNESCAPED_UNICODE);