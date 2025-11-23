<?php
// Capturar errores enviados por GET
$nombre_error      = isset($_GET['nombre_error']) ? $_GET['nombre_error'] : "";
$descripcion_error = isset($_GET['descripcion_error']) ? $_GET['descripcion_error'] : "";
$unidad_error      = isset($_GET['unidad_error']) ? $_GET['unidad_error'] : "";
$usuario_error     = isset($_GET['usuario_error']) ? $_GET['usuario_error'] : "";
$error_general     = isset($_GET['error']) ? $_GET['error'] : "";

// Capturar valores previos
$nombre       = isset($_GET['nombre_producto'])        ? $_GET['nombre_producto']        : "";
$descripcion   = isset($_GET['descripcion'])   ? $_GET['descripcion']   : "";
$unidad_medida = isset($_GET['unidad_medida']) ? $_GET['unidad_medida'] : "";
$id_usuario    = isset($_GET['id_usuario'])    ? $_GET['id_usuario']    : "";

require_once "../conexion.php";

$sqlUsuarios = "SELECT id_usuario, nombre FROM usuarios";
$resultusuarios = mysqli_query($conn, $sqlUsuarios);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/main_style.css">
    <title>Inventario - SoftCare</title>
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
                    <input class="busqueda-input1" type="text" name="busqueda" placeholder="Busca un producto">
                    <button class="busqueda-icono" type="submit">
                        <img class="busqueda-icono-img" src="" alt="">
                    </button>
                </form>

                <button id="abrirRegistrar" class="registrar-btn">Registrar Producto</button>

            </section>

            <!-- TABLA INVENTARIO -->
            <table class="tabla-inventario">
                <thead class="header-tabla-inventario">
                    <tr>
                        <td>Producto</td>
                        <td>Descripción</td>
                        <td>Unidad de Medida</td>
                        <td>Nombre Usuario</td>
                        <td>Editar | Eliminar </td>
                    </tr>
                </thead>
                <tbody class="body-tabla-inventario">
                    <?php
                        $sql = "SELECT  p.id_producto, p.nombre AS producto, p.descripcion, p.unidad_medida, p.id_usuario1, u.nombre AS usuario FROM productos AS p INNER JOIN usuarios AS u ON u.id_usuario = p.id_usuario1";
                        $resultado = mysqli_query($conn, $sql);

                        if (mysqli_num_rows($resultado) > 0) {
                            while ($fila = mysqli_fetch_assoc($resultado)) {
                                echo "<tr>";
                                echo "<td>" . htmlspecialchars($fila['producto']) . "</td>";
                                echo "<td>" . htmlspecialchars($fila['descripcion']) . "</td>";
                                echo "<td>" . htmlspecialchars($fila['unidad_medida']) . "</td>";
                                echo "<td>" . htmlspecialchars($fila['usuario']) . "</td>";
                                echo "<td class='acciones'>
                                    <figure class='editar-icono'
                                        onclick=\"abrirModalEditar(
                                        '" . $fila['id_producto'] . "',
                                        '" . htmlspecialchars($fila['producto']) . "',
                                        '" . htmlspecialchars($fila['descripcion']) . "',
                                        '" . htmlspecialchars($fila['unidad_medida']) . "',
                                        '" . htmlspecialchars($fila['usuario']) . "',
                                        '" . $fila['id_usuario1'] . "'
                                        )\">
                                        <img class='editar-icono-img' src='ruta/editar.png' alt='Editar'>
                                    </figure> 

                                    <figure class='eliminar-icono'
                                        onclick=\"abrirModalEliminar(
                                        '" . htmlspecialchars($fila['producto']) . "',
                                        '" . $fila['id_producto'] . "'
                                        )\">
                                        <img class='eliminar-icono-img' src='ruta/eliminar.png' alt='Eliminar'>
                                    </figure>
                                </td>";

                            }
                        } else {
                            echo "<tr><td colspan='5'>No hay productos registrados.</td></tr>";
                        }

                        mysqli_close($conn);
                    ?>
                </tbody>
            </table>

        </section>
    </main>

    <footer>
        <p>Derechos Reservados (menos a GatitoFeroz).</p>

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
        </section>
    </footer>

    <!-- MODAL REGISTRAR -->
    <aside class="modal-registrar"> 
        <div class="modal-content">
            <h2 class="cerrar-modal" id="cerrarRegistrar">Volver</h2>

            <h1>Registrar un nuevo Producto</h1>

            <?php if ($error_general == "faltan_datos"): ?>
            <p style="color:red;">Faltan datos obligatorios.</p>
            <?php endif; ?>

            <form class="ir-form" method="post" action="validar_productos.php">

                <label>Nombre:</label><br>
                <input type="text" name="nombre_producto" value="<?php echo htmlspecialchars($nombre); ?>"><br>
                    <?php if ($nombre_error): ?>
                        <span style="color:red;">El nombre no debe contener números.</span><br>
                    <?php endif; ?>

                <label>Descripción:</label><br>
                <textarea name="descripcion"><?php echo htmlspecialchars($descripcion); ?></textarea><br>
                    <?php if ($descripcion_error): ?>
                        <span style="color:red;">La descripción solo permite letras y espacios.</span><br>
                    <?php endif; ?>

                <label>Unidad de Medida:</label><br>
                <input type="text" name="unidad_medida" value="<?php echo htmlspecialchars($unidad_medida); ?>"><br>
                    <?php if ($unidad_error): ?>
                        <span style="color:red;">La unidad de medida solo permite letras y espacios.</span><br>
                    <?php endif; ?>

                <label>Usuario que registra:</label><br>
                <select name="id_usuario" id="usuario" required>
                    <option value="">Seleccione un usuario</option>

                        <?php while ($usuario = mysqli_fetch_assoc($resultusuarios)): ?>
                            <option value="<?= $usuario['id_usuario'] ?>" 
                                <?php if ($id_usuario == $usuario['id_usuario']) echo "selected"; ?>>
                                <?= htmlspecialchars($usuario['nombre']) ?>
                            </option>
                        <?php endwhile; ?>
                </select>
                <br><br>
                <input type="submit" value="Registrar Producto">
            </form>
        </div>
    </aside>

    
    <!-- MODAL EDITAR -->
    <aside class="modal-editar">
        <div class="modal-content">
            <h2 class="cerrar-modal" id="cerrarEditar">Volver</h2>

            <h1>Editar Producto Registrado</h1>

            <form id="formEditar" class="ied-form" method="post" action="validar_edicion_producto.php">

                <input type="hidden" id="edit-id" name="id_producto">

                <label>Nombre del Producto *</label>
                <input id="edit-nombre" type="text" name="nombre_producto" value="<?= htmlspecialchars($nombre) ?>" required>
                <?php if ($nombre_error): ?>
                        <span style="color:red;">El nombre no debe contener números.</span><br>
                <?php endif; ?>

                <label>Descripción del Producto</label>
                <textarea id="edit-descripcion" name="descripcion"><?= htmlspecialchars($descripcion) ?></textarea>
                <?php if ($descripcion_error): ?>
                    <span style="color:red;">La descripción solo permite letras y espacios.</span><br>
                <?php endif; ?>

                <label>Unidad de Medida</label>
                <input id="edit-unidad" type="text" name="unidad_medida" value="<?= htmlspecialchars($unidad_medida) ?>">
                <?php if ($unidad_error): ?>
                    <span style="color:red;">La unidad de medida solo permite letras y espacios.</span><br>
                <?php endif; ?>

                <label>Usuario que Registra</label>
                <input id="edit-usuario" type="text" name="usuario" readonly>

                <input type="hidden" id="edit-usuario-id" name="id_usuario1">

                <input type="submit" value="Guardar Cambios">
        </form>
    </div>
</aside>
    
    <!-- MODAL ELIMINAR -->
    <aside class="modal-eliminar">
        <div class="modal-content">
            <h2 class="cerrar-modal" id="cerrarEliminar">Cerrar</h2>

            <h1>Eliminar Producto</h1>
            <h3 id="textoEliminar">¿Desea eliminar este producto?</h3>

            <div style="display:flex; gap:20px;">
                <button id="btnConfirmarEliminar">Eliminar</button>
                <button id="btnCancelarEliminar">Cancelar</button>
            </div>
        </div>
    </aside>
        
        <script>
            const datosDesdePHP = {
                modal: "<?= isset($_GET['modal']) ? $_GET['modal'] : '' ?>",
                id: "<?= isset($_GET['id_producto']) ? $_GET['id_producto'] : '' ?>",
                nombre: "<?= isset($_GET['nombre']) ? htmlspecialchars($_GET['nombre']) : '' ?>",
                descripcion: "<?= isset($_GET['descripcion']) ? htmlspecialchars($_GET['descripcion']) : '' ?>",
                unidad: "<?= isset($_GET['unidad_medida']) ? htmlspecialchars($_GET['unidad_medida']) : '' ?>",
                usuario: "<?= isset($_GET['usuario']) ? htmlspecialchars($_GET['usuario']) : '' ?>",
                id_usuario1: "<?= isset($_GET['id_usuario1']) ? $_GET['id_usuario1'] : '' ?>"
            };
        </script>

        <script src="../javascripts/modales_inventario.js"></script>
        <script>
            document.addEventListener("DOMContentLoaded", function () {
                const modalRegistrar = document.querySelector(".modal-registrar");
                const modalEditar = document.querySelector(".modal-editar");

                const urlParams = new URLSearchParams(window.location.search);
                const modal = urlParams.get("modal");

                if (modal === "registrar") {
                    modalRegistrar.classList.add("show-modal");
                }

                if (modal === "editar") {
                    modalEditar.classList.add("show-modal");
            }
            });
</script>

</body>

</html>
