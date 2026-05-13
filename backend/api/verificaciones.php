<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . '/config/session_config.php';

header("Content-Type: application/json");

$debug = (getenv('APP_ENV') === 'development' || (isset($_SERVER['APP_ENV']) && $_SERVER['APP_ENV'] === 'development'));

$method = $_SERVER['REQUEST_METHOD'];

// ── GET: listar verificaciones ────────────────────────────────────────────────────
if ($method === 'GET') {
    $sql = "SELECT v.id_verificacion, v.id_animal, v.fecha, v.tipo_codigo, v.codigo,
                   v.propietario, v.id_propietario, v.contacto, v.correo, v.direccion, v.descripcion,
                   a.n_microchip, a.nombre, a.especie
            FROM verificaciones v
            INNER JOIN animales a ON v.id_animal1 = a.id_animal
            INNER JOIN usuarios u ON a.id_usuario1 = u.id_usuario WHERE a.activo = 1 AND v.activo =1";

    $result = mysqli_query($conn, $sql);

    if (!$result) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error"   => $debug ? mysqli_error($conn) : "❗Error en la consulta"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $animales = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $animales[] = $row;
    }

    echo json_encode(["success" => true, "data" => $animales], JSON_UNESCAPED_UNICODE);
    mysqli_free_result($result);
    mysqli_close($conn);
    exit;
}

// ── Leer body ───────────────────────────────────────────────────────────────
$body = $_POST;
$id_usuario = $_SESSION['user_id'] ?? null;

if ($method !== 'GET' && $id_usuario === null) {
    http_response_code(401);
    echo json_encode(["success" => false, "errores" => ["sesion" => "❗No tienes una sesión activa. Por favor inicia sesión."]], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── POST: registrar verificación ─────────────────────────────────────────────────
if ($method === 'POST') {
    $tipo_verificacion = trim($body['tipo_verificacion'] ?? '');
    $id_animal1        = trim($body['id_animal1']        ?? '');
    $fecha             = trim($body['fecha']             ?? '');
    $tipo_codigo       = trim($body['tipo_codigo']       ?? '');
    $codigo            = trim($body['codigo']            ?? '');
    $propietario       = trim($body['propietario']       ?? '');
    $id_propietario    = trim($body['id_propietario']    ?? '');
    $contacto          = trim($body['contacto']          ?? '');
    $correo            = trim($body['correo']            ?? '');
    $direccion         = trim($body['direccion']         ?? '');
    $descripcion       = trim($body['descripcion']       ?? '');

    $errores = [];

    if ($tipo_verificacion === '') $errores['tipo_verificacion'] = "❗El tipo de verificación es obligatorio.";
    if ($id_animal1 === '') $errores['id_animal1'] = "❗El animal es obligatorio.";
    if ($fecha === '') $errores['fecha'] = "❗La fecha de verificación es obligatoria.";
    if ($tipo_codigo === '') $errores['tipo_codigo'] = "❗El tipo de código es obligatorio.";
    if ($codigo === '') {
        $errores['codigo']  = "❗El código es obligatorio.";
    }
    if (strlen($codigo) > 20) {
        $errores['codigo']  = "❗El código no puede exceder los 20 caracteres.";
    }
    if ($propietario === '') $errores['propietario'] = "❗El propietario es obligatorio.";
    if (strlen($propietario) > 100) {
        $errores['propietario']  = "❗El nombre del propietario no puede exceder los 100 caracteres.";
    }
    if ($id_propietario === '') $errores['id_propietario'] = "❗La identificación del propietario es obligatoria.";
    if (strlen($id_propietario) > 10) {
        $errores['id_propietario']  = "❗La identificación del propietario no puede exceder los 10 caracteres.";
    }
    if ($id_propietario !== '' && !preg_match('/^\d+$/', $id_propietario)) {
        $errores['id_propietario'] = "❗La identificación del propietario debe contener solo números.";
    }
    if ($contacto === '') $errores['contacto'] = "❗El contacto del propietario es obligatorio.";
    if (strlen($contacto) > 10) {
        $errores['contacto']  = "❗El contacto del propietario no puede exceder los 10 caracteres.";
    }
    if ($correo === '') $errores['correo'] = "❗El correo del propietario es obligatorio.";
    elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        $errores['correo'] = "❗El correo del propietario no es válido.";
    }
    if ($direccion === '') $errores['direccion'] = "❗La dirección del propietario es obligatoria.";
    if ($descripcion === '') $errores['descripcion'] = "❗La descripción de la verificación es obligatoria.";
    if (strlen($descripcion) > 100) {
        $errores['descripcion']  = "❗La descripción de la verificación no puede exceder los 100 caracteres.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // ── Procesar imagen (opcional) ───────────────────────────────────────────
    $registro_fotografico = null;

    if (isset($_FILES['registro_fotografico']) && $_FILES['registro_fotografico']['error'] === UPLOAD_ERR_OK) {
        $archivo    = $_FILES['registro_fotografico'];
        $extension  = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));
        $permitidos = ['jpg', 'jpeg', 'png', 'webp'];

        if (!in_array($extension, $permitidos)) {
            http_response_code(422);
            echo json_encode(["success" => false, "errores" => ["registro_fotografico" => "❗Formato no permitido. Use JPG, PNG o WEBP."]], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $carpeta = dirname(__DIR__) . '/uploads/verificaciones/';
        if (!is_dir($carpeta)) mkdir($carpeta, 0755, true);

        $nombreArchivo = uniqid('verif_', true) . '.' . $extension;
        $rutaFinal     = $carpeta . $nombreArchivo;

        if (!move_uploaded_file($archivo['tmp_name'], $rutaFinal)) {
            http_response_code(500);
            echo json_encode(["success" => false, "errores" => ["registro_fotografico" => "❗Error al guardar la imagen."]], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $registro_fotografico = 'uploads/verificaciones/' . $nombreArchivo;
    }

    $stmt = mysqli_prepare(
        $conn,
        "INSERT INTO verificaciones (tipo_verificacion, id_animal1, fecha, tipo_codigo, codigo, propietario, id_propietario, contacto, correo, direccion, descripcion, registro_fotografico)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    mysqli_stmt_bind_param(
        $stmt,
        "sissssssssss",
        $tipo_verificacion,
        $id_animal1,
        $fecha,
        $tipo_codigo,
        $codigo,
        $propietario,
        $id_propietario,
        $contacto,
        $correo,
        $direccion,
        $descripcion,
        $registro_fotografico
    );

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "id_verificacion" => mysqli_insert_id($conn)], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al registrar la verificación."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── PUT: editar verificación ─────────────────────────────────────────────────────
if ($method === 'PUT') {
    $id_verificacion   = intval($body['id_verificacion'] ?? 0);
    $tipo_verificacion = trim($body['tipo_verificacion'] ?? '');
    $id_animal1        = intval($body['id_animal1']      ?? 0);
    $fecha             = trim($body['fecha']             ?? '');
    $tipo_codigo       = trim($body['tipo_codigo']       ?? '');
    $codigo            = trim($body['codigo']            ?? '');
    $propietario       = trim($body['propietario']       ?? '');
    $id_propietario    = trim($body['id_propietario']    ?? '');
    $contacto          = trim($body['contacto']          ?? '');
    $correo            = trim($body['correo']            ?? '');
    $direccion         = trim($body['direccion']         ?? '');
    $descripcion       = trim($body['descripcion']       ?? '');

    $errores = [];

    if ($tipo_verificacion === '') $errores['tipo_verificacion'] = "❗El tipo de verificación es obligatorio.";
    if ($id_animal1 === '') $errores['id_animal1'] = "❗El animal es obligatorio.";
    if ($fecha === '') $errores['fecha'] = "❗La fecha de verificación es obligatoria.";
    if ($tipo_codigo === '') $errores['tipo_codigo'] = "❗El tipo de código es obligatorio.";
    if ($codigo === '') {
        $errores['codigo']  = "❗El código es obligatorio.";
    }
    if (strlen($codigo) > 20) {
        $errores['codigo']  = "❗El código no puede exceder los 20 caracteres.";
    }
    if ($propietario === '') $errores['propietario'] = "❗El propietario es obligatorio.";
    if (strlen($propietario) > 100) {
        $errores['propietario']  = "❗El nombre del propietario no puede exceder los 100 caracteres.";
    }
    if ($id_propietario === '') $errores['id_propietario'] = "❗La identificación del propietario es obligatoria.";
    if (strlen($id_propietario) > 10) {
        $errores['id_propietario']  = "❗La identificación del propietario no puede exceder los 10 caracteres.";
    }
    if ($id_propietario !== '' && !preg_match('/^\d+$/', $id_propietario)) {
        $errores['id_propietario'] = "❗La identificación del propietario debe contener solo números.";
    }
    if ($contacto === '') $errores['contacto'] = "❗El contacto del propietario es obligatorio.";
    if (strlen($contacto) > 10) {
        $errores['contacto']  = "❗El contacto del propietario no puede exceder los 10 caracteres.";
    }
    if ($correo === '') $errores['correo'] = "❗El correo del propietario es obligatorio.";
    elseif (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        $errores['correo'] = "❗El correo del propietario no es válido.";
    }
    if ($direccion === '') $errores['direccion'] = "❗La dirección del propietario es obligatoria.";
    if ($descripcion === '') $errores['descripcion'] = "❗La descripción de la verificación es obligatoria.";
    if (strlen($descripcion) > 100) {
        $errores['descripcion']  = "❗La descripción de la verificación no puede exceder los 100 caracteres.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }


    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare(
        $conn,
        "UPDATE verificaciones
         SET tipo_verificacion = ?, id_animal1 = ?, fecha = ?, tipo_codigo = ?, codigo = ?, propietario = ?, id_propietario = ?, contacto = ?, correo = ?, direccion = ?, descripcion = ?
         WHERE id_verificacion = ?"
    );
    mysqli_stmt_bind_param(
        $stmt,
        "sisssssssssi",
        $tipo_verificacion,
        $id_animal1,
        $fecha,
        $tipo_codigo,
        $codigo,
        $propietario,
        $id_propietario,
        $contacto,
        $correo,
        $direccion,
        $descripcion,
        $id_verificacion
    );

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode(["success" => false, "errores" => ["general" => "❗Verificación no encontrada."]], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al actualizar la verificación."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── DELETE: desactivar verificación ──────────────────────────────────────────────
if ($method === 'DELETE') {
    $id_verificacion = intval($body['id_verificacion'] ?? 0);

    if ($id_verificacion === 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "errores" => ["general" => "ID de verificación inválido."]], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn, "UPDATE verificaciones SET activa = 0 WHERE id_verificacion = ?");
    mysqli_stmt_bind_param($stmt, "i", $id_verificacion);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode(["success" => false, "errores" => ["general" => "❗Verificación no encontrada."]], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al desactivar la verificación."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── Método no permitido ──────────────────────────────────────────────────────
http_response_code(405);
echo json_encode(["success" => false, "errores" => ["general" => "Método no permitido."]], JSON_UNESCAPED_UNICODE);
