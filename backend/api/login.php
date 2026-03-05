<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/conexion.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// recibir datos de React
$data = json_decode(file_get_contents("php://input"), true);

$correo = $data['correo'];
$contrasena = $data['contrasena'];

// consulta
$sql = "SELECT * FROM usuarios WHERE correo = '$correo'";
$resultado = mysqli_query($conn,$sql);

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
        "mensaje" => "Usuario no encontrado"
    ]);
}

mysqli_close($conn);