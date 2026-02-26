<?php
session_start();
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['rc-correo'])) {
    require_once 'conexion.php';

    $email = trim($_POST['rc-correo']);

    if ($email === '') {
        $mailErrors['vacio'] = "El correo es obligatorio.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $mailErrors['formato'] = "Ingrese un correo electrónico válido.";
    } else {
        // Verificar si el correo existe en la base de datos
        $sql_check = "SELECT correo FROM usuarios WHERE correo = ?";
        $stmt_check = mysqli_prepare($conn, $sql_check);
        mysqli_stmt_bind_param($stmt_check, "s", $email);
        mysqli_stmt_execute($stmt_check);
        $result_check = mysqli_stmt_get_result($stmt_check);
        if (mysqli_num_rows($result_check) === 0) {
            $mailErrors['noexiste'] = "No existe una cuenta registrada con ese correo.";
        }
    }

    if (empty($mailErrors ?? [])) {
        require 'lib/vendor/autoload.php';

        $code = bin2hex(random_bytes(4));
        $_SESSION['reset_code'] = $code;
        $_SESSION['reset_email'] = $email;
        $_SESSION['reset_expiration'] = time() + (15 * 60);

        session_regenerate_id(true);

        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'ceibasoftcare@gmail.com';
            $mail->Password   = 'qtfggrwoqwlrefxl';
            $mail->SMTPSecure = 'tls';
            $mail->Port       = 587;

            $mail->setFrom('ceibasoftcare@ceiba.com', 'CEIBA SOFTCARE');
            $mail->addAddress($email);

            $mail->isHTML(true);
            $mail->Subject = 'Recuperación de contraseña';
            ob_start();
            include 'mail-body.php';
            $mail->Body = ob_get_clean();

            $mail->send();
            $mailEnviado = true;
            $_SESSION['paso_recuperar'] = 2;
        } catch (Exception $e) {
            $mailErrors['envio'] = "Error al enviar el correo. Intente nuevamente.";
            $mailEnviado = false;
        }
    }
}

$code_verification = false;
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['rc-codigo'])) {
    $inputCode = trim($_POST['rc-codigo']);

    if ($inputCode === '') {
        $codeErrors['vacio'] = "El código es obligatorio.";
    } elseif (
        isset($_SESSION['reset_code'], $_SESSION['reset_expiration']) &&
        $inputCode === $_SESSION['reset_code'] &&
        time() < $_SESSION['reset_expiration']
    ) {
        $code_verification = true;
        $_SESSION['code_verified'] = true;
        $_SESSION['paso_recuperar'] = 3;
    } else {
        $codeErrors['invalido'] = "Código inválido o expirado.";
    }
}

if (isset($_SESSION['code_verified']) && $_SESSION['code_verified'] === true) {
    $code_verification = true;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['rc-contrasena1'], $_POST['rc-contrasena2'])) {
    require_once 'conexion.php';

    $pass1 = trim($_POST['rc-contrasena1']);
    $pass2 = trim($_POST['rc-contrasena2']);
    $email = $_SESSION['reset_email'] ?? null;

    $passErrors = [];

    if (!$email) {
        $passErrors['usuario'] = "No se puede identificar el usuario. Inicie el proceso de recuperación nuevamente.";
    } else {
        if ($pass1 === '') {
            $passErrors['vacio1'] = "La nueva contraseña es obligatoria.";
        } else {
            if (strlen($pass1) < 8)             $passErrors['length']    = "Debe tener al menos 8 caracteres.";
            if (!preg_match('/[A-Z]/', $pass1)) $passErrors['uppercase'] = "Debe contener al menos una letra mayúscula.";
            if (!preg_match('/[a-z]/', $pass1)) $passErrors['lowercase'] = "Debe contener al menos una letra minúscula.";
            if (!preg_match('/[0-9]/', $pass1)) $passErrors['number']    = "Debe contener al menos un número.";
            if (!preg_match('/[\W_]/', $pass1)) $passErrors['symbol']    = "Debe contener al menos un símbolo especial.";
        }

        if ($pass2 === '') {
            $passErrors['vacio2'] = "Confirme la contraseña.";
        } elseif ($pass1 !== '' && $pass1 !== $pass2) {
            $passErrors['coincidencia'] = "Las contraseñas no coinciden.";
        }

        if (empty($passErrors)) {
            $hashed = password_hash($pass1, PASSWORD_DEFAULT);
            $sql = "UPDATE usuarios SET contrasena = ? WHERE correo = ?";
            if ($stmt = mysqli_prepare($conn, $sql)) {
                mysqli_stmt_bind_param($stmt, "ss", $hashed, $email);
                if (mysqli_stmt_execute($stmt)) {
                    unset(
                        $_SESSION['reset_code'],
                        $_SESSION['reset_expiration'],
                        $_SESSION['reset_email'],
                        $_SESSION['code_verified'],
                        $_SESSION['paso_recuperar']
                    );
                    $passSuccess = "Contraseña actualizada correctamente. <a href='iniciar_sesion.php'>Iniciar sesión</a>";
                } else {
                    $passErrors['db'] = "Error al actualizar la contraseña. Intente nuevamente.";
                }
                mysqli_stmt_close($stmt);
            } else {
                $passErrors['db'] = "Error interno. Contacte al administrador.";
            }
        }
    }
}

$loginErrors = [];
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['correo'], $_POST['contrasena'])) {
    require_once 'conexion.php';

    $correo     = $_POST['correo'];
    $contrasena = $_POST['contrasena'];

    if ($correo === '') {
        $loginErrors['correo'] = "El correo es obligatorio.";
    } elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        $loginErrors['correo'] = "Ingrese un correo electrónico válido.";
    }

    if ($contrasena === '') {
        $loginErrors['contrasena'] = "La contraseña es obligatoria.";
    } else {
        if (!preg_match('/[A-Z]/', $contrasena)) $loginErrors['uppercase'] = "Debe contener al menos una letra mayúscula.";
        if (!preg_match('/[a-z]/', $contrasena)) $loginErrors['lowercase'] = "Debe contener al menos una letra minúscula.";
        if (!preg_match('/[0-9]/', $contrasena)) $loginErrors['number']    = "Debe contener al menos un número.";
        if (!preg_match('/[\W]/', $contrasena))  $loginErrors['symbol']    = "Debe contener al menos un símbolo especial.";
        if (strlen($contrasena) < 8)             $loginErrors['length']    = "Debe tener al menos 8 caracteres.";
    }

    if (empty($loginErrors)) {
        $sql  = "SELECT * FROM usuarios WHERE correo = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $correo);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($row = mysqli_fetch_assoc($result)) {
            if (password_verify($contrasena, $row['contrasena'])) {
                $contrasena_hash = password_hash($contrasena, PASSWORD_DEFAULT);
                $sql_insert  = "INSERT INTO inicio_sesion (correo, contrasena, id_usuario1) VALUES (?, ?, ?)";
                $stmt_insert = mysqli_prepare($conn, $sql_insert);
                mysqli_stmt_bind_param($stmt_insert, "ssi", $correo, $contrasena_hash, $row['id_usuario']);

                if (mysqli_stmt_execute($stmt_insert)) {
                    $_SESSION['usuario_id']     = $row['id_usuario'];
                    $_SESSION['usuario_nombre'] = $row['nombre'];

                    $sql_rol  = "SELECT nombre FROM roles WHERE id_rol = ?";
                    $stmt_rol = mysqli_prepare($conn, $sql_rol);
                    mysqli_stmt_bind_param($stmt_rol, "i", $row['id_rol1']);
                    mysqli_stmt_execute($stmt_rol);
                    $result_rol = mysqli_stmt_get_result($stmt_rol);
                    if ($rol_row = mysqli_fetch_assoc($result_rol)) {
                        $_SESSION['usuario_rol'] = $rol_row['nombre'];
                    }

                    header("Location: inicio.php");
                    exit();
                } else {
                    $loginErrors['session'] = "Error al registrar la sesión. Intente nuevamente.";
                }
            } else {
                $loginErrors['credentials'] = "Correo o contraseña incorrectos.";
            }
        } else {
            $loginErrors['credentials'] = "Correo o contraseña incorrectos.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/modal_recuperar.css">
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
                <figure class="diseño1"><img class="diseño1-img" src="" alt=""></figure>
                <figure class="diseño2"><img class="diseño2-img" src="" alt=""></figure>
                <figure class="diseño3"><img class="diseño3-img" src="" alt=""></figure>
                <figure class="diseño-animales">
                    <img class="diseño-animal1-img" src="" alt="">
                    <img class="diseño-animal2-img" src="" alt="">
                </figure>
            </div>
        </section>

        <aside class="inicio-sesion-vertical-navbar">
            <h1 class="titulo-inicio-sesion">Ingrese los siguientes datos y acceda a la plataforma</h1>
            <form class="iniciar-sesion-form" action="iniciar_sesion.php" method="post">

                <label class="iniciar-sesion-label" for="correo">Correo Electrónico</label>
                <input class="iniciar-sesion-input1 <?= isset($loginErrors['correo']) ? 'input-error' : '' ?>"
                       type="text" placeholder="ejemplo@email.com" name="correo"
                       value="<?= htmlspecialchars($_POST['correo'] ?? '') ?>">
                <?php if (isset($loginErrors['correo'])): ?>
                    <span class="error-msg"><?= $loginErrors['correo'] ?></span>
                <?php endif; ?>

                <label class="iniciar-sesion-label" for="contrasena">Contraseña</label>
                <input class="iniciar-sesion-input2 <?= !empty(array_intersect_key($loginErrors, array_flip(['contrasena','uppercase','lowercase','number','symbol','length']))) ? 'input-error' : '' ?>"
                       type="password" placeholder="Contraseña123" name="contrasena">
                <?php foreach (['contrasena','uppercase','lowercase','number','symbol','length'] as $key): ?>
                    <?php if (isset($loginErrors[$key])): ?>
                        <span class="error-msg"><?= $loginErrors[$key] ?></span>
                    <?php endif; ?>
                <?php endforeach; ?>

                <?php if (isset($loginErrors['credentials'])): ?>
                    <span class="error-msg"><?= $loginErrors['credentials'] ?></span>
                <?php endif; ?>
                <?php if (isset($loginErrors['session'])): ?>
                    <span class="error-msg"><?= $loginErrors['session'] ?></span>
                <?php endif; ?>

                <a class="btnAbrirRecuperar" id="btnAbrirRecuperar" href="#">¿Olvidó su contraseña?</a>
                <input class="iniciar-sesion-btn" type="submit" value="Ingresar">
            </form>
        </aside>
    </main>

    <footer>
        <p>Derechos Reservados(menos a GatitoFeroz).</p>
        <section class="asociaciones">
            <div class="softcare">
                <figure class="softcare-logo"><img class="softcare-logo-img" src="" alt=""></figure>
                <h6 class="softcare-titulo">SoftCare</h6>
            </div>
            <div class="ceiba">
                <figure class="ceiba-logo"><img class="ceiba-logo-img" src="" alt=""></figure>
                <h6 class="ceiba-titulo">Ceiba</h6>
            </div>
        </section>
    </footer>

    <!-- MODAL PASO 1: Ingresar correo -->
    <aside class="modal-recuperar-contrasena1">
        <a href="#" id="btnCerrarRecuperar">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <section class="modal-rc-area">
            <h1 class="modal-rc-titulo">Recuperar contraseña - 1er paso</h1>
            <h3 class="modal-rc-mensaje">Le enviaremos un código al correo electrónico con el que está registrado en el sistema.</h3>

            <?php if (isset($mailEnviado) && $mailEnviado): ?>
                <p class="success-msg">Código enviado a tu correo.</p>
            <?php endif; ?>

            <form class="rc-form" action="iniciar_sesion.php" method="post">
                <label class="rc-label" for="">Correo electrónico</label>
                <input class="rc-input1 <?= !empty($mailErrors ?? []) ? 'input-error' : '' ?>"
                       type="text" placeholder="ejemplo@email.com" name="rc-correo"
                       value="<?= htmlspecialchars($_POST['rc-correo'] ?? '') ?>">
                <?php foreach (['vacio', 'formato', 'noexiste', 'envio'] as $key): ?>
                    <?php if (isset($mailErrors[$key])): ?>
                        <span class="error-msg"><?= $mailErrors[$key] ?></span>
                    <?php endif; ?>
                <?php endforeach; ?>

                <input class="rc-btn" type="submit" value="Enviar Código">
            </form>
        </section>
    </aside>

    <!-- MODAL PASO 2: Ingresar código -->
    <aside class="modal-recuperar-contrasena2">
        <a href="#">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <section class="modal-rc-area">
            <h1 class="modal-rc-titulo">Recuperar contraseña - 2do paso</h1>
            <h3 class="modal-rc-mensaje">Por favor, digite el código que le enviamos a su correo. Si no lo encuentra, revise la carpeta de Spam.</h3>

            <form class="rc-form" action="iniciar_sesion.php" method="post">
                <label class="rc-label" for="">Código</label>
                <input class="rc-input2 <?= !empty($codeErrors ?? []) ? 'input-error' : '' ?>"
                       type="text" name="rc-codigo">
                <?php foreach (['vacio', 'invalido'] as $key): ?>
                    <?php if (isset($codeErrors[$key])): ?>
                        <span class="error-msg"><?= $codeErrors[$key] ?></span>
                    <?php endif; ?>
                <?php endforeach; ?>

                <input class="rc-btn" type="submit" value="Siguiente">
            </form>
        </section>
    </aside>

    <!-- MODAL PASO 3: Nueva contraseña -->
    <aside class="modal-recuperar-contrasena3">
        <a href="#">
            <img class="volver-icono" src="" alt="">
            <h2>Volver</h2>
        </a>
        <section class="modal-rc-area">
            <h1 class="modal-rc-titulo">Recuperar contraseña - 3er paso</h1>
            <h3 class="modal-rc-mensaje">El código es correcto. Digite una nueva contraseña segura y fácil de recordar.</h3>

            <?php if (isset($passSuccess)): ?>
                <p class="success-msg"><?= $passSuccess ?></p>
            <?php else: ?>

                <?php if (isset($passErrors['usuario'])): ?>
                    <span class="error-msg"><?= $passErrors['usuario'] ?></span>
                <?php endif; ?>

                <form class="rc-form" action="iniciar_sesion.php" method="post">
                    <label class="rc-label" for="">Nueva Contraseña</label>
                    <input class="rc-input3 <?= !empty(array_intersect_key($passErrors ?? [], array_flip(['vacio1','length','uppercase','lowercase','number','symbol']))) ? 'input-error' : '' ?>"
                           type="password" name="rc-contrasena1">
                    <?php foreach (['vacio1','length','uppercase','lowercase','number','symbol'] as $key): ?>
                        <?php if (isset($passErrors[$key])): ?>
                            <span class="error-msg"><?= $passErrors[$key] ?></span>
                        <?php endif; ?>
                    <?php endforeach; ?>

                    <label class="rc-label" for="">Confirmar Contraseña</label>
                    <input class="rc-input4 <?= isset($passErrors['vacio2']) || isset($passErrors['coincidencia']) ? 'input-error' : '' ?>"
                           type="password" name="rc-contrasena2">
                    <?php foreach (['vacio2', 'coincidencia'] as $key): ?>
                        <?php if (isset($passErrors[$key])): ?>
                            <span class="error-msg"><?= $passErrors[$key] ?></span>
                        <?php endif; ?>
                    <?php endforeach; ?>

                    <?php if (isset($passErrors['db'])): ?>
                        <span class="error-msg"><?= $passErrors['db'] ?></span>
                    <?php endif; ?>

                    <input class="rc-btn" type="submit" value="Cambiar Contraseña">
                </form>

            <?php endif; ?>
        </section>
    </aside>

    <?php

    $mostrarModal = $_SESSION['paso_recuperar'] ?? 0;
    if (isset($passSuccess))                  $mostrarModal = 0;
    if (!empty($mailErrors ?? []))            $mostrarModal = 1;
    if (!empty($codeErrors ?? []))            $mostrarModal = 2;
    if (!empty($passErrors ?? []))            $mostrarModal = 3;
    ?>
    <script>
        const modalActiva = <?= $mostrarModal ?>;
    </script>
    <script src="../javascripts/modal_recuperar.js"></script>
</body>
</html>
