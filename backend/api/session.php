<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/conexion.php';

header("Content-Type: application/json"); 

// Configuración de sesión para localhost
session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => '',  // Dejar vacío para que funcione en localhost
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
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
