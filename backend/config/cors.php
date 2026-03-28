<?php
// Permitir origen específico (tu frontend en Vite usa 5173)
header("Access-Control-Allow-Origin: http://localhost:5173, https://ceiba-softcare-7ar7.onrender.com");

// Permitir envío de cookies/sesiones
header("Access-Control-Allow-Credentials: true");

// Encabezados y métodos permitidos
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// Responder rápido a preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
