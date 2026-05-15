<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . '/config/session_config.php';

header("Content-Type: application/json");

$debug = (getenv('APP_ENV') === 'development' || (isset($_SERVER['APP_ENV']) && $_SERVER['APP_ENV'] === 'development'));

$method = $_SERVER['REQUEST_METHOD'];

// ── GET: listar historias médicas ─────────────────────────────────────────────
if ($method === 'GET') {
    $sql = "SELECT 
            h.id_historia_medica,
            h.id_animal1,
            a.nombre AS nombre_animal,
            a.especie,
            h.fecha_creacion
        FROM historias_medicas h
        INNER JOIN animales a ON h.id_animal1 = a.id_animal
        INNER JOIN usuarios u ON a.id_usuario1 = u.id_usuario
        WHERE a.activo = 1";

    $result = mysqli_query($conn, $sql);

    if (!$result) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error"   => $debug ? mysqli_error($conn) : "❗Error en la consulta"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $historias = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $historias[] = $row;
    }

    echo json_encode(["success" => true, "data" => $historias], JSON_UNESCAPED_UNICODE);
    mysqli_free_result($result);
    mysqli_close($conn);
    exit;
}

// ── Leer body JSON ────────────────────────────────────────────────────────────
$body = json_decode(file_get_contents("php://input"), true);

if ($method !== 'GET' && $body === null) {
    http_response_code(400);
    echo json_encode(["success" => false, "errores" => ["general" => "Body JSON inválido o vacío"]], JSON_UNESCAPED_UNICODE);
    exit;
}

$id_usuario = $_SESSION['user_id'] ?? null;

if ($method !== 'GET' && $id_usuario === null) {
    http_response_code(401);
    echo json_encode(["success" => false, "errores" => ["sesion" => "❗No tienes una sesión activa. Por favor inicia sesión."]], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── POST: registrar historia médica ───────────────────────────────────────────
if ($method === 'POST') {
    $id_animal1      = intval($body['id_animal1'] ?? 0);
    $fecha_creacion = trim($body['fecha_creacion'] ?? '');

    $errores = [];

    if ($id_animal1 <= 0) {
        $errores['id_animal1'] = "❗El animal es obligatorio.";
    }

    if ($fecha_creacion === '') {
        $errores['fecha_creacion'] = "❗La fecha de creación es obligatoria.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $check = mysqli_prepare(
        $conn,
        "SELECT id_historia_medica
     FROM historias_medicas
     WHERE id_animal1 = ?"
    );

    mysqli_stmt_bind_param($check, "i", $id_animal1);
    mysqli_stmt_execute($check);

    $resultado = mysqli_stmt_get_result($check);

    if (mysqli_num_rows($resultado) > 0) {
        http_response_code(409);

        echo json_encode([
            "success" => false,
            "errores" => [
                "animal" => "❗Este animal ya tiene una historia médica registrada."
            ]
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    mysqli_stmt_close($check);
    $stmt = mysqli_prepare(
        $conn,
        "INSERT INTO historias_medicas (id_animal1, fecha_creacion)
     VALUES (?, ?)"
    );

    mysqli_stmt_bind_param(
        $stmt,
        "is",
        $id_animal1,
        $fecha_creacion
    );
    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "id_historia_medica" => mysqli_insert_id($conn)], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al registrar la historia médica."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── PUT: editar historia médica ───────────────────────────────────────────────
if ($method === 'PUT') {

    $id_historia_medica = intval($body['id_historia_medica'] ?? 0);
    $id_animal1         = intval($body['id_animal1'] ?? 0);
    $fecha_creacion     = trim($body['fecha_creacion'] ?? '');

    $errores = [];

    if ($id_historia_medica <= 0) {
        $errores['general'] = "❗ID de historia médica inválido.";
    }

    if ($id_animal1 <= 0) {
        $errores['id_animal1'] = "❗El animal es obligatorio.";
    }

    if ($fecha_creacion === '') {
        $errores['fecha_creacion'] = "❗La fecha de creación es obligatoria.";
    }

    if (!empty($errores)) {
        http_response_code(422);

        echo json_encode([
            "success" => false,
            "errores" => $errores
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    // evitar duplicados
    $check = mysqli_prepare(
        $conn,
        "SELECT id_historia_medica
         FROM historias_medicas
         WHERE id_animal1 = ?
         AND id_historia_medica != ?"
    );

    mysqli_stmt_bind_param(
        $check,
        "ii",
        $id_animal1,
        $id_historia_medica
    );

    mysqli_stmt_execute($check);

    $resultado = mysqli_stmt_get_result($check);

    if (mysqli_num_rows($resultado) > 0) {

        http_response_code(409);

        echo json_encode([
            "success" => false,
            "errores" => [
                "id_animal1" =>
                "❗Este animal ya tiene una historia médica."
            ]
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    mysqli_stmt_close($check);

    // actualizar
    $stmt = mysqli_prepare(
        $conn,
        "UPDATE historias_medicas
         SET id_animal1 = ?, fecha_creacion = ?
         WHERE id_historia_medica = ?"
    );

    mysqli_stmt_bind_param(
        $stmt,
        "isi",
        $id_animal1,
        $fecha_creacion,
        $id_historia_medica
    );

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
                    : "❗Error al actualizar la historia médica."
            ]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}
// ── Método no permitido ───────────────────────────────────────────────────────
http_response_code(405);
echo json_encode(["success" => false, "errores" => ["general" => "Método no permitido."]], JSON_UNESCAPED_UNICODE);
