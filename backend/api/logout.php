<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';

header("Content-Type: application/json");

$isLocal = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');

session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => $isLocal ? '' : $_SERVER['HTTP_HOST'],
    'secure' => !$isLocal, // True en Render (HTTPS), False en Local
    'httponly' => true,
    'samesite' => 'Lax'// None es necesario para Cross-Site en Render
]);

session_start();
session_destroy();

echo json_encode(['status' => 'success', 'mensaje' => 'Sesión cerrada correctamente']);
?>
