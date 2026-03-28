<?php
require_once("../config/conexion.php");
require_once("../config/cors.php");

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