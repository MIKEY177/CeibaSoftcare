<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';

header("Content-Type: application/json");

$isLocal = ($_SERVER['REMOTE_ADDR'] === '127.0.0.1' || $_SERVER['REMOTE_ADDR'] === '::1');

session_set_cookie_params([
    'lifetime' => 3600,
    'path' => '/',
    'domain' => $isLocal ? '' : $_SERVER['HTTP_HOST'],
    'secure' => !$isLocal, // True en Render (HTTPS), False en Local
    'httponly' => true,
    'samesite' =>'Lax' // None es necesario para Cross-Site en Render
]);

session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

$debug  = (getenv('APP_ENV') === 'development' || (isset($_SERVER['APP_ENV']) && $_SERVER['APP_ENV'] === 'development'));
$method = $_SERVER['REQUEST_METHOD'];

// ── GET ?fecha_actual=1 - hora del servidor para pre-llenar el formulario ────
if ($method === 'GET' && isset($_GET['fecha_actual'])) {
    echo json_encode([
        "success"    => true,
        "fecha_hora" => date('Y-m-d\TH:i')
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── GET: listar entradas con sus detalles ────────────────────────────────────
if ($method === 'GET') {

    // GET ?id_entrada=5  - una entrada con todos sus detalles
    if (isset($_GET['id_entrada'])) {
        $id_entrada = intval($_GET['id_entrada']);

        if ($id_entrada === 0) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗ID de entrada inválido."]
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Cabecera de la entrada
        $stmt = mysqli_prepare($conn,
            "SELECT id_entrada, fecha_hora, observaciones
             FROM entradas_productos
             WHERE id_entrada = ? AND activo = 1"
        );
        mysqli_stmt_bind_param($stmt, "i", $id_entrada);
        mysqli_stmt_execute($stmt);
        $res     = mysqli_stmt_get_result($stmt);
        $entrada = mysqli_fetch_assoc($res);
        mysqli_stmt_close($stmt);

        if (!$entrada) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗Entrada no encontrada."]
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Detalles de esa entrada
        $stmt2 = mysqli_prepare($conn,
            "SELECT d.id_detalle_entrada,
                    d.cantidad_presentacion,
                    d.cantidad_total,
                    d.fecha_vencimiento,
                    d.motivo,
                    d.id_producto1,
                    p.nombre AS nombre_producto,
                    p.codigo_barras,
                    p.tipo_medida,
                    p.cantidad_por_unidad
             FROM detalles_entradas_pro d
             INNER JOIN productos p ON p.id_producto = d.id_producto1
             WHERE d.id_entrada1 = ? AND d.activo = 1"
        );
        mysqli_stmt_bind_param($stmt2, "i", $id_entrada);
        mysqli_stmt_execute($stmt2);
        $res2    = mysqli_stmt_get_result($stmt2);
        $detalles = [];
        while ($row = mysqli_fetch_assoc($res2)) {
            $detalles[] = $row;
        }
        mysqli_stmt_close($stmt2);

        $entrada['detalles'] = $detalles;
        echo json_encode(["success" => true, "data" => $entrada], JSON_UNESCAPED_UNICODE);
        mysqli_close($conn);
        exit;
    }

    // GET sin filtro - todas las entradas con sus detalles
    $result = mysqli_query($conn,
        "SELECT id_entrada, fecha_hora, observaciones
         FROM entradas_productos
         WHERE activo = 1
         ORDER BY fecha_hora DESC"
    );

    if (!$result) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error"   => $debug ? mysqli_error($conn) : "❗Error en la consulta"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $entradas = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $entradas[] = $row;
    }
    mysqli_free_result($result);

    // Agregar detalles a cada entrada
    foreach ($entradas as &$entrada) {
        $id = intval($entrada['id_entrada']);
        $stmt = mysqli_prepare($conn,
            "SELECT d.id_detalle_entrada,
                    d.cantidad_presentacion,
                    d.cantidad_total,
                    d.fecha_vencimiento,
                    d.motivo,
                    d.id_producto1,
                    p.nombre           AS nombre_producto,
                    p.codigo_barras,
                    p.tipo_medida,
                    p.cantidad_por_unidad
             FROM detalles_entradas_pro d
             INNER JOIN productos p ON p.id_producto = d.id_producto1
             WHERE d.id_entrada1 = ? AND d.activo = 1"
        );
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        $entrada['detalles'] = [];
        while ($det = mysqli_fetch_assoc($res)) {
            $entrada['detalles'][] = $det;
        }
        mysqli_stmt_close($stmt);
    }
    unset($entrada);

    echo json_encode(["success" => true, "data" => $entradas], JSON_UNESCAPED_UNICODE);
    mysqli_close($conn);
    exit;
}

// ── Leer body JSON ───────────────────────────────────────────────────────────
$body = json_decode(file_get_contents("php://input"), true);

if ($body === null) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "errores" => ["general" => "Body JSON inválido o vacío"]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── Validar sesión ───────────────────────────────────────────────────────────
$id_usuario = $_SESSION['user_id'] ?? null;
session_write_close();
if ($id_usuario === null) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "errores" => ["sesion" => "❗No tienes una sesión activa. Por favor inicia sesión."]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function productoExiste(mysqli $conn, int $id): bool
{
    $s = mysqli_prepare($conn, "SELECT id_producto FROM productos WHERE id_producto = ? AND activo = 1");
    mysqli_stmt_bind_param($s, "i", $id);
    mysqli_stmt_execute($s);
    mysqli_stmt_store_result($s);
    $ok = mysqli_stmt_num_rows($s) > 0;
    mysqli_stmt_close($s);
    return $ok;
}

function validarDetalle(array $d, int $index): array
{
    $errores = [];
    $pre     = "detalles[$index]";

    $id_producto = intval($d['id_producto1'] ?? 0);
    if ($id_producto === 0) {
        $errores["{$pre}.id_producto1"] = "❗El producto es obligatorio.";
    }

    if (!isset($d['cantidad_presentacion']) || $d['cantidad_presentacion'] === '') {
        $errores["{$pre}.cantidad_presentacion"] = "❗La cantidad de presentación es obligatoria.";
    } else {
        $cp = intval($d['cantidad_presentacion']);
        if ($cp <= 0)      $errores["{$pre}.cantidad_presentacion"] = "❗Debe ser mayor a 0.";
        elseif ($cp > 99999) $errores["{$pre}.cantidad_presentacion"] = "❗No puede superar 99,999.";
    }

    $fv = trim($d['fecha_vencimiento'] ?? '');
    if ($fv === '') {
        $errores["{$pre}.fecha_vencimiento"] = "❗La fecha de vencimiento es obligatoria.";
    } else {
        $dt = DateTime::createFromFormat('Y-m-d', $fv);
        if (!$dt || $dt->format('Y-m-d') !== $fv) {
            $errores["{$pre}.fecha_vencimiento"] = "❗Formato inválido, use YYYY-MM-DD.";
        } elseif ($dt <= new DateTime('today')) {
            $errores["{$pre}.fecha_vencimiento"] = "❗Debe ser una fecha futura.";
        }
    }

    $motivo = trim($d['motivo'] ?? '');
    if ($motivo === '') {
        $errores["{$pre}.motivo"] = "❗El motivo es obligatorio.";
    } elseif (strlen($motivo) > 100) {
        $errores["{$pre}.motivo"] = "❗No puede superar los 100 caracteres.";
    }

    return $errores;
}
if ($method === 'POST') {
    $fecha_hora    = trim($body['fecha_hora']    ?? '');
    $observaciones = trim($body['observaciones'] ?? '');
    $detalles      = $body['detalles']           ?? [];
    $errores       = [];

    // — Validar cabecera —
    if ($fecha_hora === '') {
        $errores['fecha_hora'] = "❗La fecha es obligatoria.";
    }
    if (strlen($observaciones) > 100) {
        $errores['observaciones'] = "❗Las observaciones no pueden superar los 100 caracteres.";
    }

    // — Validar que venga al menos un detalle —
    if (!is_array($detalles) || count($detalles) === 0) {
        $errores['detalles'] = "❗Debe incluir al menos un producto en la entrada.";
    }

    // — Validar cada detalle —
    foreach ($detalles as $i => $det) {
        $errDet = validarDetalle($det, $i);
        // Verificar que el producto existe en BD
        if (empty($errDet["detalles[$i].id_producto1"])) {
            $id_prod = intval($det['id_producto1']);
            if (!productoExiste($conn, $id_prod)) {
                $errDet["detalles[$i].id_producto1"] = "❗El producto #$id_prod no existe o está inactivo.";
            }
        }
        $errores = array_merge($errores, $errDet);
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // — Transacción —
    mysqli_begin_transaction($conn);

    try {
        // 1. Insertar entrada
        $stmt = mysqli_prepare($conn,
            "INSERT INTO entradas_productos (fecha_hora, observaciones) VALUES (?, ?)"
        );
        mysqli_stmt_bind_param($stmt, "ss", $fecha_hora, $observaciones);
        if (!mysqli_stmt_execute($stmt)) {
            throw new Exception($debug ? mysqli_stmt_error($stmt) : "❗Error al registrar la entrada.");
        }
        $id_entrada = mysqli_insert_id($conn);
        mysqli_stmt_close($stmt);

        // 2. Insertar cada detalle
        $stmtDet = mysqli_prepare($conn,
            "INSERT INTO detalles_entradas_pro
                (cantidad_presentacion, cantidad_total, fecha_vencimiento, motivo, id_producto1, id_entrada1)
             VALUES (?, ?, ?, ?, ?, ?)"
        );

        foreach ($detalles as $det) {
            $cp    = intval($det['cantidad_presentacion']);
            $ct    = floatval($det['cantidad_total']);
            $fv    = trim($det['fecha_vencimiento']);
            $mot   = trim($det['motivo']);
            $idpro = intval($det['id_producto1']);

            mysqli_stmt_bind_param($stmtDet, "idssii", $cp, $ct, $fv, $mot, $idpro, $id_entrada);
            if (!mysqli_stmt_execute($stmtDet)) {
                throw new Exception($debug ? mysqli_stmt_error($stmtDet) : "❗Error al registrar un detalle.");
            }
        }
        mysqli_stmt_close($stmtDet);

        mysqli_commit($conn);

        echo json_encode([
            "success"    => true,
            "id_entrada" => $id_entrada,
            "detalles_registrados" => count($detalles)
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        mysqli_rollback($conn);
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $e->getMessage()]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_close($conn);
    exit;
}

// ── PUT: editar cabecera de entrada ─────────────────────────────────────────
if ($method === 'PUT') {
    $id_entrada    = intval($body['id_entrada']    ?? 0);
    $fecha_hora    = trim($body['fecha_hora']      ?? '');
    $observaciones = trim($body['observaciones']   ?? '');
    $errores       = [];

    if ($id_entrada === 0)  $errores['id_entrada']    = "ID de entrada inválido.";
    if ($fecha_hora === '')  $errores['fecha_hora']    = "La fecha es obligatoria.";
    if (strlen($observaciones) > 100)
        $errores['observaciones'] = "❗Las observaciones no pueden superar los 100 caracteres.";

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn,
        "UPDATE entradas_productos
         SET fecha_hora = ?, observaciones = ?
         WHERE id_entrada = ? AND activo = 1"
    );
    mysqli_stmt_bind_param($stmt, "ssi", $fecha_hora, $observaciones, $id_entrada);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al actualizar la entrada."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── DELETE: soft delete entrada + sus detalles ───────────────────────────────
if ($method === 'DELETE') {
    $id_entrada = intval($body['id_entrada'] ?? 0);

    if ($id_entrada === 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "❗ID de entrada inválido."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    mysqli_begin_transaction($conn);

    try {
        // Desactivar detalles
        $s1 = mysqli_prepare($conn,
            "UPDATE detalles_entradas_pro SET activo = 0 WHERE id_entrada1 = ?"
        );
        mysqli_stmt_bind_param($s1, "i", $id_entrada);
        if (!mysqli_stmt_execute($s1)) {
            throw new Exception($debug ? mysqli_stmt_error($s1) : "❗Error al desactivar los detalles.");
        }
        mysqli_stmt_close($s1);

        // Desactivar entrada
        $s2 = mysqli_prepare($conn,
            "UPDATE entradas_productos SET activo = 0 WHERE id_entrada = ?"
        );
        mysqli_stmt_bind_param($s2, "i", $id_entrada);
        if (!mysqli_stmt_execute($s2)) {
            throw new Exception($debug ? mysqli_stmt_error($s2) : "❗Error al desactivar la entrada.");
        }

        if (mysqli_stmt_affected_rows($s2) === 0) {
            mysqli_rollback($conn);
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗Entrada no encontrada."]
            ], JSON_UNESCAPED_UNICODE);
            mysqli_stmt_close($s2);
            mysqli_close($conn);
            exit;
        }

        mysqli_stmt_close($s2);
        mysqli_commit($conn);

        echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        mysqli_rollback($conn);
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $e->getMessage()]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_close($conn);
    exit;
}

// ── Método no permitido ──────────────────────────────────────────────────────
http_response_code(405);
echo json_encode([
    "success" => false,
    "errores" => ["general" => "Método no permitido."]
], JSON_UNESCAPED_UNICODE);
