<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';

header("Content-Type: application/json");

// 🔥 CONFIGURAR SESIÓN SIEMPRE
$isLocal = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');

session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => $isLocal ? '' : $_SERVER['HTTP_HOST'],
    'secure' => !$isLocal, // True en Render (HTTPS), False en Local
    'httponly' => true,
    'samesite' => 'Lax'// None es necesario para Cross-Site en Render
]);
session_start();

// 🔹 recibir datos
$data = json_decode(file_get_contents("php://input"), true);
$correo = $data['correo'] ?? '';
$contrasena = $data['contrasena'] ?? '';

// 🔹 consulta
$stmt = mysqli_prepare($conn, 
    "SELECT u.id_usuario, u.nombre, u.contrasena, r.nombre AS rol 
     FROM usuarios u 
     INNER JOIN roles r ON u.id_rol1 = r.id_rol 
     WHERE u.correo = ?"
);

mysqli_stmt_bind_param($stmt, "s", $correo);
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);

if(mysqli_num_rows($resultado) > 0){
    $usuario = mysqli_fetch_assoc($resultado);

    if(password_verify($contrasena, $usuario['contrasena'])){

        // 🔥 guardar sesión
        $_SESSION['user_id'] = $usuario['id_usuario'];
        $_SESSION['user_name'] = $usuario['nombre'];
        $_SESSION['user_rol'] = $usuario['rol'];

        echo json_encode([
            "status" => "success",
            "mensaje" => "Login correcto",
            "usuario" => $usuario['nombre'],
            "rol" => $usuario['rol']
        ]);

    } else {
        echo json_encode([
            "status" => "error",
            "mensaje" => "Contraseña incorrecta"
        ]);
    }

} else {
    echo json_encode([
        "status" => "error",
        "mensaje" => "Correo no encontrado"
    ]);
}

mysqli_close($conn);