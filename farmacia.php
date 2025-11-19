<?php
    function VerificarSesion(){
        session_start();
        if(!isset($_SESSION['usuario_id']) || empty($_SESSION['usuario_id'])){
            header("Location:iniciar_sesion.php");
            exit();
        }
    }
    
    VerificarSesion();

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/main_style.css">
    <title>Farmacia - Softcare</title>
</head>
<body>
    <main>
        <aside class="vertical-navbar">
            <div class="perfil">
                <figure class="avatar">
                    <img class="avatar-img" src="" alt=""> <!-- Variable -->
                </figure>
                <h1 class="perfil-nombre"><?php echo $_SESSION['usuario_nombre']; ?></h1> <!-- Variable -->
                <figure class="perfil-rol">
                    <img class="perfil-rol-img" src="" alt="">
                    <h1 class="perfil-rol-texto"><?php echo $_SESSION['usuario_rol']; ?></h1> <!-- Variable -->
                </figure>
            </div>
            <div class="contenedor-nav">
              <?php if($_SESSION['usuario_rol'] == 'administrador' || $_SESSION['usuario_rol'] == 'farmacéutico'): ?>
                <a href=""><h2 class="opcion-nav">Inventario</h2></a>
                <a href=""><h2 class="opcion-nav">Salidas Productos</h2></a>
                <a href=""><h2 class="opcion-nav">Entradas Productos</h2></a>
              <?php endif; ?>
                <a href=""><h2 class="opcion-nav">Brigadas</h2></a>
            </div>
            <a href=""><button class="cerrar-sesion-btn">Cerrar Sesión</button></a>
        </aside>
        <section class="secciones-area-gestion">
            <h2 class="titulo-dashboard">Módulo Farmacia</h2>
            <section class="seccion1-actividad-reciente">
                <h3 class="titulo-area-gestion">Actividad Reciente</h3>
                <table class="tabla-actividad-reciente">
                    <thead class="header-tabla-actividad-reciente">
                        <tr>
                            <td>Producto</td>
                            <td>Fecha</td>
                            <td>Cantidad</td>
                            <td>Actividad</td>
                            <td><!-- acción --></td>
                        </tr>
                    </thead>
                    <tbody class="body-tabla-actividad-reciente">
                        <tr> <!-- Este tr es el que se repite en Backend -->
                            <td>[Producto]</td> <!-- Variable -->
                            <td>[dd/mm/aaaa]</td> <!-- Variable -->
                            <td>[#]</td> <!-- Variable -->
                            <td>[Actividad]</td> <!-- Variable -->
                            <td><a href=""><button class="tabla-actividad-reciente-btn">Ver</button></a></td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <section class="seccion2-modulos">
                <h3 class="titulo-area-gestion">Sub-Módulos de Gestión</h3>
                <section class="area-modulos">
                    <?php if($_SESSION['usuario_rol'] == 'administrador' || $_SESSION['usuario_rol'] == 'farmacéutico'): ?>
                    <a href="">
                        <div class="modulo-inventario">
                            <h4 class="titulo-modulo-inventario">Inventario</h4>
                            <figure class="modulo-inventario-icono">
                                <img class="modulo-inventario-img" src="" alt="">
                            </figure>
                        </div>
                    </a>
                    <a href="">
                        <div class="modulo-salidas-productos">
                            <h4 class="titulo-modulo-salidas-productos">Salidas Productos</h4>
                            <figure class="modulo-salidas-productos-icono">
                                <img class="modulo-salidas-productos-img" src="" alt="">
                            </figure>
                        </div>
                    </a>
                    <a href="">
                        <div class="modulo-entradas-productos">
                            <h4 class="titulo-modulo-entradas-productos">Entradas Productos</h4>
                            <figure class="modulo-entradas-productos-icono">
                                <img class="modulo-entradas-productos-img" src="" alt="">
                            </figure>
                        </div>
                    </a>
                    <?php endif; ?>
                    <a href="">
                        <div class="modulo-brigadas">
                            <h4 class="titulo-modulo-brigadas">Brigadas</h4>
                            <figure class="modulo-brigadas-icono">
                                <img class="modulo-brigadas-img" src="" alt="">
                            </figure>
                        </div>
                    </a>    
                </section>
            </section>
        </section>
    </main>
    <footer>
        <p>Derechos Reservados(menos a GatitoFeroz).</p> <!-- No sé que va acá exactamente -->
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
            <!-- <div class="sena">
                <figure class="sena-logo">
                    <img class="sena-logo-img" src="" alt="">
                </figure>
                <h6 class="sena-titulo">Sena</h6>
            </div> -->
        </section>
    </footer>
</body>
</html>