<?php
session_start();
include 'conexion.php';

// Manejar registro de un detalle de salida desde este formulario
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'registrar_detalle') {
    $producto = isset($_POST['edpr-producto']) ? (int)$_POST['edpr-producto'] : 0;
    $cantidad = isset($_POST['edpr-cantidad']) ? (int)$_POST['edpr-cantidad'] : 0;
    $fecha_venc = isset($_POST['edpr-fecha_vencimiento']) && $_POST['edpr-fecha_vencimiento'] !== '' ? $_POST['edpr-fecha_vencimiento'] : null;
    $motivo = isset($_POST['edpr-motivo']) ? $_POST['edpr-motivo'] : '';
    $id_salida = isset($_POST['edpr-id_salida']) ? (int)$_POST['edpr-id_salida'] : (isset($_GET['id_salida']) ? (int)$_GET['id_salida'] : 0);

    if ($producto && $cantidad && $id_salida) {
        $sql = "INSERT INTO detalles_salidas_pro (cantidad, fecha_vencimiento, motivo, id_producto1, id_salida1) VALUES (?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "issii", $cantidad, $fecha_venc, $motivo, $producto, $id_salida);
        if (mysqli_stmt_execute($stmt)) {
            $msg = "Detalle agregado";
            $msg_type = "success";
        } else {
            $msg = "Error al agregar detalle: " . mysqli_error($conn);
            $msg_type = "error";
        }
        mysqli_stmt_close($stmt);
    }
}

// Obtener id_salida desde GET para mostrar detalles
$id_salida = isset($_GET['id']) ? (int)$_GET['id'] : 0;

// Obtener detalles de la salida (si hay id)
$detalles = array();
if ($id_salida) {
    $sql_det = "SELECT d.*, p.nombre AS producto_nombre FROM detalles_salidas_pro d LEFT JOIN productos p ON d.id_producto1 = p.id_producto WHERE d.id_salida1 = ? ORDER BY d.id_detalle_salida ASC";
    $stmt = mysqli_prepare($conn, $sql_det);
    if ($stmt) {
        mysqli_stmt_bind_param($stmt, "i", $id_salida);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        if ($res) {
            while ($row = mysqli_fetch_assoc($res)) {
                $detalles[] = $row;
            }
            mysqli_free_result($res);
        }
        mysqli_stmt_close($stmt);
    }
}

// Obtener productos para selects
$productos = array();
$sql_prod = "SELECT id_producto, nombre FROM productos ORDER BY nombre";
$result_prod = mysqli_query($conn, $sql_prod);
if ($result_prod) {
    while ($row = mysqli_fetch_assoc($result_prod)) {
        $productos[] = $row;
    }
}
?>

<!DOCTYPE html>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/main_style.css">
    <title>Detalles de Salida - SoftCare</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <main>
        <aside class="vertical-navbar">
            <div class="perfil">
                <figure class="avatar">
                    <img class="avatar-img" src="" alt="">
                </figure>
                <h1 class="perfil-nombre">[Username...]</h1>
                <figure class="perfil-rol">
                    <img class="perfil-rol-img" src="" alt="">
                    <h1 class="perfil-rol-texto">[Rol]</h1>
                </figure>
            </div>
            <div class="contenedor-nav">
                <a href=""><h2 class="opcion-nav">Inventario</h2></a>
                <a href=""><h2 class="opcion-nav">Salidas Productos</h2></a>
                <a href=""><h2 class="opcion-nav">Entradas Productos</h2></a>
                <a href=""><h2 class="opcion-nav">Brigadas</h2></a>
            </div>
            <a href=""><button class="cerrar-sesion-btn">Cerrar Sesión</button></a>
        </aside>
        <section class="secciones-area-gestion">
            <h2 class="titulo-dashboard">Detalles de la salida N°<?php echo $id_salida; ?> <!-- Variable --></h2>
            </h2> <!-- Variable -->
            <section class="seccion1-busqueda-agregar">
                <form class="busqueda-form" action="" method=""> <!-- FORMULARIO -->
                    <input class="busqueda-input1" type="text" name="busqueda" placeholder="Busca un producto" id="">
                    <button class="busqueda-icono" type="submit">
                        <img class="busqueda-icono-img" src="" alt="">
                    </button>
                </form>
                <a href="">
                    <button class="registrar-btn">Registrar Producto de la salida</button>
                </a>
            </section>
            <table class="tabla-salidas-detalles">
                <thead class="header-tabla-salidas-detalles">
                    <tr>
                        <td>Producto</td>
                        <td>Cantidad</td>
                        <td>Fecha de Vencimiento</td>
                        <td>Motivo</td>
                        <td>Editar | Eliminar</td>
                    </tr>
                </thead>
                <tbody class="body-tabla-salidas-detalles">
                    <?php foreach ($detalles as $detalle): ?>
                    <tr><!-- Este tr es el que se repite en Backend -->
                        <td><?php echo htmlspecialchars($detalle['producto_nombre']); ?></td>
                        <td><?php echo htmlspecialchars($detalle['cantidad']); ?></td>
                        <td><?php echo htmlspecialchars($detalle['fecha_vencimiento']); ?></td>
                        <td><?php echo htmlspecialchars($detalle['motivo']); ?></td>
                        <td>
                            <a href="">
                                <button class="editar-btn">
                                    <span class="material-icons">edit</span>
                                </button>
                            </a>
                            <a href="">
                                <button class="eliminar-btn">
                                    <span class="material-icons">delete</span>
                                </button>
                            </a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>    
            </table>
        </section>
    </main>
    <footer>
        <p>Derechos Reservados(menos a GatitoFeroz).</p>
        <section class="asociaciones">
            <div class="softcare">
                <figure class="softcare-logo">
                    <img class="softcare-logo-img" src="" alt="">
                </figure>
                <h6 class="softcare-titulo">SoftCare</h6>
            </div>
            <div class="ceiba">
                <figure class="ceiba-logo">
                    <img class="ceiba-logo-img" src="" alt="">
                </figure>
                <h6 class="ceiba-titulo">Ceiba</h6>
            </div>
            <div class="sena">
                <figure class="sena-logo">
                    <img class="sena-logo-img" src="" alt="">
                </figure>
                <h6 class="sena-titulo">Sena</h6>
            </div>
        </section>
    </footer>
    <aside class="modal-salida-detalle-registrar">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <h1 class="modal-edpr-titulo">
            Registre un Producto en la Salida N°[Id_salida] <!-- Variable-->
        </h1>
        <a href="">
            <h2>Escanear con Lector de Barras</h2>
            <figure class="codigo-barras-icono">
                <img class="codigo-barras-icono-img" src="" alt="">
            </figure>
        </a>
        <form class="edpr-form" action="" method=""> <!-- Formulario -->
            <section class="edpr-form-inputs-area">
                <label class="edpr-label" for="">Producto que ingresó<h6 class="obligatorio">*</h6></label>
                <select class="edpr-input1" name="edpr-producto">
                    <option value="seleccionar" default> - Seleccionar - </option> <!-- Aquí va el CICLO (los otros no llevan default) -->
                </select>
                <!---->
                <label class="edpr-label" for="">Motivo de Salida</label>
                <textarea class="edpr-input2" name="edpr-motivo" id=""></textarea>
                <!---->
                <label class="edpr-label" for="">Cantidad<h6 class="obligatorio">*</h6></label>
                <input class="edpr-input3" type="text" name="edpr-cantidad">
                <!---->
                <label class="edpr-label" for="">Fecha de Vencimiento</label>
                <input class="edpr-input4" type="date" name="edpr-fecha_vencimiento">
                <!---->
                <label class="edpr-label" for="">N° de Salida</label>
                <div class="union-input-icono">
                    <input class="edpr-input5" type="text" name="edpr-id_salida" value="[id_salida]"> <!--En el value="" va el id de la salida registrado-->
                    <figure class="candado-icono">
                        <img class="candado-icono-img" src="" alt="">
                    </figure>
                </div>
                <!---->
            </section>
            <input class="edpr-btn" type="submit" value="Registrar Producto en la Salida">
        </form>
    </aside>
    <aside class="modal-salida-detalle-editar">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <h1 class="modal-edped-titulo">
            Editar Producto en la Salida N°[Id_salida] <!-- Variable-->
        </h1>
        <form class="edped-form" action="" method=""> <!-- Formulario -->
            <section class="edped-form-inputs-area">
                <label class="edped-label" for="">Producto que ingresó<h6 class="obligatorio">*</h6></label>
                <select class="edped-input1" name="edped-producto">
                    <option value="seleccionar" default>[Producto_ya_seleccionado]</option> <!-- Aquí va el CICLO (los otros no llevan default) -->
                </select>
                <!---->
                <label class="edped-label" for="">Motivo de Salida</label>
                <textarea class="edped-input2" name="edped-motivo" id="">[Motivo_ya_registrado]</textarea>
                <!---->
                <label class="edped-label" for="">Cantidad<h6 class="obligatorio">*</h6></label>
                <input class="edped-input3" type="text" name="edped-cantidad" value="[Cantidad_ya_registrada]">
                <!---->
                <label class="edped-label" for="">Fecha de Vencimiento</label>
                <input class="edped-input4" type="date" name="edped-fecha_vencimiento" value="[Fecha_ya_registrada]">
                <!---->
                <label class="edped-label" for="">N° de Salida</label>
                <div class="union-input-icono">
                    <input class="edped-input5" type="text" name="edped-id_salida" value="[id_salida]"> <!--En el value="" va el id de la salida registrado-->
                    <figure class="candado-icono">
                        <img class="candado-icono-img" src="" alt="">
                    </figure>
                </div>
                <!---->
            </section>
            <input class="edpr-btn" type="submit" value="Realizar cambios">
        </form>
    </aside>
    <aside class="modal-salida-detalle-eliminar">
        <h1 class="modal-edpel-titulo">Eliminar Producto de la Salida</h1>
        <h3 class="modal-edpel-mensaje">¿Desea eliminar <h6 class="subrayar">[Nombre Producto]</h6> de la Salida?</h3> <!-- [Nombre Producto] es Variable-->
        <section class="modal-buttons">
            <a href=""><button class="eliminar-btn">Eliminar</button></a>
            <a href=""><button class="cancelar-btn">Cancelar</button></a>
        </section>
    </aside>
</body>
</html>