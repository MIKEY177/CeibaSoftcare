<?php
require_once "../conexion.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: inventario.php");
    exit;
}

$nombre        = trim($_POST['nombre_producto']);
$descripcion   = trim($_POST['descripcion']);
$unidad_medida = trim($_POST['unidad_medida']);
$id_usuario    = intval($_POST['id_usuario']); 

$nombre_error = "";
$descripcion_error = "";
$unidad_error = "";
$usuario_error = "";
$error_general = "";

// Validación nombre
if (empty($nombre)) {
    $error_general = "faltan_datos";
} elseif (preg_match("/[0-9]/", $nombre)) {
    $nombre_error = "nombre_invalido";
}

// Validación descripción
if (!empty($descripcion)) {
    if (!preg_match("/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ,.\-]+$/", $descripcion)) {
        $descripcion_error = "descripcion_invalida";
    }
} else {
    $descripcion = null;
}

// Validación unidad de medida
if (!empty($unidad_medida)) {
    if (!preg_match("/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/", $unidad_medida)) {
        $unidad_error = "unidad_invalida";
    }
} else {
    $unidad_medida = null;
}

// Validación usuario
if (empty($id_usuario)) {
    $usuario_error = "usuario_inexistente";
}

if ($nombre_error || $descripcion_error || $unidad_error || $usuario_error || $error_general) {

    $query = http_build_query([
        'modal' => 'registrar',
        'nombre_error' => $nombre_error,
        'descripcion_error' => $descripcion_error,
        'unidad_error' => $unidad_error,
        'usuario_error' => $usuario_error,
        'error' => $error_general,
        'nombre_producto' => $nombre,
        'descripcion' => $descripcion,
        'unidad_medida' => $unidad_medida,
        'id_usuario' => $id_usuario
    ]);

    header("Location: inventario.php?$query");
    exit;
}

$sql = "INSERT INTO productos (nombre, descripcion, unidad_medida, id_usuario1) VALUES (?, ?, ?, ?)";

$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "sssi", $nombre, $descripcion, $unidad_medida, $id_usuario);

if (mysqli_stmt_execute($stmt)) {
    header("Location: inventario.php?registro=ok");
} else {
    echo "Error al registrar: " . mysqli_error($conn);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
