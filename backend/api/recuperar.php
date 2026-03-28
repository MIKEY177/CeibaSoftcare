<?php

require_once("../config/conexion.php");
require_once("../config/cors.php");
require_once("../config/env.php");

session_start();

header("Content-Type: application/json");

// cargar .env si estás en local
if (!getenv('APP_ENV')) {
    loadEnv(__DIR__ . "/../.env");
}

// 🔹 obtener datos
$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data["correoModal"] ?? "");

$errors = [];

// 🔹 validación
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors["correoModal"] = "Ingrese un correo válido.";
}

if (empty($errors)) {
    $sql = "SELECT correo FROM usuarios WHERE correo = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($result) === 0) {
        $errors["correoModal"] = "No existe una cuenta con ese correo.";
    }
}

// 🔴 si hay errores
if (!empty($errors)) {
    echo json_encode([
        "success" => false,
        "errors" => $errors
    ]);
    exit;
}

// 🔹 generar código
$code = bin2hex(random_bytes(4));

$_SESSION["reset_code"] = $code;
$_SESSION["reset_email"] = $email;
$_SESSION["reset_expiration"] = time() + (15 * 60);

// 🔥 ENVIAR CORREO CON RESEND
function sendEmail($to, $subject, $html) {
    $apiKey = getenv('RESEND_API_KEY');

    if (!$apiKey) {
        return ["success" => false, "error" => "API KEY no configurada"];
    }

    $ch = curl_init("https://api.resend.com/emails");

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);

    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiKey",
        "Content-Type: application/json"
    ]);

    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "from" => "CEIBA SOFTCARE <onboarding@resend.dev>",
        "to" => [$to],
        "subject" => $subject,
        "html" => $html
    ]));

    $response = curl_exec($ch);
    $error = curl_error($ch);

    curl_close($ch);

    if ($error) {
        return ["success" => false, "error" => $error];
    }

    return ["success" => true, "response" => json_decode($response, true)];
}

// 🔹 contenido del correo
$html = "
    <h2>Recuperación de contraseña</h2>
    <p>Tu código de recuperación es:</p>
    <h1 style='color:#2c7be5;'>$code</h1>
    <p>Este código expira en 15 minutos.</p>
";

// 🔹 enviar correo
$resultEmail = sendEmail($email, "Recuperación de contraseña", $html);

// 🔴 error al enviar
if (!$resultEmail["success"]) {
    echo json_encode([
        "success" => false,
        "error" => $resultEmail["error"]
    ]);
    exit;
}

// ✅ éxito
echo json_encode([
    "success" => true,
    "message" => "Código enviado correctamente 🚀"
]);