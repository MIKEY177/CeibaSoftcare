<?php
include("conexion.php");

$nombre = "Ceiba";
$email = "ceibasoftcare@gmail.com";
$password_plana = "@CeibaSoftcare2025";
$rol = 1;

// Hashear contraseña
$password_hash = password_hash($password_plana, PASSWORD_DEFAULT);

// Insertar usuario
$sql = "INSERT INTO usuarios (nombre, correo, contrasena, id_rol1) 
        VALUES ('$nombre', '$email', '$password_hash', '$rol')";

if (mysqli_query($conn, $sql)) {
    echo "Usuario creado correctamente";
} else {
    echo "Error: " . mysqli_error($conn);
}
?>