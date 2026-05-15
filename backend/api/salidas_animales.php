<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . '/config/session_config.php';

header("Content-Type: application/json");

// ── Config ─────────────────────────────────────────────
$debug = (getenv('APP_ENV') === 'development' || ($_SERVER['APP_ENV'] ?? '') === 'development');
$method = $_SERVER['REQUEST_METHOD'];

// ── Helper response ────────────────────────────────────
function response($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// ── GET: mantener INNER JOIN ───────────────────────────
if ($method === 'GET') {
    $sql_one = "SELECT sa.id_salida, sa.responsable_salida, sa.animales_id_animales, 
                   sa.motivo_salida, sa.fecha_salida,
                   a.nombre
            FROM salidas_animales sa
            INNER JOIN animales a ON sa.animales_id_animales = a.id_animal
            WHERE sa.activo = 1";

    $result_one = mysqli_query($conn, $sql_one);

    if (!$result_one) {
        response([
            "success" => false,
            "error" => $debug ? mysqli_error($conn) : "Error en la consulta"
        ], 500);
    }

    $data_one = [];
    while ($row = mysqli_fetch_assoc($result_one)) {
        $data_one[] = $row;
    }

    mysqli_free_result($result_one);
    mysqli_close($conn);

    response(["success" => true, "data" => $data_one]);
}

// ── Leer JSON ──────────────────────────────────────────
$body = json_decode(file_get_contents("php://input"), true);

if ($method !== 'GET' && $body === null) {
    response(["success" => false, "errores" => ["general" => "Body JSON inválido"]], 400);
}

// ── Validar sesión ─────────────────────────────────────
$id_usuario = $_SESSION['user_id'] ?? null;

if ($method !== 'GET' && !$id_usuario) {
    response([
        "success" => false,
        "errores" => ["sesion" => "No tienes sesión activa"]
    ], 401);
}

function validarSalidaAnimal($body) {
    $errores = [];
    $data = [
        'responsable_salida' => trim($body['responsable_salida'] ?? ''),
        'animales_id_animales' => intval($body['animales_id_animales'] ?? 0),
        'motivo_salida' => trim($body['motivo_salida'] ?? ''),
        'fecha_salida' => trim($body['fecha_salida'] ?? '')
    ];

    if (empty($data['responsable_salida'])) {
        $errores['responsable_salida'] = "El campo 'responsable_salida' es obligatorio.";
    }
    if (empty($data['motivo_salida'])) {
        $errores['motivo_salida'] = "El campo 'motivo_salida' es obligatorio.";
    }
    if (strlen($data['motivo_salida'] ?? '') > 255) {
        $errores['motivo_salida'] = "El campo 'motivo_salida' no puede exceder los 255 caracteres.";
    }
    if (strlen($data['responsable_salida'] ?? '') > 60) {
        $errores['responsable_salida'] = "El campo 'responsable_salida' no puede exceder los 60 caracteres.";
    }
        
    if (empty($data['animales_id_animales']) || !is_numeric($data['animales_id_animales'])) {
        $errores['animales_id_animales'] = "El campo 'animales' es obligatorio";
    }
    if (empty($data['fecha_salida']) || !strtotime($data['fecha_salida'])) {
        $errores['fecha_salida'] = "El campo 'fecha_salida' es obligatorio y debe ser una fecha válida.";
    }

    foreach ($data as $key => $value) {
        if ($value === '' || $value === 0) {
            $errores[$key] = "El campo $key es obligatorio";
        }
    }

    return [$errores, $data];
}

//-- POST: registrar salida de animal ─────────────────────────
if ($method === 'POST') {
    list($errores, $data) = validarSalidaAnimal($body);

    if (!empty($errores)) {
        response(["success" => false, "errores" => $errores], 422);
    }

    $sql_insert = "INSERT INTO salidas_animales (responsable_salida, animales_id_animales, motivo_salida, fecha_salida)
                   VALUES (?, ?, ?, ?)";
    
    $stmt = mysqli_prepare($conn, $sql_insert);

    mysqli_stmt_bind_param($stmt, "siss", 
        $data['responsable_salida'], 
        $data['animales_id_animales'], 
        $data['motivo_salida'], 
        $data['fecha_salida']
    );

    if (mysqli_stmt_execute($stmt)) {
        response([
            "success" => true,
            "id" => mysqli_insert_id($conn)
        ]);
    }

    response([
        "success" => false,
        "errores" => ["general" => mysqli_stmt_error($stmt)]
    ], 500);
    mysqli_close($conn);
}

// ── PUT ───────────────────────────────────────────
if($method === 'PUT') {
    
    $id = intval($body['id_salida'] ?? 0);

        if ($id <= 0) {
            response(["success" => false, "error" => "ID no válido"], 400);
        }

    list($errores, $data) = validarSalidaAnimal($body);

    if (!empty($errores)) {
        response(["success" => false, "errores" => $errores], 422);
    }

    $sql_update = "UPDATE salidas_animales SET 
                    responsable_salida = ?,
                    animales_id_animales = ?,
                    motivo_salida = ?,
                    fecha_salida = ?
                    WHERE id_salida = $id";
        $stmt = mysqli_prepare($conn, $sql_update);
        mysqli_stmt_bind_param($stmt, "siss", 
            $data['responsable_salida'], 
            $data['animales_id_animales'], 
            $data['motivo_salida'], 
            $data['fecha_salida']
        );
        if (mysqli_stmt_execute($stmt)) {
            response(["success" => true]);
        }

    response([
        "success" => false,
        "errores" => ["general" => mysqli_stmt_error($stmt)]
    ], 500);
    mysqli_close($conn);
}