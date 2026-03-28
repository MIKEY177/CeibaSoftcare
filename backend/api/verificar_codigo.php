<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';

$isLocal = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');

session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => $isLocal ? '' : $_SERVER['HTTP_HOST'],
    'secure' => !$isLocal, // True en Render (HTTPS), False en Local
    'httponly' => true,
    'samesite' =>  'Lax' // None es necesario para Cross-Site en Render
]);

session_start();

$data = json_decode(file_get_contents("php://input"), true);

$codigo = trim($data["codigo"] ?? "");

if ($codigo === "") {
    echo json_encode([
        "success" => false,
        "error" => "El código es obligatorio."
    ]);
    exit;
}

if (
    isset($_SESSION['reset_code'], $_SESSION['reset_expiration']) &&
    $codigo === $_SESSION['reset_code'] &&
    time() < $_SESSION['reset_expiration']
) {

    $_SESSION['code_verified'] = true;

    echo json_encode([
        "success" => true,
        "mensaje" => "Código correcto"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "error" => "Código inválido o expirado"
    ]);
}