<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/conexion.php';

header("Content-Type: application/json"); 
session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,       // en desarrollo, sin HTTPS
    'httponly' => true,
    'samesite' => 'None'     // clave: permite enviar cookie en cross-origin
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
