<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';

header("Content-Type: application/json"); 

$host = $_SERVER['HTTP_HOST'] ?? '';
$isLocal = strpos($host, 'localhost') !== false;

$isLocal = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');

session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => $isLocal ? '' : $_SERVER['HTTP_HOST'],
    'secure' => !$isLocal, // True en Render (HTTPS), False en Local
    'httponly' => true,
    'samesite' => 'Lax'  // None es necesario para Cross-Site en Render
]);

session_start();

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
