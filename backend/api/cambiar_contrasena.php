<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
session_start();
$data = json_decode(file_get_contents("php://input"), true);

$contrasena   = trim($data["nuevaPass"]     ?? "");
$confirmacion = trim($data["confirmarPass"] ?? "");

$errors = [];

if ($contrasena === "") {
    $errors["nuevaPass"] = "❗La contraseña es obligatoria";
} else {
    $mensajes = [];
    
    if (!preg_match('/[a-z]/', $contrasena)) {
        $mensajes[] = "❗una letra minúscula";
    }
    if (!preg_match('/[A-Z]/', $contrasena)) {
        $mensajes[] = "❗una letra mayúscula";
    }
    if (!preg_match('/[0-9]/', $contrasena)) {
        $mensajes[] = "❗un número";
    }
    if (strlen($contrasena) < 8) {
        $mensajes[] = "❗mínimo 8 caracteres";
    }
    if (!preg_match('/[@$!%*?&.]/', $contrasena)) {
        $mensajes[] = "❗un carácter especial (@$!%*?&.)";
    }

    if (!empty($mensajes)) {
        $errors["nuevaPass"] = "La contraseña debe tener: " . implode(", ", $mensajes);
    }

    $sql = "SELECT contrasena FROM usuarios WHERE id_usuario = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $_SESSION["user_id"]);
    mysqli_stmt_execute($stmt);
    $resultado = mysqli_stmt_get_result($stmt);
    if (mysqli_num_rows($resultado) > 0) {
        $usuario = mysqli_fetch_assoc($resultado);
        if (password_verify($contrasena, $usuario['contrasena'])) {
            $errors["nuevaPass"] = "❗La nueva contraseña no puede ser igual a la actual";
        }
    }
}

if ($confirmacion === "") {
    $errors["confirmarPass"] = "❗Debe confirmar la contraseña";
} elseif ($contrasena !== "" && $contrasena !== $confirmacion) {
    $errors["confirmarPass"] = "❗Las contraseñas no coinciden";
}


if (count($errors) > 0) {
    echo json_encode(["success" => false, "errors" => $errors]);
    exit;
}

$id = $_SESSION["user_id"];
$passwordHash = password_hash($contrasena, PASSWORD_DEFAULT);

$sql  = "UPDATE usuarios SET contrasena = ? , cuenta_activa = 1 WHERE id_usuario = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "si", $passwordHash, $id);
mysqli_stmt_execute($stmt);

if (mysqli_stmt_affected_rows($stmt) > 0) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "❗No se pudo actualizar la contraseña"]);
}