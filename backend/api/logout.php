<?php
require_once __DIR__ . '/../config/cors.php';

header("Content-Type: application/json");

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
session_destroy();

echo json_encode(['status' => 'success', 'mensaje' => 'Sesión cerrada correctamente']);
?>
