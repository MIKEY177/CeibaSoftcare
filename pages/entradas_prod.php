<?php
session_start();
function VerificarSesion(){
    if(empty($_SESSION['usuario_id'])){
        // Redirigir al usuario a la página de inicio de sesión si no ha iniciado sesión
        header("Location: iniciar_sesion.php");
        exit();
    }elseif(($_SESSION['usuario_rol'] != 'administrador') && ($_SESSION['usuario_rol'] != 'farmacéutico')){
        // Redirigir al usuario a la página de inicio si no tiene el rol adecuado
        header("Location: inicio.php");
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
    <title>Entradas - SoftCare</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
<body>
    <main>
        <aside class="vertical-navbar">
            <div class="perfil">
                <figure class="avatar">
                    <img class="avatar-img" src="" alt="">
                </figure>
                <h1 class="perfil-nombre"><?php echo $_SESSION['usuario_nombre']; ?></h1>
                <figure class="perfil-rol">
                    <img class="perfil-rol-img" src="" alt="">
                    <h1 class="perfil-rol-texto"><?php echo $_SESSION['usuario_rol']; ?></h1>
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
                    <input class="busqueda-input1" type="text" name="busqueda" placeholder="Busca un producto" id="">
                    <button class="busqueda-icono" type="submit">
                        <img class="busqueda-icono-img" src="" alt="">
                    </button>
                </form>
                <a href="">
                    <button class="registrar-btn">Registrar Entrada del Producto</button>
                </a>
            </section>
            <table class="tabla-entradas">
                <thead class="header-tabla-entradas">
                    <tr>
                        <td>Fecha y Hora</td>
                        <td>Observaciones</td>
                        <td>Detalles del Registro</td>
                        <td>Editar | Eliminar</td>
                    </tr>
                </thead>
                <tbody class="body-tabla-entradas">
                    <tr><!-- Este tr es el que se repite en Backend -->
                        <td>[dd/mm/aaaa hh:mm:ss]</td>
                        <td>[Observaciones]</td>
                        <td>
                            <a href="">
                                <button class="ver-detalles-btn">Ver Detalles<!-- <span class="material-icons">arrow_forward</span> --></button>
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
    <aside class="modal-entrada-registrar">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <h1 class="modal-epr-titulo">
            Registre una nueva Entrada de Productos
        </h1>
        <form class="epr-form" action="" method=""> <!-- Formulario -->
            <section class="epr-form-inputs-area">
                <label class="epr-label" for="">Fecha y Hora de Entrada<h6 class="obligatorio">*</h6></label>
                <input class="epr-input1" type="datetime-local" name="epr-fecha_hora_entrada">
                <!---->
                <label class="epr-label" for="">Observaciones de la Entrada</label>
                <textarea class="epr-input2" name="epr-observaciones" id=""></textarea>
                <!---->
                <section class="epr-form-detalles-area">
                    <div class="epr-form-detalles-header">
                        <h2>Detalles de la Entrada</h2>
                        <a href=""> <!--Hay que cambiar esto a que lleve de esta ventana emergente a OTRA-->
                            <button class="epr-agregar-detalles-btn">Agregar Producto</button>
                        </a>
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
            <input class="epr-btn" type="submit" value="Registrar Entrada">
        </form>
    </aside>
    <aside class="modal-entrada-editar">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <h1 class="modal-eped-titulo">
            Registre una nueva Entrada de Productos
        </h1>
        <form class="eped-form" action="" method=""> <!-- Formulario -->
            <section class="eped-form-inputs-area">
                <label class="eped-label" for="">Fecha y Hora de Entrada<h6 class="obligatorio">*</h6></label>
                <input class="eped-input1" type="datetime-local" name="eped-fecha_hora_entrada" value="[Fecha_ya_registrada]">
                <!---->
                <label class="eped-label" for="">Observaciones de la Entrada</label>
                <textarea class="eped-input2" name="eped-observaciones" id="">[Observación_ya_registrada]</textarea>
                <!---->
                <section class="eped-form-detalles-area">
                    <div class="eped-form-detalles-header">
                        <h2>Detalles de la Entrada</h2>
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
    <aside class="modal-entrada-eliminar">
        <h1 class="modal-epel-titulo">Eliminar Entrada Registrada</h1>
        <h3 class="modal-epel-mensaje">¿Desea eliminar la Entrada N°<h6 class="subrayar">[id_entrada]</h6>?</h3> <!-- [id_entrada] es Variable-->
        <section class="modal-buttons">
            <a href=""><button class="eliminar-btn">Eliminar</button></a>
            <a href=""><button class="cancelar-btn">Cancelar</button></a>
        </section>
    </aside>
    <aside class="modal-entrada-detalle-registrar">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <h1 class="modal-edpr-titulo">
            Registre un Producto en la Entrada N°[Id_entrada] <!-- Variable-->
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
                <label class="edpr-label" for="">Motivo de Entrada</label>
                <textarea class="edpr-input2" name="edpr-motivo" id=""></textarea>
                <!---->
                <label class="edpr-label" for="">Cantidad<h6 class="obligatorio">*</h6></label>
                <input class="edpr-input3" type="text" name="edpr-cantidad">
                <!---->
                <label class="edpr-label" for="">Fecha de Vencimiento</label>
                <input class="edpr-input4" type="date" name="edpr-fecha_vencimiento">
                <!---->
                <label class="edpr-label" for="">N° de Entrada</label>
                <div class="union-input-icono">
                    <input class="edpr-input5" type="text" name="edpr-id_entrada" value="[id_entrada]"> <!--En el value="" va el id de la entrada registrado-->
                    <figure class="candado-icono">
                        <img class="candado-icono-img" src="" alt="">
                    </figure>
                </div>
                <!---->
            </section>
            <input class="edpr-btn" type="submit" value="Registrar Producto en la Entrada">
        </form>
    </aside>
    <aside class="modal-entrada-detalle-eliminar">
        <h1 class="modal-edpel-titulo">Eliminar Producto de la Entrada</h1>
        <h3 class="modal-edpel-mensaje">¿Desea eliminar <h6 class="subrayar">[Nombre Producto]</h6> de la Entrada?</h3> <!-- [Nombre Producto] es Variable-->
        <section class="modal-buttons">
            <a href=""><button class="eliminar-btn">Eliminar</button></a>
            <a href=""><button class="cancelar-btn">Cancelar</button></a>
        </section>
    </aside>
</body>
</html>