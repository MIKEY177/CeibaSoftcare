<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/conexion.php';

header("Content-Type: application/json"); 


// recibir datos de React
$data = json_decode(file_get_contents("php://input"), true);
$correo = $data['correo'];
$contrasena = $data['contrasena'];

// consulta con JOIN para traer el rol
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
        // guardar datos en sesión
        session_set_cookie_params([
            'lifetime' => 3600,
            'path' => '/',
            'domain' => 'localhost',
            'secure' => false,       // en desarrollo, sin HTTPS
            'httponly' => true,
            'samesite' => 'Lax'     // cambiado de 'None' para desarrollo sin HTTPS
        ]);

        session_start();
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