<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . '/config/session_config.php';
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Método no permitido."]);
    exit;
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "No autorizado."]);
    exit;
}

if ($_SESSION['user_rol'] !== 'administrador') {
    http_response_code(403);
    echo json_encode(["success" => false, "error" => "Acceso denegado."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT id_rol, nombre FROM roles";
    $result = mysqli_query($conn, $sql);
    $roles = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $roles[] = $row;
    }
    echo json_encode(["success" => true, "data" => $roles], JSON_UNESCAPED_UNICODE);
    mysqli_close($conn);
    exit;
}