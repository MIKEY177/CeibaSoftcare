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

if ($_GET['id'] ?? false) {
   $sql = "SELECT ia.id_ingreso, ia.persona_reporta, ia.cedula_reporta, ia.direccion_reporta,
                   ia.telefono_reporta, ia.funcionario_autoriza, ia.persona_realiza, ia.cedula_realiza,
                   ia.motivo_ingreso, ia.fecha_hora_ingreso, ia.id_verificacion1,
                   a.nombre, v.fecha
            FROM ingresos_animales ia
            INNER JOIN verificaciones v ON v.id_verificacion = ia.id_verificacion1
            INNER JOIN animales a ON v.id_animal1 = a.id_animal
            WHERE ia.activo = 1 AND ia.id_ingreso = " . intval($_GET['id']);

    $result = mysqli_query($conn, $sql);

    if (!$result) {
        response([
            "success" => false,
            "error" => $debug ? mysqli_error($conn) : "Error en la consulta"
        ], 500);
    }

    $data = mysqli_fetch_assoc($result);

    mysqli_free_result($result);
    mysqli_close($conn);

    if (!$data) {
        response(["success" => false, "error" => "Ingreso no encontrado"], 404);
    }

    response(["success" => true, "data" => $data]);
}

// ── GET: mantener INNER JOIN ───────────────────────────
if ($method === 'GET') {

    $sql_one = "SELECT ia.id_ingreso, ia.persona_reporta, ia.cedula_reporta, ia.direccion_reporta,
                   ia.telefono_reporta, ia.funcionario_autoriza, ia.persona_realiza, ia.cedula_realiza,
                   ia.motivo_ingreso, ia.fecha_hora_ingreso, ia.id_verificacion1,
                   a.nombre, v.fecha
            FROM ingresos_animales ia
            INNER JOIN verificaciones v ON v.id_verificacion = ia.id_verificacion1
            INNER JOIN animales a ON v.id_animal1 = a.id_animal
            WHERE ia.activo = 1";

    $result = mysqli_query($conn, $sql_one);

    if (!$result) {
        response([
            "success" => false,
            "error" => $debug ? mysqli_error($conn) : "Error en la consulta"
        ], 500);
    }

    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }

    mysqli_free_result($result);
    mysqli_close($conn);

    response(["success" => true, "data" => $data]);
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

// ── Validación (ahora con IDs) ─────────────────────────
function validarIngresoAnimal($body) {

    $data = [
        'persona_reporta'      => trim($body['persona_reporta'] ?? ''),
        'cedula_reporta'       => trim($body['cedula_reporta'] ?? ''),
        'direccion_reporta'    => trim($body['direccion_reporta'] ?? ''),
        'telefono_reporta'     => trim($body['telefono_reporta'] ?? ''),
        'funcionario_autoriza' => trim($body['funcionario_autoriza'] ?? ''),
        'persona_realiza'      => trim($body['persona_realiza'] ?? ''),
        'cedula_realiza'       => trim($body['cedula_realiza'] ?? ''),
        'motivo_ingreso'       => trim($body['motivo_ingreso'] ?? ''),
        'fecha_hora_ingreso'   => trim($body['fecha_hora_ingreso'] ?? ''),
        'id_verificacion1'     => intval($body['id_verificacion'] ?? 0),
    ];

    $errores = [];

    if (preg_match('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/', $data['fecha_hora_ingreso']) !== 1) {
        $errores['fecha_hora_ingreso'] = "El campo fecha_hora_ingreso debe tener el formato YYYY-MM-DDTHH:MM";
    }

    if (strlen($data['persona_reporta'])>255) {
        $errores['persona_reporta'] = "El campo persona_reporta no puede exceder 255 caracteres";
    }

    if (strlen($data['persona_realiza'])>255) {
        $errores['persona_realiza'] = "El campo persona_realiza no puede exceder 255 caracteres";
    }


    if (strlen($data['motivo_ingreso'])>255) {
        $errores['motivo_ingreso'] = "El campo motivo_ingreso no puede exceder 255 caracteres";
    }

    foreach ($data as $key => $value) {
        if ($value === '' || $value === 0) {
            $errores[$key] = "El campo $key es obligatorio";
        }
    }

    return [$errores, $data];
}

// ── POST ───────────────────────────────────────────────
if ($method === 'POST') {

    list($errores, $data) = validarIngresoAnimal($body);

    if (!empty($errores)) {
        response(["success" => false, "errores" => $errores], 422);
    }

    $stmt = mysqli_prepare($conn, "
        INSERT INTO ingresos_animales (
            persona_reporta,
            cedula_reporta,
            direccion_reporta,
            telefono_reporta,
            funcionario_autoriza,
            persona_realiza,
            cedula_realiza,
            motivo_ingreso,
            fecha_hora_ingreso,
            id_verificacion1
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    mysqli_stmt_bind_param($stmt, "sssssssssi",
        $data['persona_reporta'],
        $data['cedula_reporta'],
        $data['direccion_reporta'],
        $data['telefono_reporta'],
        $data['funcionario_autoriza'],
        $data['persona_realiza'],
        $data['cedula_realiza'],
        $data['motivo_ingreso'],
        $data['fecha_hora_ingreso'],
        $data['id_verificacion1']
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
}

// ── PUT ────────────────────────────────────────────────
if ($method === 'PUT') {

    $id = intval($body['id_ingreso'] ?? 0);

    if ($id <= 0) {
        response(["success" => false, "errores" => ["id" => "ID inválido"]], 400);
    }

    list($errores, $data) = validarIngresoAnimal($body);

    if (!empty($errores)) {
        response(["success" => false, "errores" => $errores], 422);
    }

    $stmt = mysqli_prepare($conn, "
        UPDATE ingresos_animales SET
            persona_reporta = ?,
            cedula_reporta = ?,
            direccion_reporta = ?,
            telefono_reporta = ?,
            funcionario_autoriza = ?,
            persona_realiza = ?,
            cedula_realiza = ?,
            motivo_ingreso = ?,
            fecha_hora_ingreso = ?,
            id_verificacion1 = ?
        WHERE id_ingreso = ? AND activo = 1
    ");

    mysqli_stmt_bind_param($stmt, "ssssssssssi",
        $data['persona_reporta'],
        $data['cedula_reporta'],
        $data['direccion_reporta'],
        $data['telefono_reporta'],
        $data['funcionario_autoriza'],
        $data['persona_realiza'],
        $data['cedula_realiza'],
        $data['motivo_ingreso'],
        $data['fecha_hora_ingreso'],
        $data['id_verificacion1'],
        $id
    );

    if (mysqli_stmt_execute($stmt)) {
        response(["success" => true]);
    }

    response([
        "success" => false,
        "errores" => ["general" => mysqli_stmt_error($stmt)]
    ], 500);
}

// ── DELETE ─────────────────────────────────────────────
if ($method === 'DELETE') {

    $id = intval($body['id_ingreso_animal'] ?? 0);

    if ($id <= 0) {
        response(["success" => false, "errores" => ["id" => "ID inválido"]], 400);
    }

    $stmt = mysqli_prepare($conn, "
        UPDATE ingresos_animales 
        SET activo = 0 
        WHERE id_ingreso = ?
    ");

    mysqli_stmt_bind_param($stmt, "i", $id);

    if (mysqli_stmt_execute($stmt)) {
        response(["success" => true]);
    }

    response([
        "success" => false,
        "errores" => ["general" => mysqli_stmt_error($stmt)]
    ], 500);
}

// ── Método no permitido ────────────────────────────────
response([
    "success" => false,
    "errores" => ["general" => "Método no permitido"]
], 405);

