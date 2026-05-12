<?php

require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . '/config/session_config.php';
require_once dirname(__DIR__) . '/config/env.php';
loadEnv(__DIR__ . '/../../.env.development');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT u.id_usuario, u.nombre, u.correo, u.contrasena, u.foto_perfil, r.nombre as rol FROM usuarios u JOIN roles r ON u.id_rol1 = r.id_rol WHERE u.id_usuario = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $_SESSION['user_id']);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if (mysqli_stmt_affected_rows($stmt) > 0) {
        $user = mysqli_fetch_assoc($result);
        echo json_encode([
            "status" => "ok",
            "usuario" => $user['nombre'],
            "foto_perfil" => $user['foto_perfil'],
            "correo" => $user['correo'],
            "rol" => $user['rol']
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
    }    
} 

//  cargar perfil de usuario
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'])) {

    if (!isset($_FILES['file'])) {
        echo json_encode(["status" => "error", "message" => "No hay archivo"]);
        exit;
    }

    $file = $_FILES['file']['tmp_name'];
    $cloud_name = env('CLOUDINARY_CLOUD_NAME');
    $upload_preset = env('CLOUDINARY_UPLOAD_PRESET'); // sin firma (unsigned)

    $url = "https://api.cloudinary.com/v1_1/$cloud_name/image/upload";

    $postFields = [
        'file' => new CURLFile($file),
        'upload_preset' => $upload_preset
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);



    $response = curl_exec($ch);
    
        if (curl_errno($ch)) {
            echo json_encode(["status" => "error", "message" => curl_error($ch)]);
            exit;
        }
    
    $data = json_decode($response, true);
    $sql = "UPDATE usuarios SET foto_perfil = ? WHERE nombre = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "ss", $data['secure_url'], $_SESSION['user_name']);
    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    if (isset($data['secure_url'])) {
        $_SESSION['foto_perfil'] = $data['secure_url'];
        echo json_encode([
            "status" => "ok",
            "url" => $data['secure_url']
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => $data
        ]);
    }
}

//PUT/nombre
$body = json_decode(file_get_contents("php://input"), true);
if ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($body['campo']) && $body['campo'] === 'nombre') {
    $errores = [];
    if (empty($body['valor'])) {
        $errores['nombre'] = "El nombre no puede estar vacío";
    } 
    if (strlen($body['valor']) < 3) {
        $errores['nombre'] = "El nombre debe tener al menos 3 caracteres";
    }
    
    if(empty($errores)) {
        $sql = "UPDATE usuarios SET nombre = ? WHERE id_usuario = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $body['valor'], $_SESSION['user_id']);
        if (mysqli_stmt_execute($stmt)) {
            $_SESSION['user_name'] = $body['valor'];
            echo json_encode(["status" => "ok", "message" => "Nombre actualizado con éxito"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al actualizar el nombre"]);
        }
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "errores" => $errores]);
    }
}

if($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($body['campo']) && $body['campo'] === 'correo') {
    $errores = [];
    if (empty($body['valor'])) {
        $errores['correo'] = "El correo no puede estar vacío";
    } 
    if (!filter_var($body['valor'], FILTER_VALIDATE_EMAIL)) {
        $errores['correo'] = "El correo no es válido";
    }
    if ($body['valor'] === $body['valor_2']) {
        $errores['newcorreo'] = "El nuevo correo no puede ser igual al actual";
    }
    if (empty($body['valor_2'])) {
        $errores['newcorreo'] = "El nuevo correo no puede estar vacío";
    }
    // Verificar si el nuevo correo ya existe en la base de datos
    $sql = "SELECT id_usuario FROM usuarios WHERE correo = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $body['valor_2']);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if (mysqli_stmt_affected_rows($stmt) > 0) {
        $errores['newcorreo'] = "El nuevo correo ya está registrado";
    }else{
        // Verificar que el correo actual coincida con el registrado en la base de datos
        $sql = "SELECT id_usuario FROM usuarios WHERE correo = ? AND id_usuario = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $body['valor'], $_SESSION['user_id']);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        if ($result->num_rows === 0) {
            $errores['correo'] = "Correo incorrecto, no coincide con el registrado";
        }
    }
    mysqli_stmt_close($stmt);
    
    if(empty($errores)) {
        $sql = "UPDATE usuarios SET correo = ? WHERE id_usuario = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $body['valor_2'], $_SESSION['user_id']);
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "ok", "message" => "Correo actualizado con éxito"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al actualizar el correo"]);
        }
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "errores" => $errores]);
    }
}

if($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($body['campo']) && $body['campo'] === 'contraseña') {
    $errores = [];
    if (empty($body['valor'])) {
        $errores['contraseña'] = "La contraseña actual no puede estar vacía";
    } 
    if (empty($body['valor_2'])) {
        $errores['newcontraseña'] = "La nueva contraseña no puede estar vacía";
    } 
    if ($body['valor'] === $body['valor_2']) {
        $errores['newcontraseña'] = "La nueva contraseña no puede ser igual a la actual";
    } 
    if (empty($body['valor_3'])) {
        $errores['confirmarnewcontraseña'] = "Debe confirmar la nueva contraseña";
    }
    if ($body['valor_2'] !== $body['valor_3']) {
        $errores['confirmarnewcontraseña'] = "La confirmación de la nueva contraseña no coincide";
    } 
    // Verificar que la contraseña actual coincida con la registrada en la base de datos
    $sql = "SELECT contrasena FROM usuarios WHERE id_usuario = ?";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $_SESSION['user_id']);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if (mysqli_stmt_affected_rows($stmt) === 0) {
        $errores['contraseña'] = "Usuario no encontrado";
    } else {
        $user = $result->fetch_assoc();
        if (!password_verify($body['valor'], $user['contrasena'])) {
            $errores['contraseña'] = "Contraseña actual incorrecta";
        }
    }
        mysqli_stmt_close($stmt);
    

    $mensajes = [];
    
    if (!preg_match('/[a-z]/', $body['valor_2'])) {
        $mensajes[] = "❗una letra minúscula";
    }
    if (!preg_match('/[A-Z]/', $body['valor_2'])) {
        $mensajes[] = "❗una letra mayúscula";
    }
    if (!preg_match('/[0-9]/', $body['valor_2'])) {
        $mensajes[] = "❗un número";
    }
    if (strlen($body['valor_2']) < 8) {
        $mensajes[] = "❗mínimo 8 caracteres";
    }
    if (!preg_match('/[@$!%*?&.]/', $body['valor_2'])) {
        $mensajes[] = "❗un carácter especial (@$!%*?&.)";
    }

    if (!empty($mensajes)) {
        $errors["newcontraseña"] = "La contraseña debe tener: " . implode(", ", $mensajes);
    }
    
    if(empty($errores)) {
        $nueva_contrasena_hash = password_hash($body['valor_2'], PASSWORD_DEFAULT);
        $sql = "UPDATE usuarios SET contrasena = ? WHERE id_usuario = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "ss", $nueva_contrasena_hash, $_SESSION['user_id']);
        if (mysqli_stmt_execute($stmt)) {
            echo json_encode(["status" => "ok", "message" => "Contraseña actualizada con éxito"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al actualizar la contraseña"]);
        }
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(["status" => "error", "errores" => $errores]);
    }
}
    
?>