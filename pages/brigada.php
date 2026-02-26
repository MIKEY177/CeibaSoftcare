<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/main_style.css">
    <title>Brigadas - Softcare</title>
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
            <section class="seccion1-busqueda-agregar">
                <form class="busqueda-form" action="" method=""> <!-- FORMULARIO -->
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
                    <tr><!-- Este tr es el que se repite en Backend -->
                        <td>[Nombre]</td>
                        <td>[dd/mm/aaaa hh:mm:ss]</td>
                        <td>[Lugar]</td>
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
    <aside class="modal-brigada-registrar">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <h1 class="modal-epr-titulo">
            Registre Brigada
        </h1>
        <form class="epr-form" action="" method=""> <!-- Formulario -->
            <section class="epr-form-inputs-area">
                <label class="epr-label" for="">Nombre</label>
                <input class="epr-input" type="text" name="epr-nombre_brigada">
                <label class="epr-label" for="">Fecha y Hora<h6 class="obligatorio">*</h6></label>
                <input class="epr-input1" type="datetime-local" name="epr-fecha_hora_brigada">
                <label class="epr-label" for="">Lugar</label>
                <input class="epr-input" type="text" name="epr-lugar_brigada">
                <!---->
                <label class="epr-label" for="">Descripción</label>
                <textarea class="epr-input2" name="epr-descripcion" id=""></textarea>
                <label class="edpr-label" for="">Salida</label>
                <div class="union-input-icono">
                    <input class="edpr-input5" type="text" name="edpr-salida_brigada" value="Seleccionar salida"> 
                </div>
            </section>
            <input class="epr-btn" type="submit" value="Registrar brigada">
        </form>
    </aside>
    <aside class="modal-brigada-editar">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <h1 class="modal-edped-titulo">
            Editar Brigada
        </h1>
        <form class="edped-form" action="" method=""> <!-- Formulario -->
            <section class="edped-form-inputs-area">
                <label class="edped-label" for="">Nombre<h6 class="obligatorio">*</h6></label>
                <select class="edped-input1" name="edped-producto">
                    <option value="seleccionar" default>[Nombre_ya_registrado]</option>
                </select>
                <label class="edped-label" for="">Fecha y Hora</label>
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
                    <input class="edped-input5" type="text" name="edped-id_salida" value="[id_salida]">
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
        <h3 class="modal-edpel-mensaje">¿Desea eliminar <h6 class="subrayar">[Nombre Bigada]</h6>?</h3> <!-- [Nombre Bigada] es Variable-->
        <section class="modal-buttons">
            <a href=""><button class="eliminar-btn">Eliminar</button></a>
            <a href=""><button class="cancelar-btn">Cancelar</button></a>
        </section>
    </aside>
</body>
</html>