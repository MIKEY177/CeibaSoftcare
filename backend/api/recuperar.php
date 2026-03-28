<?php

require_once("../config/conexion.php");
require_once("../config/cors.php");
session_start();

require __DIR__ . '/vendor/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/vendor/PHPMailer/src/SMTP.php';
require __DIR__ . '/vendor/PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["correoModal"] ?? "");

$errors = [];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors["correoModal"] = "Ingrese un correo válido.";
}

if (empty($errors)) {

    $sql = "SELECT correo FROM usuarios WHERE correo = ?";
    $stmt = mysqli_prepare($conn,$sql);
    mysqli_stmt_bind_param($stmt,"s",$email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if(mysqli_num_rows($result) === 0){
        $errors["correoModal"] = "No existe una cuenta con ese correo.";
    }

}

if(!empty($errors)){
    echo json_encode([
        "success"=>false,
        "errors"=>$errors
    ]);
    exit;
}

$code = bin2hex(random_bytes(4));

$_SESSION["reset_code"] = $code;
$_SESSION["reset_email"] = $email;
$_SESSION["reset_expiration"] = time() + (15 * 60);

$mail = new PHPMailer(true);

try {

    $mail->isSMTP();
    $mail->Host       = "smtp.gmail.com";
    $mail->SMTPAuth   = true;
    $mail->Username   = "ceibasoftcare@gmail.com";
    $mail->Password   = "xvexrcdbwphxrjzt";
    $mail->SMTPSecure = "tls";
    $mail->Port       = 587;

    $mail->setFrom("ceibasoftcare@gmail.com","CEIBA SOFTCARE");
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->Subject = "Recuperación de contraseña";

    $mail->Body = "
        <h2>Recuperación de contraseña</h2>
        <p>Su código de recuperación es:</p>
        <h1>$code</h1>
        <p>Este código expira en 15 minutos.</p>
    ";

    $mail->send();

    echo json_encode([
        "success"=>true,
        "message"=>"Código enviado al correo.",
        "code"=>$code,
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success"=>false,
        "errors"=>[
            "correo"=>"Error al enviar el correo."
        ]
    ]);

}