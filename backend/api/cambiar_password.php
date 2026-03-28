<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
session_start();

if (!isset($_SESSION["reset_email"])) {
    echo json_encode(["success" => false, "error" => "Sesión de recuperación inválida"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$contrasena   = trim($data["nuevaPass"]     ?? "");
$confirmacion = trim($data["confirmarPass"] ?? "");

$errors = [];

if ($contrasena === "") {
    $errors["nuevaPass"] = "La contraseña es obligatoria";
} else {
    $mensajes = [];
    
    if (!preg_match('/[a-z]/', $contrasena)) {
        $mensajes[] = "una letra minúscula";
    }
    if (!preg_match('/[A-Z]/', $contrasena)) {
        $mensajes[] = "una letra mayúscula";
    }
    if (!preg_match('/[0-9]/', $contrasena)) {
        $mensajes[] = "un número";
    }
    if (strlen($contrasena) < 8) {
        $mensajes[] = "mínimo 8 caracteres";
    }
    if (!preg_match('/[@$!%*?&.]/', $contrasena)) {
        $mensajes[] = "un carácter especial (@$!%*?&.)";
    }

    if (!empty($mensajes)) {
        $errors["nuevaPass"] = "La contraseña debe tener: " . implode(", ", $mensajes);
    }
}

if ($confirmacion === "") {
    $errors["confirmarPass"] = "Debe confirmar la contraseña";
} elseif ($contrasena !== "" && $contrasena !== $confirmacion) {
    $errors["confirmarPass"] = "Las contraseñas no coinciden";
}


if (count($errors) > 0) {
    echo json_encode(["success" => false, "errors" => $errors]);
    exit;
}

$correo       = $_SESSION["reset_email"];
$passwordHash = password_hash($contrasena, PASSWORD_DEFAULT);

$sql  = "UPDATE usuarios SET contrasena = ? WHERE correo = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "ss", $passwordHash, $correo);
mysqli_stmt_execute($stmt);

if (mysqli_stmt_affected_rows($stmt) > 0) {
    unset($_SESSION["reset_email"]);
    unset($_SESSION["reset_code"]);
    unset($_SESSION["reset_expiration"]);
    unset($_SESSION["code_verified"]);
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "No se pudo actualizar la contraseña"]);
}