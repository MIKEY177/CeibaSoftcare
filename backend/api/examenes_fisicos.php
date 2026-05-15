<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . '/config/session_config.php';
require_once dirname(__DIR__) . '/config/env.php';
loadEnv(__DIR__ . '/../../.env.development');

$method = $_SERVER['REQUEST_METHOD'];
header("Content-Type: application/json");

$debug = getenv('APP_ENV') === 'development';
$body  = json_decode(file_get_contents("php://input"), true);

// ── GET: obtener exámenes de una historia médica ─────────────────────────────
if ($method === 'GET') {
    $id_historia_medica = intval($_GET['id_historia_medica'] ?? 0);

    if ($id_historia_medica === 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "ID de historia médica inválido."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $sql  = "SELECT id_examen_fisico, frecuencia_cardiaca, frecuencia_respiratoria,
                    mucosas, temperatura, tiempo_llenado, condicion_corporal, fecha
             FROM examenes_fisicos
             WHERE id_historia1 = ?
             ORDER BY fecha DESC";
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "i", $id_historia_medica);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($result && mysqli_num_rows($result) > 0) {
        $examenes = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $examenes[] = $row;
        }
        echo json_encode(["success" => true, "data" => $examenes], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(["success" => true, "data" => []], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    exit;
}

// ── POST: registrar examen físico ────────────────────────────────────────────
if ($method === 'POST') {
    $id_historia_medica           = intval(trim($body['id_historia_medica']      ?? 0));
    $frecuencia_cardiaca   = trim($body['frecuencia_cardiaca']            ?? '');
    $frecuencia_resp       = trim($body['frecuencia_respiratoria']        ?? '');
    $mucosas               = trim($body['mucosa']                         ?? '');
    $temperatura           = trim($body['temperatura_rectal']             ?? '');
    $tiempo_llenado        = trim($body['tiempo_llenado_capilar']         ?? '');
    $condicion_corporal    = trim($body['condicion_corporal']             ?? '');
    $fecha                 = trim($body['fecha']                          ?? '');

    $errores = [];

    if ($id_historia_medica === 0) {
        $errores['general'] = "❗ID de historia médica inválido.";
    }

    if ($frecuencia_cardiaca === '') {
        $errores['frecuencia_cardiaca'] = "❗La frecuencia cardiaca es obligatoria.";
    }
    if (strlen($frecuencia_cardiaca) > 10) {
        $errores['frecuencia_cardiaca'] = "❗La frecuencia cardiaca no puede exceder 10 caracteres.";
    }

    if ($frecuencia_resp === '') {
        $errores['frecuencia_respiratoria'] = "❗La frecuencia respiratoria es obligatoria.";
    }
    if (strlen($frecuencia_resp) > 10) {
        $errores['frecuencia_respiratoria'] = "❗La frecuencia respiratoria no puede exceder 10 caracteres.";
    }

    if ($mucosas === '') {
        $errores['mucosa'] = "❗La mucosa es obligatoria.";
    }
    if (strlen($mucosas) > 10) {
        $errores['mucosa'] = "❗La mucosa no puede exceder 100 caracteres.";
    }
    if ($temperatura === '') {
        $errores['temperatura_rectal'] = "❗La temperatura rectal es obligatoria.";
    }
    if (strlen($temperatura) > 10) {
        $errores['temperatura_rectal'] = "❗La temperatura rectal no puede exceder 10 caracteres.";
    }
    if ($tiempo_llenado === '') {
        $errores['tiempo_llenado_capilar'] = "❗El tiempo de llenado capilar es obligatorio.";
    }
    if (strlen($tiempo_llenado) > 10) {
        $errores['tiempo_llenado_capilar'] = "❗El tiempo de llenado capilar no puede exceder 10 caracteres.";
    }

    if ($condicion_corporal === '') {
        $errores['condicion_corporal'] = "❗La condición corporal es obligatoria.";
    }
    if (strlen($condicion_corporal) > 10) {
        $errores['condicion_corporal'] = "❗La condición corporal no puede exceder 10 caracteres.";
    }

    if ($fecha === '') {
        $errores['fecha'] = "❗La fecha es obligatoria.";
    } elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        $errores['fecha'] = "❗El formato de fecha es inválido.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt_dup = mysqli_prepare($conn,
    "SELECT id_examen_fisico FROM examenes_fisicos 
     WHERE id_historia1 = ? AND fecha = ? AND frecuencia_cardiaca = ?
     LIMIT 1"
);
mysqli_stmt_bind_param($stmt_dup, "iss", $id_historia_medica, $fecha, $frecuencia_cardiaca);
mysqli_stmt_execute($stmt_dup);
mysqli_stmt_store_result($stmt_dup);

if (mysqli_stmt_num_rows($stmt_dup) > 0) {
    mysqli_stmt_close($stmt_dup);
    http_response_code(409);
    echo json_encode([
        "success" => false,
        "errores" => ["general" => "❗Ya existe un examen con estos datos."]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
mysqli_stmt_close($stmt_dup);
    $stmt = mysqli_prepare($conn,
        "INSERT INTO examenes_fisicos
            (frecuencia_cardiaca, frecuencia_respiratoria, mucosas, temperatura, tiempo_llenado, condicion_corporal, fecha, id_historia1)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    mysqli_stmt_bind_param($stmt, "sssssssi",
        $frecuencia_cardiaca,
        $frecuencia_resp,
        $mucosas,
        $temperatura,
        $tiempo_llenado,
        $condicion_corporal,
        $fecha,
        $id_historia_medica
    );

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "success"          => true,
            "id_examen_fisico" => mysqli_insert_id($conn)
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al registrar el examen físico."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── PUT: editar examen físico ────────────────────────────────────────────────
if ($method === 'PUT') {
    $id_examen           = intval($body['id_examen']                  ?? 0);
    $frecuencia_cardiaca = trim($body['frecuencia_cardiaca']          ?? '');
    $frecuencia_resp     = trim($body['frecuencia_respiratoria']      ?? '');
    $mucosas             = trim($body['mucosa']                       ?? '');
    $temperatura         = trim($body['temperatura_rectal']           ?? '');
    $tiempo_llenado      = trim($body['tiempo_llenado_capilar']       ?? '');
    $condicion_corporal  = trim($body['condicion_corporal']           ?? '');
    $fecha               = trim($body['fecha']                        ?? '');

    $errores = [];

    if ($id_examen === 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "ID de examen físico inválido."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Verificar que el examen existe
    $stmt_check = mysqli_prepare($conn, "SELECT id_examen_fisico FROM examenes_fisicos WHERE id_examen_fisico = ?");
    mysqli_stmt_bind_param($stmt_check, "i", $id_examen);
    mysqli_stmt_execute($stmt_check);
    mysqli_stmt_store_result($stmt_check);

    if (mysqli_stmt_num_rows($stmt_check) === 0) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "❗Examen físico no encontrado."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
    mysqli_stmt_close($stmt_check);

    if ($frecuencia_cardiaca === '') {
        $errores['frecuencia_cardiaca'] = "❗La frecuencia cardiaca es obligatoria.";
    }

    if ($frecuencia_resp === '') {
        $errores['frecuencia_respiratoria'] = "❗La frecuencia respiratoria es obligatoria.";
    }

    if ($mucosas === '') {
        $errores['mucosa'] = "❗La mucosa es obligatoria.";
    }

    if ($tiempo_llenado === '') {
        $errores['tiempo_llenado_capilar'] = "❗El tiempo de llenado capilar es obligatorio.";
    }

    if ($condicion_corporal === '') {
        $errores['condicion_corporal'] = "❗La condición corporal es obligatoria.";
    }

    if ($fecha === '') {
        $errores['fecha'] = "❗La fecha es obligatoria.";
    } elseif (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
        $errores['fecha'] = "❗El formato de fecha es inválido.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn,
        "UPDATE examenes_fisicos
         SET frecuencia_cardiaca = ?, frecuencia_respiratoria = ?, mucosas = ?,
             temperatura = ?, tiempo_llenado = ?, condicion_corporal = ?, fecha = ?
         WHERE id_examen_fisico = ?"
    );
    mysqli_stmt_bind_param($stmt, "sssssssi",
    $frecuencia_cardiaca,
    $frecuencia_resp,
    $mucosas,
    $temperatura,
    $tiempo_llenado,
    $condicion_corporal,
    $fecha,
    $id_examen
);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗No se realizaron cambios."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al editar el examen físico."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── DELETE: eliminar examen físico ───────────────────────────────────────────
if ($method === 'DELETE') {
    $id_examen = intval($body['id_examen'] ?? 0);

    if ($id_examen === 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "ID de examen físico inválido."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn, "DELETE FROM examenes_fisicos WHERE id_examen_fisico = ?");
    mysqli_stmt_bind_param($stmt, "i", $id_examen);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗Examen físico no encontrado."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al eliminar el examen físico."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}
