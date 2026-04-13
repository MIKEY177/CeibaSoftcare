<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';

header("Content-Type: application/json");

$isLocal = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');

session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => $isLocal ? '' : $_SERVER['HTTP_HOST'],
    'secure' => !$isLocal, 
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

$data = json_decode(file_get_contents("php://input"), true);
$correo = trim($data['correo'] ?? '');
$contrasena = $data['contrasena'] ?? '';

$errors = [];

if (empty($correo)) {
    $errors['correo'] = "❗El correo es obligatorio.";
} elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    $errors['correo'] = "❗Ingrese un correo válido.";
}

if (empty($contrasena)) {
    $errors['contrasena'] = "❗La contraseña es obligatoria.";
}

if (!empty($errors)) {
    echo json_encode(["status" => "error", "errors" => $errors]);
    exit;
}

$stmt = mysqli_prepare($conn, 
    "SELECT u.id_usuario, u.nombre, u.contrasena, r.nombre AS rol 
     FROM usuarios u 
     INNER JOIN roles r ON u.id_rol1 = r.id_rol 
     WHERE u.correo = ?"
);

if (!$stmt) {
    echo json_encode(["status" => "error", "mensaje" => "❗Correo no encontrado."]);
    exit;
}

mysqli_stmt_bind_param($stmt, "s", $correo);
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);
$usuario_id_para_log = null;
$login_exitoso = false;
$respuesta = [];

if (mysqli_num_rows($resultado) > 0) {
    $usuario = mysqli_fetch_assoc($resultado);
    $usuario_id_para_log = $usuario['id_usuario'];

    if (password_verify($contrasena, $usuario['contrasena'])) {
        $_SESSION['user_id'] = $usuario['id_usuario'];
        $_SESSION['user_name'] = $usuario['nombre'];
        $_SESSION['user_rol'] = $usuario['rol'];

        $login_exitoso = true;
        $respuesta = [
            "status" => "success",
            "mensaje" => "Login correcto",
            "usuario" => $usuario['nombre'],
            "rol" => $usuario['rol']
        ];
    } else {
        $respuesta = ["status" => "error", "mensaje" => "❗Contraseña incorrecta."];
    }
} else {
    $respuesta = ["status" => "error", "mensaje" => "❗No existe una cuenta con ese correo."];
}

$sql_log = "INSERT INTO inicio_sesion (correo, contrasena, id_usuario1) VALUES (?, ?, ?)";
$stmt_log = mysqli_prepare($conn, $sql_log);
$contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);
mysqli_stmt_bind_param($stmt_log, "ssi", $correo, $contrasena_hash, $usuario_id_para_log);
mysqli_stmt_execute($stmt_log);

echo json_encode($respuesta);

mysqli_close($conn);
?>