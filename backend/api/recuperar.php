<?php

require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . "/config/env.php";

// Detectar entorno local
$isLocal = (
    $_SERVER['REMOTE_ADDR'] === '127.0.0.1' ||
    $_SERVER['REMOTE_ADDR'] === '::1'
);

// Configuración de sesión segura
session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => $isLocal ? '' : $_SERVER['HTTP_HOST'],
    'secure' => !$isLocal, // HTTPS en Render
    'httponly' => true,
    'samesite' => 'lax' 
]);

session_start();

header("Content-Type: application/json");

// Cargar variables de entorno si existen
$envFile = __DIR__ . "/../.env";
if (file_exists($envFile)) {
    loadEnv($envFile);
}

// Obtener datos del frontend
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data["correoModal"] ?? "");

$errors = [];

// Validación de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors["correoModal"] = "❗Ingrese un correo válido.";
}

// Verificar si el usuario existe
if (empty($errors)) {
    $sql = "SELECT correo FROM usuarios WHERE correo = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($result) === 0) {
        $errors["correoModal"] = "❗No existe una cuenta con ese correo.";
    }
}

// Si hay errores, responder
if (!empty($errors)) {
    echo json_encode([
        "success" => false,
        "errors" => $errors
    ]);
    exit;
}

// Generar código seguro
$code = strtoupper(bin2hex(random_bytes(4)));

// Guardar en sesión
$_SESSION["reset_code"] = $code;
$_SESSION["reset_email"] = $email;
$_SESSION["reset_expiration"] = time() + (15 * 60);


function sendToN8n($email, $code) {

    $url = "https://ceibasoftcare.app.n8n.cloud/webhook/reset-password";

    $payload = [
        "email" => $email,
        "code" => $code
    ];

    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    // Seguridad activa (NO desactivar SSL)
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json"
    ]);

    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

    $response = curl_exec($ch);
    $error = curl_error($ch);
    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    if ($error) {
        return ["success" => false, "error" => $error];
    }

    if ($statusCode >= 400) {
        return [
            "success" => false,
            "error" => "Error HTTP $statusCode",
            "response" => $response
        ];
    }

    return ["success" => true];
}

// Enviar a n8n
$result = sendToN8n($email, $code);

// Manejo de error
if (!$result["success"]) {
    echo json_encode([
        "success" => false,
        "error" => "Error enviando el correo",
        "detalle" => $result
    ]);
    exit;
}

// Respuesta final
echo json_encode([
    "success" => true,
    "message" => "Código enviado correctamente 📩"
]);
?>