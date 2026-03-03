<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "proyectoceiba";
$port = 3306;

$conn = mysqli_connect($host, $user, $password, $database, $port);

if (!$conn) {
    header("Content-Type: application/json");
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión a la base de datos"
    ]);
    exit;
}
?>