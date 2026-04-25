<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';

header("Content-Type: application/json");

$isLocal = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');

session_set_cookie_params([
    'lifetime' => 3600,
    'path'     => '/',
    'domain'   => $isLocal ? '' : $_SERVER['HTTP_HOST'],
    'secure'   => !$isLocal,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

$debug = (getenv('APP_ENV') === 'development' || (isset($_SERVER['APP_ENV']) && $_SERVER['APP_ENV'] === 'development'));

$method = $_SERVER['REQUEST_METHOD'];

// ── GET: listar animales ────────────────────────────────────────────────────
if ($method === 'GET') {
    $sql = "SELECT a.id_animal, a.n_microchip, a.nombre, a.especie,
                   a.sexo, a.fecha_nac_estimada, a.observaciones, a.tipo
            FROM animales a
            INNER JOIN usuarios u ON a.id_usuario1 = u.id_usuario WHERE a.activo = 1";

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

// ── Leer body JSON ───────────────────────────────────────────────────────────
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
// ── POST: registrar animal ─────────────────────────────────────────────────
if ($method === 'POST') {
    // FIX #1: usar fecha_nac_estimada en lugar de edad_estimada
    $n_microchip        = trim($body['n_microchip']        ?? '');
    $nombre             = trim($body['nombre']             ?? '');
    $especie            = trim($body['especie']            ?? '');
    $sexo               = trim($body['sexo']               ?? '');
    $fecha_nac_estimada = trim($body['fecha_nac_estimada'] ?? '');
    $observaciones      = trim($body['observaciones']      ?? '');


    $errores = [];

    if ($nombre === '') {
        $errores['nombre'] = "❗El nombre del animal es obligatorio.";
    } elseif (strlen($nombre) > 100) {
        $errores['nombre'] = "❗El nombre no puede superar los 100 caracteres.";
    }

    if ($n_microchip !== '') {
        $stmt_check = mysqli_prepare($conn, "SELECT id_animal FROM animales WHERE n_microchip = ? AND activo = 1");
        mysqli_stmt_bind_param($stmt_check, "i", $n_microchip);
        mysqli_stmt_execute($stmt_check);
        mysqli_stmt_store_result($stmt_check);
        if (mysqli_stmt_num_rows($stmt_check) > 0) {
            $errores['n_microchip'] = "❗Ya existe un animal activo con el mismo número de microchip.";
        }
        mysqli_stmt_close($stmt_check);
    }

    if ($especie === '') {
        $errores['especie'] = "❗La especie del animal es obligatoria.";
    }

    if ($sexo === '') {
        $errores['sexo'] = "❗El sexo del animal es obligatorio.";
    }
    if ($fecha_nac_estimada === '') {
        $errores['fecha_nac_estimada'] = "❗La fecha de nacimiento estimada es obligatoria.";
    }

    if (strlen($observaciones) > 1000) {
        $errores['observaciones'] = "❗Las observaciones no pueden superar los 1000 caracteres.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn,
        "INSERT INTO animales (n_microchip, nombre, especie, sexo, fecha_nac_estimada, observaciones, id_usuario1)
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    mysqli_stmt_bind_param($stmt, "isssssi",
        $n_microchip,
        $nombre,
        $especie,
        $sexo,
        $fecha_nac_estimada,
        $observaciones,
        $id_usuario
    );

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true, "id_animal" => mysqli_insert_id($conn)], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al registrar el animal."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── PUT: editar animal ─────────────────────────────────────────────────────
if ($method === 'PUT') {
    $id_animal          = intval($body['id_animal']          ?? 0);
    $n_microchip        = trim($body['n_microchip']          ?? '');
    $nombre             = trim($body['nombre']               ?? '');
    $especie            = trim($body['especie']              ?? '');
    $sexo               = trim($body['sexo']                 ?? '');
    $fecha_nac_estimada = trim($body['fecha_nac_estimada']   ?? '');
    $observaciones      = trim($body['observaciones']        ?? '');


    $errores = [];

    if ($nombre === '') {
        $errores['nombre'] = "❗El nombre del animal es obligatorio.";
    } elseif (strlen($nombre) > 150) {
        $errores['nombre'] = "❗El nombre no puede superar los 150 caracteres.";
    }

    if ($especie === '') {
        $errores['especie'] = "❗La especie del animal es obligatoria.";
    }

    if ($n_microchip !== '') {
        $stmt_check = mysqli_prepare($conn, "SELECT id_animal FROM animales WHERE n_microchip = ? AND activo = 1 AND id_animal != ?");
        mysqli_stmt_bind_param($stmt_check, "ii", $n_microchip, $id_animal);
        mysqli_stmt_execute($stmt_check);
        mysqli_stmt_store_result($stmt_check);
        if (mysqli_stmt_num_rows($stmt_check) > 0) {
            $errores['n_microchip'] = "❗Ya existe un animal activo con el mismo número de microchip.";
        }
        mysqli_stmt_close($stmt_check);
    }

    if ($sexo === '') {
        $errores['sexo'] = "❗El sexo del animal es obligatorio.";
    }
    if ($fecha_nac_estimada === '') {
        $errores['fecha_nac_estimada'] = "❗La fecha de nacimiento estimada es obligatoria.";
    }

    if (strlen($observaciones) > 1000) {
        $errores['observaciones'] = "❗Las observaciones no pueden superar los 1000 caracteres.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $stmt = mysqli_prepare($conn,
        "UPDATE animales
         SET nombre = ?, n_microchip = ?, especie = ?, sexo = ?, fecha_nac_estimada = ?, observaciones = ?
         WHERE id_animal = ?"
    );
    mysqli_stmt_bind_param($stmt, "sissssi",
        $nombre,
        $n_microchip,
        $especie,
        $sexo,
        $fecha_nac_estimada,
        $observaciones,
        $id_animal
    );

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗Animal no encontrado."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al actualizar el animal."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── DELETE: desactivar animal ──────────────────────────────────────────────
if ($method === 'DELETE') {
    $id_animal = intval($body['id_animal'] ?? 0);

    if ($id_animal === 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "ID de animal inválido."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn, "UPDATE animales SET activo = 0 WHERE id_animal = ?");
    mysqli_stmt_bind_param($stmt, "i", $id_animal);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗Animal no encontrado."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al desactivar el animal."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── Método no permitido ──────────────────────────────────────────────────────
http_response_code(405);
echo json_encode(["success" => false, "errores" => ["general" => "Método no permitido."]], JSON_UNESCAPED_UNICODE);