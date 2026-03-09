<?php
require_once __DIR__ . '/../config/cors.php';

header("Content-Type: application/json");

session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'None'
]);

session_start();
session_destroy();

echo json_encode(['status' => 'success', 'mensaje' => 'Sesión cerrada correctamente']);
?>
