<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . '/config/session_config.php';

header("Content-Type: application/json");

$debug = (getenv('APP_ENV') === 'development' || (isset($_SERVER['APP_ENV']) && $_SERVER['APP_ENV'] === 'development'));
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST' && isset($_POST['_method']) && $_POST['_method'] === 'PUT') {
    $method = 'PUT';
}

$body = $_POST;

if ($method === 'GET') {
    // ── GET por id ───────────────────────────────────────────────
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $stmt = mysqli_prepare($conn,
            "SELECT v.*, a.nombre FROM verificaciones v
             INNER JOIN animales a ON v.id_animal1 = a.id_animal
             WHERE v.id_verificacion = ?"
        );
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $row = mysqli_fetch_assoc($result);
        if ($row) {
            echo json_encode(["success" => true, "data" => $row], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "error" => "❗Verificación no encontrada."], JSON_UNESCAPED_UNICODE);
        }
        mysqli_stmt_close($stmt);
        mysqli_close($conn);
        exit;
    }

    // ── GET todos ────────────────────────────────────────────────
    $sql = "SELECT v.id_verificacion, v.id_animal1, v.tipo_verificacion, v.fecha, v.tipo_codigo, v.codigo,
                   v.propietario, v.id_propietario, v.contacto, v.correo, v.direccion, v.descripcion,
                   v.registro_fotografico, a.n_microchip, a.nombre, a.especie
            FROM verificaciones v
            INNER JOIN animales a ON v.id_animal1 = a.id_animal
            INNER JOIN usuarios u ON a.id_usuario1 = u.id_usuario
            WHERE a.activo = 1 AND v.activo = 1";

    $result = mysqli_query($conn, $sql);

    if (!$result) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error"   => $debug ? mysqli_error($conn) : "❗Error en la consulta"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $verificaciones = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $verificaciones[] = $row;
    }

    echo json_encode(["success" => true, "data" => $verificaciones], JSON_UNESCAPED_UNICODE);
    mysqli_free_result($result);
    mysqli_close($conn);
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

            $file = $_FILES['registro_fotografico']['tmp_name'];
            $cloud_name = env('CLOUDINARY_CLOUD_NAME');
            $upload_preset = env('CLOUDINARY_UPLOAD_PRESET_REGISTROS'); // sin firma (unsigned)

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
            $isLocal = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');

            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, !$isLocal);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, $isLocal ? 0 : 2);



            $response = curl_exec($ch);
            
                if (curl_errno($ch)) {
                    echo json_encode(["status" => "error", "message" => curl_error($ch)]);
                    exit;
                }
            
            $registro_fotografico = json_decode($response, true)['secure_url'] ?? null;
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
    if ($id_animal1 <= 0) $errores['id_animal1'] = "❗El animal es obligatorio.";
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
    $registro_fotografico = null;

if (
    isset($_FILES['registro_fotografico']) &&
    $_FILES['registro_fotografico']['error'] === UPLOAD_ERR_OK
) {

    $archivo = $_FILES['registro_fotografico'];

    $extension = strtolower(
        pathinfo($archivo['name'], PATHINFO_EXTENSION)
    );

    $permitidos = ['jpg', 'jpeg', 'png', 'webp'];

    if (!in_array($extension, $permitidos)) {

        http_response_code(422);

        echo json_encode([
            "success" => false,
            "errores" => [
                "registro_fotografico" =>
                "❗Formato no permitido."
            ]
        ]);

        exit;
    }
    $file = $_FILES['registro_fotografico']['tmp_name'];
    $cloud_name = env('CLOUDINARY_CLOUD_NAME');
    $upload_preset = env('CLOUDINARY_UPLOAD_PRESET_REGISTROS'); // sin firma (unsigned)

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
    
    $registro_fotografico = json_decode($response, true)['secure_url'] ?? null;

    
}

// ── UPDATE ───────────────────────────────────────────────

if ($registro_fotografico) {

    $stmt = mysqli_prepare(
        $conn,
        "UPDATE verificaciones
         SET tipo_verificacion = ?,
             id_animal1 = ?,
             fecha = ?,
             tipo_codigo = ?,
             codigo = ?,
             propietario = ?,
             id_propietario = ?,
             contacto = ?,
             correo = ?,
             direccion = ?,
             descripcion = ?,
             registro_fotografico = ?
         WHERE id_verificacion = ?"
    );

    mysqli_stmt_bind_param(
        $stmt,
        "sissssssssssi",
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
        $registro_fotografico,
        $id_verificacion
    );

} else {

    $stmt = mysqli_prepare(
        $conn,
        "UPDATE verificaciones
         SET tipo_verificacion = ?,
             id_animal1 = ?,
             fecha = ?,
             tipo_codigo = ?,
             codigo = ?,
             propietario = ?,
             id_propietario = ?,
             contacto = ?,
             correo = ?,
             direccion = ?,
             descripcion = ?
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
}
if (mysqli_stmt_execute($stmt)) {

    echo json_encode([
        "success" => true
    ], JSON_UNESCAPED_UNICODE);

} else {

    http_response_code(500);

    echo json_encode([
        "success" => false,
        "errores" => [
            "general" =>
                $debug
                ? mysqli_stmt_error($stmt)
                : "❗Error al actualizar la verificación."
        ]
    ], JSON_UNESCAPED_UNICODE);
}
    
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}
// ── Método no permitido ──────────────────────────────────────────────────────
http_response_code(405);
echo json_encode(["success" => false, "errores" => ["general" => "Método no permitido."]], JSON_UNESCAPED_UNICODE);
