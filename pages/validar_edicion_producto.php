<?php
require_once "../conexion.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: inventario.php");
    exit;
}

$id_producto   = intval($_POST['id_producto']);
$nombre        = trim($_POST['nombre_producto']);
$descripcion   = trim($_POST['descripcion']);
$unidad_medida = trim($_POST['unidad_medida']);

// Errores
$nombre_error = "";
$descripcion_error = "";
$unidad_error = "";
$error_general = "";

// nombre
if (empty($nombre)) {
    $error_general = "faltan_datos";
} elseif (preg_match("/[0-9]/", $nombre)) {
    $nombre_error = "nombre_invalido";
}

// descripcion
if (!empty($descripcion)) {
    if (!preg_match("/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ,.\-]+$/", $descripcion)) {
        $descripcion_error = "descripcion_invalida";
    }
} else {
    $descripcion = "";
}

// unidad_medida
if (!empty($unidad_medida)) {
    if (!preg_match("/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/", $unidad_medida)) {
        $unidad_error = "unidad_invalida";
    }
} else {
    $unidad_medida = "";
}


if ($nombre_error || $descripcion_error || $unidad_error || $error_general) {

    $query = http_build_query([
        'modal' => 'editar',
        'id_producto' => $id_producto,
        'nombre_error' => $nombre_error,
        'descripcion_error' => $descripcion_error,
        'unidad_error' => $unidad_error,
        'error_general' => $error_general, 
        'nombre' => $nombre,
        'descripcion' => $descripcion,
        'unidad_medida' => $unidad_medida,
        'usuario' => $_POST['usuario'] ?? '',
        'id_usuario1' => $_POST['id_usuario1'] ?? ''
    ]);

    header("Location: inventario.php?$query");
    exit;
}

$sqlEdit = "UPDATE productos SET nombre = ?, descripcion = ?, unidad_medida = ? WHERE id_producto = ?";
$stmt = mysqli_prepare($conn, $sqlEdit);
mysqli_stmt_bind_param($stmt, "sssi", $nombre, $descripcion, $unidad_medida, $id_producto);

if (mysqli_stmt_execute($stmt)) {
    header("Location: inventario.php?actualizado=1");
    exit;
} else {
    echo "Error al actualizar el producto: " . mysqli_error($conn);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
