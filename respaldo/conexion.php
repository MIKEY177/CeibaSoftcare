<?php
function conectarBD($host = 'localhost', $user = 'root', $pass = '', $db = 'proyectoceiba', $port = 3306) {
    $conn = mysqli_connect($host, $user, $pass, $db, $port);

    if (!$conn) {
        die('Error al conectar: ' . mysqli_connect_error());
    }

    return $conn;
}

$conn = conectarBD();
?>