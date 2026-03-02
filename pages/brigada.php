<?php
session_start();
include 'conexion.php';

// Procesar registrar brigada
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'registrar') {
    $nombre = isset($_POST['nombre']) ? $_POST['nombre'] : '';
    $fecha_hora = isset($_POST['fecha_hora']) ? $_POST['fecha_hora'] : '';
    $lugar = isset($_POST['lugar']) ? $_POST['lugar'] : '';
    $descripcion = isset($_POST['descripcion']) ? $_POST['descripcion'] : '';
    $id_salida = isset($_POST['id_salida']) ? (int)$_POST['id_salida'] : 0;

    if ($nombre && $fecha_hora && $lugar && $id_salida) {
        $sql = "INSERT INTO brigadas (nombre, fecha_hora, lugar, descripcion, id_salida1) VALUES (?, ?, ?, ?, ?)";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ssssi", $nombre, $fecha_hora, $lugar, $descripcion, $id_salida);
        if (mysqli_stmt_execute($stmt)) {
            $msg = "Brigada registrada exitosamente";
            $msg_type = "success";
        } else {
            $msg = "Error al registrar: " . mysqli_error($conn);
            $msg_type = "error";
        }
        mysqli_stmt_close($stmt);
    }
}

// Procesar editar brigada
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'editar') {
    $id_brigada = isset($_POST['id_brigada']) ? (int)$_POST['id_brigada'] : 0;
    $nombre = isset($_POST['nombre']) ? $_POST['nombre'] : '';
    $fecha_hora = isset($_POST['fecha_hora']) ? $_POST['fecha_hora'] : '';
    $lugar = isset($_POST['lugar']) ? $_POST['lugar'] : '';
    $descripcion = isset($_POST['descripcion']) ? $_POST['descripcion'] : '';
    $id_salida = isset($_POST['id_salida']) ? (int)$_POST['id_salida'] : 0;

    if ($id_brigada && $nombre && $fecha_hora && $lugar) {
        $sql = "UPDATE brigadas SET nombre = ?, fecha_hora = ?, lugar = ?, descripcion = ?, id_salida1 = ? WHERE id_brigada = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ssssii", $nombre, $fecha_hora, $lugar, $descripcion, $id_salida, $id_brigada);
        if (mysqli_stmt_execute($stmt)) {
            $msg = "Brigada actualizada exitosamente";
            $msg_type = "success";
        } else {
            $msg = "Error al actualizar: " . mysqli_error($conn);
            $msg_type = "error";
        }
        mysqli_stmt_close($stmt);
    }
}

// Obtener brigadas
$brigadas = array();
$sql_brigadas = "SELECT * FROM brigadas ORDER BY fecha_hora DESC";
$result = mysqli_query($conn, $sql_brigadas);
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $brigadas[] = $row;
    }
}

// Obtener salidas para el modal
$salidas = array();
$sql_salidas = "SELECT id_salida, fecha_hora, observaciones FROM salidas_productos ORDER BY fecha_hora DESC";
$result_salidas = mysqli_query($conn, $sql_salidas);
if ($result_salidas) {
    while ($row = mysqli_fetch_assoc($result_salidas)) {
        $salidas[] = $row;
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
    <title>Brigadas - Softcare</title>
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
                <form class="busqueda-form" action="" method="">
                    <input class="busqueda-input1" type="text" name="busqueda" placeholder="Busca una brigada" id="">
                    <button class="busqueda-icono" type="submit">
                        <img class="busqueda-icono-img" src="" alt="">
                    </button>
                </form>
                <a href="">
                    <button class="registrar-btn">Registrar Brigada</button>
                </a>
            </section>
            <table class="tabla-brigadas">
                <thead class="header-tabla-brigadas">
                    <tr>
                        <td>Nombre</td>
                        <td>Fecha y Hora</td>
                        <td>Lugar</td>
                        <td>Editar | Eliminar</td>
                    </tr>
                </thead>
                <tbody class="body-tabla-brigadas">
                    <?php foreach ($brigadas as $brigada): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($brigada['nombre']); ?></td>
                        <td><?php echo date('d/m/Y H:i:s', strtotime($brigada['fecha_hora'])); ?></td>
                        <td><?php echo htmlspecialchars($brigada['lugar']); ?></td>
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

    <!-- Modal Registrar Brigada -->
    <aside class="modal-brigada-registrar">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <h1 class="modal-epr-titulo">
            Registre Brigada
        </h1>
        <form class="epr-form" action="" method="POST">
            <input type="hidden" name="action" value="registrar">
            <section class="epr-form-inputs-area">
                <label class="epr-label" for="">Nombre</label>
                <input class="epr-input" type="text" name="nombre">
                <label class="epr-label" for="">Fecha y Hora<h6 class="obligatorio">*</h6></label>
                <input class="epr-input1" type="datetime-local" name="fecha_hora">
                <label class="epr-label" for="">Lugar</label>
                <input class="epr-input" type="text" name="lugar">
                <label class="epr-label" for="">Descripción</label>
                <textarea class="epr-input2" name="descripcion" id=""></textarea>
                <label class="edpr-label" for="">Salida</label>
                <div class="union-input-icono">
                    <select class="edpr-input5" name="id_salida">
                        <option value="">Seleccionar salida</option>
                        <?php foreach ($salidas as $salida): ?>
                            <option value="<?php echo $salida['id_salida']; ?>">
                                (ID: <?php echo $salida['id_salida']; ?>) - <?php echo date('d/m/Y H:i', strtotime($salida['fecha_hora'])); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </section>
            <input class="epr-btn" type="submit" value="Registrar brigada">
        </form>
    </aside>

    <!-- Modal Editar Brigada -->
    <aside class="modal-brigada-editar">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <h1 class="modal-edped-titulo">
            Editar Brigada
        </h1>
        <form class="edped-form" action="" method="POST">
            <input type="hidden" name="action" value="editar">
            <input type="hidden" name="id_brigada" id="edit-id">
            <section class="edped-form-inputs-area">
                <label class="edped-label" for="">Nombre<h6 class="obligatorio">*</h6></label>
                <input class="edped-input1" type="text" name="nombre" id="edit-nombre">
                <label class="edped-label" for="">Fecha y Hora</label>
                <input class="edped-input1" type="datetime-local" name="fecha_hora" id="edit-fecha_hora">
                <label class="edped-label" for="">Lugar</label>
                <input class="edped-input1" type="text" name="lugar" id="edit-lugar">
                <label class="edped-label" for="">Descripción</label>
                <textarea class="edped-input2" name="descripcion" id="edit-descripcion"></textarea>
                <label class="edped-label" for="">Salida</label>
                <div class="union-input-icono">
                    <select class="edped-input5" name="id_salida" id="edit-salida">
                        <option value="">Seleccionar salida</option>
                        <?php foreach ($salidas as $salida): ?>
                            <option value="<?php echo $salida['id_salida']; ?>">
                                (ID: <?php echo $salida['id_salida']; ?>) - <?php echo date('d/m/Y H:i', strtotime($salida['fecha_hora'])); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </section>
            <input class="edpr-btn" type="submit" value="Realizar cambios">
        </form>
    </aside>

    <!-- Modal Eliminar Brigada -->
    <aside class="modal-salida-detalle-eliminar">
        <h1 class="modal-edpel-titulo">Eliminar Brigada</h1>
        <h3 class="modal-edpel-mensaje">¿Desea eliminar <h6 class="subrayar" id="delete-nombre"></h6>?</h3>
        <section class="modal-buttons">
            <form method="POST" action="" style="display: inline;">
                <input type="hidden" name="action" value="eliminar">
                <input type="hidden" name="id_brigada" id="delete-id">
                <button type="submit" class="eliminar-btn">Eliminar</button>
            </form>
            <a href=""><button class="cancelar-btn">Cancelar</button></a>
        </section>
    </aside>
</body>
</html>
