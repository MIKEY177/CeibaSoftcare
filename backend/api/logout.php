<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . "/config/session_config.php";

header("Content-Type: application/json");

session_destroy();

echo json_encode(['status' => 'success', 'mensaje' => 'Sesión cerrada correctamente']);
?>
