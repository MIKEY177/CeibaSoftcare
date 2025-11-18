<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/main_style.css">
    <title>Iniciar Sesión - Softcare</title>
</head>
<body>
    <main>
        <section class="area-grafica">
            <div class="area-grafica-softcare">
                <figure class="logo-softcare">
                    <img class="logo-softcare-img" src="" alt="">
                </figure>
                <h1 class="titulo-area-grafica-softcare"></h1>
            </div>
            <div class="area-grafica-animales">
                <figure class="diseño1">
                    <img class="diseño1-img" src="" alt="">
                </figure>
                <figure class="diseño2">
                    <img class="diseño2-img" src="" alt="">
                </figure>
                <figure class="diseño3">
                    <img class="diseño3-img" src="" alt="">
                </figure>
                <figure class="diseño-animales">
                    <img class="diseño-animal1-img" src="" alt="">
                    <img class="diseño-animal2-img" src="" alt="">
                </figure>
            </div>
        </section>
        <?php
        require_once 'conexion.php';
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $correo = $_POST['correo'];
            $contrasena = $_POST['contrasena'];

            if (empty($correo) || empty($contrasena)) {
                //Si los campos están vacíos
                //$error['empty'] = "<script>alert('Por favor, complete todos los campos');</script>";
                //exit();
            }

            if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
                // Si el correo no es válido
                //$error['invalid_email'] = "<script>alert('Por favor, ingrese un correo electrónico válido');</script>";
                //exit();
            }

            if (!preg_match('/[A-Za-z]/', $contrasena) || !preg_match('/[0-9]/', $contrasena) || !preg_match('/[\W]/', $contrasena) || strlen($contrasena) < 8) {
                // Si la contraseña no contiene letras, números y simbolos
                if (!preg_match('/[A-Z]/', $contrasena)) {
                    //Si no tiene mayúsculas
                    //$error["uppercase"] = "<script>alert('La contraseña debe contener al menos una letra mayúscula');</script>";
                }
                if (!preg_match('/[a-z]/', $contrasena)) {
                    //Si no tiene minúsculas
                    //$error["lowercase"] = "<script>alert('La contraseña debe contener al menos una letra minúscula');</script>";
                }
                if (!preg_match('/[0-9]/', $contrasena)) {
                    //Si no tiene números
                    //$error["number"] = "<script>alert('La contraseña debe contener al menos un número');</script>";
                }
                if (!preg_match('/[\W]/', $contrasena)) {
                    //Si no tiene símbolos
                    //$error["symbol"] = "<script>alert('La contraseña debe contener al menos un símbolo especial');</script>";
                }
                if (strlen($contrasena) < 8) {
                    //Si es menor a 8 caracteres
                    //$error["length"] = "<script>alert('La contraseña debe tener al menos 8 caracteres');</script>";
                }
            }

            // Consulta para verificar las credenciales del usuario
            $sql = "SELECT * FROM usuarios WHERE correo = ?";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "s", $correo);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            if ($row = mysqli_fetch_assoc($result)) {
                // Verificar la contraseña
                if (password_verify($contrasena, $row['contrasena'])) {
                    // Inicio de sesión exitoso
                    session_start();
                    
                } else {
                    // Contraseña incorrecta
                    //$error['invalid_credentials'] = "<script>alert('Correo o contraseña incorrectos');</script>";
                }
            } else {
                // Usuario no encontrado
                //$error['invalid_credentials'] = "<script>alert('Correo o contraseña incorrectos');</script>";
            }
            if (empty($error)){
                $contrasena = password_hash($contrasena, PASSWORD_DEFAULT);
                $sql_insert = "INSERT INTO inicio_sesion (correo, contrasena, id_usuario1) VALUES (?, ?, ?)";
                $stmt_insert = mysqli_prepare($conn, $sql_insert);
                mysqli_stmt_bind_param($stmt_insert, "ssi", $correo, $contrasena, $row['id_usuario']);
                if (mysqli_stmt_execute($stmt_insert)) {
                    // Registro de sesión exitoso
                    $_SESSION['usuario_id'] = $row['id_usuario'];
                    $_SESSION['usuario_nombre'] = $row['nombre'];
                    $sql_rol = "SELECT nombre FROM roles WHERE id_rol = ?";
                    $stmt_rol = mysqli_prepare($conn, $sql_rol);
                    mysqli_stmt_bind_param($stmt_rol, "i", $row['id_rol1']);
                    mysqli_stmt_execute($stmt_rol);
                    $result_rol = mysqli_stmt_get_result($stmt_rol);
                    if (($rol_row = mysqli_fetch_assoc($result_rol))> 0) {
                        // Obtener el nombre del rol
                        $_SESSION['usuario_rol'] = $rol_row['nombre'];
                    }   
                    header("Location: inicio.php"); // Redirigir al usuario al dashboard u otra página
                    exit();
                } else {
                    // Error al registrar la sesión
                    //$error['session_error'] = "<script>alert('Error al registrar la sesión. Por favor, intente nuevamente.');</script>";
                }

            }
        }
        ?>
        <aside class="inicio-sesion-vertical-navbar">
            <h1 class="titulo-inicio-sesion">Ingrese los siguientes datos y acceda a la plataforma</h1>
            <form class="iniciar-sesion-form" action="iniciar_sesion.php" method="post"> <!-- Formulario -->
                <label class="iniciar-sesion-label" for="">Correo Electrónico</label>
                <input class="iniciar-sesion-input1" type="text" placeholder="ejemplo@email.com" name="correo">
                <!---->
                <label class="iniciar-sesion-label" for="">Contraseña</label>
                <input class="iniciar-sesion-input2" type="text" placeholder="Contraseña123" name="contrasena">
                <a class="" href="">¿Olvidó su contraseña?</a>
                <!---->
                <input class="iniciar-sesion-btn" type="submit" value="Ingresar">
            </form> 
        </aside>
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
    <aside class="modal-recuperar-contrasena">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <section class="modal-rc-area">
            <h1 class="modal-rc-titulo">Recuperar contraseña - 1er paso</h1>
            <h3 class="modal-rc-mensaje">Le enviaremos un código al correo electrónico con el que está registrado en el sistema.</h3>
            <form class="rc-form" action="" method=""> <!-- Formulario -->
                <label class="rc-label" for="">Correo electrónico</label>
                <input class="rc-input1" type="text" placeholder="ejemplo@email.com" name="rc-correo">
                <input class="rc-btn" type="submit" value="Enviar Código">
            </form> 
        </section>
    </aside>
    <aside class="modal-recuperar-contrasena">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <section class="modal-rc-area">
            <h1 class="modal-rc-titulo">Recuperar contraseña - 2do paso</h1>
            <h3 class="modal-rc-mensaje">Por favor, digite a continuación el código que le enviamos a su correo, si no lo encuentra, revise la carpeta de Spam.</h3>
            <form class="rc-form" action="" method=""> <!-- Formulario -->
                <label class="rc-label" for="">Código</label>
                <input class="rc-input2" type="text" name="rc-codigo">
                <input class="rc-btn" type="submit" value="Siguiente">
            </form> 
        </section>
    </aside>
    <aside class="modal-recuperar-contrasena">
        <a href="">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <section class="modal-rc-area">
            <h1 class="modal-rc-titulo">Recuperar contraseña - 3er paso</h1>
            <h3 class="modal-rc-mensaje">El código digitado es correcto. Digite una nueva contraseña segura y fácil de recordar.</h3>
            <form class="rc-form" action="" method=""> <!-- Formulario -->
                <label class="rc-label" for="">Nueva Contraseña</label>
                <input class="rc-input3" type="text" name="rc-contrasena1">
                <!---->
                <label class="rc-label" for="">Confirmar Contraseña</label>
                <input class="rc-input4" type="text" name="rc-contrasena2">
                <input class="rc-btn" type="submit" value="Cambiar Contraseña">
            </form> 
        </section>
    </aside>
</body>
</html>