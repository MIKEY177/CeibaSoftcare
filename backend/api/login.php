<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/conexion.php';

header("Content-Type: application/json"); 

// recibir datos de React
$data = json_decode(file_get_contents("php://input"), true);
$correo = $data['correo'];
$contrasena = $data['contrasena'];

// consulta
$stmt = mysqli_prepare($conn, "SELECT * FROM usuarios WHERE correo = ?");
mysqli_stmt_bind_param($stmt, "s", $correo);
mysqli_stmt_execute($stmt);
$resultado = mysqli_stmt_get_result($stmt);

if(mysqli_num_rows($resultado) > 0){
    $usuario = mysqli_fetch_assoc($resultado);
    if(password_verify($contrasena,$usuario['contrasena'])){
        echo json_encode([
            "status" => "success",
            "mensaje" => "Login correcto",
            "usuario" => $usuario['nombre']
        ]);
    }else{
        echo json_encode([
            "status" => "error",
            "mensaje" => "Contraseña incorrecta"
        ]);
    }
}else{
    echo json_encode([
        "status" => "error",
        "mensaje" => "Correo no encontrado"
    ]);
}

mysqli_close($conn);