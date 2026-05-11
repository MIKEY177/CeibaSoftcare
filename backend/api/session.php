<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . "/config/session_config.php";

header("Content-Type: application/json"); 


// Verificar si la sesión existe
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        "status" => "ok",
        "usuario" => $_SESSION['user_name'],
        "rol" => $_SESSION['user_rol']
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "mensaje" => "No hay sesión activa"
    ]);
}
