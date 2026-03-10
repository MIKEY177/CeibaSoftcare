<?php
// Configuración centralizada de sesión
// Detecta el host actual del servidor
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';

// Configura los parámetros de la cookie de sesión
session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => '',  // Dejar vacío para que funcione en localhost
    'secure' => false,       // false en desarrollo (sin HTTPS)
    'httponly' => true,
    'samesite' => 'Lax'
]);

// Iniciar sesión
session_start();
?>
