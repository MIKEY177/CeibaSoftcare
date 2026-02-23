<?php
// Verificar si el usuario ha iniciado sesión
session_start();
function VerificarInicioSesion($usuario_id){
    if(empty($usuario_id)){
        // Redirigir al usuario a la página de inicio de sesión si no ha iniciado sesión
        header("Location: iniciar_sesion.php");
        exit();
    }
}
VerificarInicioSesion($_SESSION['usuario_id']);
$id = $_SESSION['usuario_id'];
$nombre = $_SESSION['usuario_nombre'];
$rol = $_SESSION['usuario_rol'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/main_style.css">
    <title>Inicio - Softcare</title>
</head>
<body>
    <main>
        <aside class="vertical-navbar">
            <div class="perfil">
                <figure class="avatar">
                    <img class="avatar-img" src="" alt=""> <!-- Variable -->
                </figure>
                <h1 class="perfil-nombre"><?php echo $nombre; ?></h1> <!-- Variable -->
                <figure class="perfil-rol">
                    <img class="perfil-rol-img" src="" alt="">
                    <h1 class="perfil-rol-texto"><?php echo $rol; ?></h1> <!-- Variable -->
                </figure>
            </div>
            <div class="contenedor-nav">
                <a href=""><h2 class="opcion-nav">Inicio</h2></a>
                <a href=""><h2 class="opcion-nav">Farmacia</h2></a>
                <?php if($rol == 'administrador' || $rol == 'Veterinario'): ?>
                <a href=""><h2 class="opcion-nav">Refugio</h2></a>
                <?php endif; ?>
            </div>
            <a href="cerrar_sesion.php"><button class="cerrar-sesion-btn">Cerrar Sesión</button></a>
        </aside>
        <section class="secciones-dashboard">
            <h2 class="titulo-dashboard">¡Bienvenido al Dashboard!</h2>
            <section class="seccion1-proximas-brigadas">
                <h3 class="subtitulo-dashboard">Próximas Brigadas</h3>
                <section class="area-brigadas">
                    <div class="subarea-brigada"> <!-- Este div es el que se repite en Backend -->
                        <h4 class="fecha">08 de Abril del 2025</h4> <!-- Variable -->
                        <article class="articulo-brigada">
                            <h5 class="detalles-brigada">[Nombre brigada]</h5> <!-- Variable -->
                            <h6 class="detalles-brigada">Lugar:</h6>
                            <p class="detalles-brigada">[contenido]</p> <!-- Variable -->
                            <h6 class="detalles-brigada">Descrpción:</h6>
                            <p class="detalles-brigada">[contenido]</p> <!-- Variable -->
                        </article>
                    </div>
                    <div class="separador-vertical"></div> <!-- Este div también se repite -->
                </section>
            </section>
            <section class="seccion2-modulos">
                <h3 class="subtitulo-dashboard">Módulos de Gestión</h3>
                <section class="area-modulos">
                    <a href="">
                        <div class="modulo-farmacia">
                            <h4 class="titulo-modulo-farmacia">Farmacia</h4>
                            <figure class="modulo-farmacia-icono">
                                <img class="modulo-farmacia-img" src="" alt="">
                            </figure>
                        </div>
                    </a>
                    <?php if($rol == 'administrador' || $rol == 'Veterinario'): ?>
                    <a href="">
                        <div class="modulo-refugio">
                            <h4 class="titulo-modulo-refugio">Refugio</h4>
                            <figure class="modulo-refugio-icono">
                                <img class="modulo-refugio-img" src="" alt="">
                            </figure>
                        </div>
                    </a>
                    <?php endif; ?>
                    <?php if($rol  == 'administrador'): ?>
                    <a href="">
                        <div class="modulo-usuarios">
                            <h4 class="titulo-modulo-usuarios">Usuarios</h4>
                            <figure class="modulo-usuarios-icono">
                                <img class="modulo-usuarios-img" src="" alt="">
                            </figure>
                        </div>
                    </a>
                    <?php endif; ?>
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