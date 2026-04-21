<?php
// Configuración centralizada de sesión
// Detecta el host actual del servidor
$isLocal = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');

session_set_cookie_params([
    'lifetime' => 2592000, // 30 días en segundos
    'path' => '/',
    'domain' => $isLocal ? '' : $_SERVER['HTTP_HOST'],
    'secure' => !$isLocal, // True en Render (HTTPS), False en Local
    'httponly' => true,
    'samesite' => 'Lax' // None es necesario para Cross-Site en Render
]);

ini_set('session.gc_maxlifetime', 2592000); // 30 días

// Iniciar sesión
session_start();
?>
