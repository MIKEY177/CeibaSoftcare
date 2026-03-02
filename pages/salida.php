<?php
session_start();
include 'conexion.php';

// Procesar registrar salida
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'registrar') {
    $fecha_hora = isset($_POST['fecha_hora']) ? $_POST['fecha_hora'] : '';
    $observaciones = isset($_POST['observaciones']) ? $_POST['observaciones'] : '';
    
    if ($fecha_hora) {
        $sql = "INSERT INTO salidas_productos (fecha_hora, observaciones) VALUES (?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $fecha_hora, $observaciones);
        if (mysqli_stmt_execute($stmt)) {
            $msg = "Salida registrada";
            $msg_type = "success";
        } else {
            $msg = "Error al registrar: " . mysqli_error($conn);
            $msg_type = "error";
        }
        mysqli_stmt_close($stmt);
    }
}

// Procesar editar salida
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'editar') {
    $id_salida = isset($_POST['id_salida']) ? (int)$_POST['id_salida'] : 0;
    $fecha_hora = isset($_POST['fecha_hora']) ? $_POST['fecha_hora'] : '';
    $observaciones = isset($_POST['observaciones']) ? $_POST['observaciones'] : '';
    
    if ($id_salida && $fecha_hora) {
        $sql = "UPDATE salidas_productos SET fecha_hora = ?, observaciones = ? WHERE id_salida = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ssi", $fecha_hora, $observaciones, $id_salida);
        if (mysqli_stmt_execute($stmt)) {
            $msg = "Salida actualizada";
            $msg_type = "success";
        } else {
            $msg = "Error al actualizar: " . mysqli_error($conn);
            $msg_type = "error";
        }
        mysqli_stmt_close($stmt);
    }
}

// Procesar eliminar salida
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'eliminar') {
    $id_salida = isset($_POST['id_salida']) ? (int)$_POST['id_salida'] : 0;
    if ($id_salida) {
        $sql = "DELETE FROM salidas_productos WHERE id_salida = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "i", $id_salida);
        if (mysqli_stmt_execute($stmt)) {
            $msg = "Salida eliminada";
            $msg_type = "success";
        } else {
            $msg = "Error al eliminar: " . mysqli_error($conn);
            $msg_type = "error";
        }
        mysqli_stmt_close($stmt);
    }
}

// Procesar registro de producto en salida
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'registrar_producto') {
    $producto = isset($_POST['edpr-producto']) ? (int)$_POST['edpr-producto'] : 0;
    $cantidad = isset($_POST['edpr-cantidad']) ? (int)$_POST['edpr-cantidad'] : 0;
    $fecha_venc = isset($_POST['edpr-fecha_vencimiento']) && $_POST['edpr-fecha_vencimiento'] !== '' ? $_POST['edpr-fecha_vencimiento'] : null;
    $motivo = isset($_POST['edpr-motivo']) ? $_POST['edpr-motivo'] : '';
    $id_salida = isset($_POST['edpr-id_salida']) ? (int)$_POST['edpr-id_salida'] : 0;

    if ($producto && $cantidad && $id_salida) {
        $sql = "INSERT INTO detalles_salidas_pro (cantidad, fecha_vencimiento, motivo, id_producto1, id_salida1) VALUES (?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "issii", $cantidad, $fecha_venc, $motivo, $producto, $id_salida);
        if (mysqli_stmt_execute($stmt)) {
            $msg = "Producto agregado a la salida";
            $msg_type = "success";
        } else {
            $msg = "Error al agregar producto: " . mysqli_error($conn);
            $msg_type = "error";
        }
        mysqli_stmt_close($stmt);
    }
}

// Obtener salidas para mostrar en tabla
$salidas = array();
$sql_list = "SELECT * FROM salidas_productos ORDER BY fecha_hora DESC";
$result_list = mysqli_query($conn, $sql_list);
if ($result_list) {
    while ($row = mysqli_fetch_assoc($result_list)) {
        $salidas[] = $row;
    }
}

// Obtener productos para dropdown en detalle
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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/main_style.css">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <title>Salidas - SoftCare</title>
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
            <section class="seccion1-busqueda-agregar">
                <form class="busqueda-form" action="" method=""> <!-- FORMULARIO -->
                    <input class="busqueda-input1" type="text" name="busqueda" placeholder="Busca una salida" id="">
                    <button class="busqueda-icono" type="submit">
                        <img class="busqueda-icono-img" src="" alt="">
                    </button>
                </form>
                <a href="">
                    <button class="registrar-btn">Registrar Salida del Producto</button>
                </a>
            </section>
            <table class="tabla-salidas">
                <thead class="header-tabla-salidas">
                    <tr>
                        <td>Fecha y Hora</td>
                        <td>Observaciones</td>
                        <td>Detalles del Registro</td>
                        <td>Editar | Eliminar</td>
                    </tr>
                </thead>
                <tbody class="body-tabla-salidas">
                    <?php if (!empty($msg)): ?>
                        <tr><td colspan="4" class="message <?php echo $msg_type; ?>"><?php echo $msg; ?></td></tr>
                    <?php endif; ?>
                    <?php foreach ($salidas as $salida): ?>
                    <tr>
                        <td><?php echo date('d/m/Y H:i:s', strtotime($salida['fecha_hora'])); ?></td>
                        <td><?php echo htmlspecialchars($salida['observaciones']); ?></td>
                        <td>
                            <a href="detalles_salida.php?id=<?php echo $salida['id_salida']; ?>">
                                <button class="ver-detalles-btn">Ver Detalles</button>
                            </a>
                        </td>
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
    <aside class="modal-salida-registrar">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <h1 class="modal-epr-titulo">
            Registre una nueva Salida de Productos
        </h1>
        <form class="epr-form" action="salida.php" method="POST"> <!-- Formulario -->
            <input type="hidden" name="action" value="registrar">
            <section class="epr-form-inputs-area">
                <label class="epr-label" for="">Fecha y Hora de Salida<h6 class="obligatorio">*</h6></label>
                <input class="epr-input1" type="datetime-local" name="fecha_hora">
                <!---->
                <label class="epr-label" for="">Observaciones de la Salida</label>
                <textarea class="epr-input2" name="observaciones" id=""></textarea>
                <!---->
                <section class="epr-form-detalles-area">
                    <div class="epr-form-detalles-header">
                        <h2>Detalles de la Salida</h2>
                        <button type="button" class="epr-agregar-detalles-btn">Agregar Producto</button>
                    </div>
                    <table class="tabla-epr-detalles">
                        <thead class="header-tabla-epr-detalles">
                            <tr>
                                <td>Producto</td>
                                <td>Cantidad</td>
                                <td>Fecha de Vencimiento</td>
                                <td>Motivo</td>
                                <td>Eliminar</td>
                            </tr>
                        </thead>
                        <tbody class="body-tabla-epr-detalles">
                            <!-- plantilla oculta para nuevos detalles -->
                            <tr class="detalle-template" style="display:none;">
                                <td>
                                    <select name="det-producto[]" class="det-producto">
                                        <option value="">- Seleccionar -</option>
                                        <?php foreach($productos as $prod): ?>
                                            <option value="<?php echo $prod['id_producto']; ?>"><?php echo htmlspecialchars($prod['nombre']); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </td>
                                <td><input type="number" name="det-cantidad[]" class="det-cantidad" min="1"></td>
                                <td><input type="date" name="det-fecha_venc[]" class="det-fecha_venc"></td>
                                <td><input type="text" name="det-motivo[]" class="det-motivo"></td>
                                <td><button type="button" class="det-eliminar-btn">X</button></td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </section>
            <input class="epr-btn" type="submit" value="Registrar Salida">
        </form>
    </aside>
    <script>
        // manejar agregados de detalle en modal de registro
        document.addEventListener('DOMContentLoaded', function(){
            var addBtn = document.querySelector('.epr-agregar-detalles-btn');
            var tbody = document.querySelector('.body-tabla-epr-detalles');
            if(addBtn && tbody) {
                addBtn.addEventListener('click', function(){
                    var template = document.querySelector('.detalle-template');
                    if(template) {
                        var clone = template.cloneNode(true);
                        clone.style.display='';
                        clone.classList.remove('detalle-template');
                        tbody.appendChild(clone);
                        // escuchar botón eliminar dentro del nuevo renglón
                        clone.querySelector('.det-eliminar-btn').addEventListener('click', function(){
                            clone.remove();
                        });
                    }
                });
            }
        });
    </script>
    <aside class="modal-salida-editar">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <h1 class="modal-eped-titulo">
            Registre una nueva Salida de Productos
        </h1>
        <form class="eped-form" action="" method=""> <!-- Formulario -->
            <section class="eped-form-inputs-area">
                <label class="eped-label" for="">Fecha y Hora de Salida<h6 class="obligatorio">*</h6></label>
                <input class="eped-input1" type="datetime-local" name="eped-fecha_hora_salida" value="[Fecha_ya_registrada]">
                <!---->
                <label class="eped-label" for="">Observaciones de la Salida</label>
                <textarea class="eped-input2" name="eped-observaciones" id="">[Observación_ya_registrada]</textarea>
                <!---->
                <section class="eped-form-detalles-area">
                    <div class="eped-form-detalles-header">
                        <h2>Detalles de la Salida</h2>
                        <a href=""> <!--Hay que cambiar esto a que lleve de esta ventana emergente a OTRA-->
                            <button class="eped-agregar-detalles-btn">Agregar Producto</button>
                        </a>
                    </div>
                    <table class="tabla-eped-detalles">
                        <thead class="header-tabla-eped-detalles">
                            <tr>
                                <td>Producto</td>
                                <td>Cantidad</td>
                                <td>Fecha de Vencimiento</td>
                                <td>Motivo</td>
                                <td>Eliminar</td>
                            </tr>
                        </thead>
                        <tbody class="body-tabla-eped-detalles">
                            <tr>
                                <td>[Producto]</td> 
                                <td>[#]</td> 
                                <td>[mm/dd/aaaa]</td>
                                <td>[Motivo]</td> 
                                <td>
                                    <a href=""> <!--Hay que cambiar esto a que lleve de esta ventana emergente a OTRA-->
                                        <figure class="eliminar-icono"> 
                                            <img class="eliminar-icono-img" src="" alt="">
                                        </figure>
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </section>
            <input class="eped-btn" type="submit" value="Realizar cambios">
        </form>
    </aside>
    <aside class="modal-salida-eliminar">
        <h1 class="modal-epel-titulo">Eliminar Salida Registrada</h1>
        <h3 class="modal-epel-mensaje">¿Desea eliminar la Salida N°<h6 class="subrayar">[id_salida]</h6>?</h3> <!-- [id_salida] es Variable-->
        <section class="modal-buttons">
            <a href=""><button class="eliminar-btn">Eliminar</button></a>
            <a href=""><button class="cancelar-btn">Cancelar</button></a>
        </section>
    </aside>
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
        <form class="edpr-form" action="" method="POST"> <!-- Formulario -->
            <input type="hidden" name="action" value="registrar_producto">
            <section class="edpr-form-inputs-area">
                <label class="edpr-label" for="">Producto que ingresó<h6 class="obligatorio">*</h6></label>
                <select class="edpr-input1" name="edpr-producto">
                    <option value=""> - Seleccionar - </option> <!-- Aquí va el CICLO -->
                    <?php foreach ($productos as $prod): ?>
                        <option value="<?php echo $prod['id_producto']; ?>"><?php echo htmlspecialchars($prod['nombre']); ?></option>
                    <?php endforeach; ?>
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