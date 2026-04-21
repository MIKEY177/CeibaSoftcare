<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . '/config/session_config.php';

header('Content-Type: application/json');

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


if ($method === 'GET') {

    
    if (isset($_GET['id_salida'])) {
        $id_salida = intval($_GET['id_salida']);

        if ($id_salida === 0) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗ID de salida inválido."]
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Cabecera de la salida
        $stmt = mysqli_prepare($conn,
            "SELECT id_salida, fecha_hora, observaciones
             FROM salidas_productos
             WHERE id_salida = ? AND activo = 1"
        );
        mysqli_stmt_bind_param($stmt, "i", $id_salida);
        mysqli_stmt_execute($stmt);
        $res     = mysqli_stmt_get_result($stmt);
        $salida = mysqli_fetch_assoc($res);
        mysqli_stmt_close($stmt);

        if (!$salida) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗Salida no encontrada."]
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Detalles de esa salida
        $stmt2 = mysqli_prepare($conn,
            "SELECT d.id_detalle_salida,
                    d.cantidad_presentacion,
                    d.cantidad_total,
                    d.motivo,
                    d.id_producto1,
                    p.nombre AS nombre_producto,
                    p.codigo_barras,
                    p.tipo_medida,
                    p.cantidad_por_unidad,
                    s.cantidad_actual
             FROM detalles_salidas_pro d
             INNER JOIN productos p ON p.id_producto = d.id_producto1
             LEFT JOIN stocks s ON s.id_producto1 = d.id_producto1
             WHERE d.id_salida1 = ? AND d.activo = 1"
        );
        mysqli_stmt_bind_param($stmt2, "i", $id_salida);
        mysqli_stmt_execute($stmt2);
        $res2    = mysqli_stmt_get_result($stmt2);
        $detalles = [];
        while ($row = mysqli_fetch_assoc($res2)) {
            $detalles[] = $row;
        }
        mysqli_stmt_close($stmt2);

        $salida['detalles'] = $detalles;
        echo json_encode(["success" => true, "data" => $salida], JSON_UNESCAPED_UNICODE);
        mysqli_close($conn);
        exit;
    }

    // GET sin filtro - todas las salidas con sus detalles
    $result = mysqli_query($conn,
        "SELECT id_salida, fecha_hora, observaciones
         FROM salidas_productos
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

    $salidas = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $salidas[] = $row;
    }
    mysqli_free_result($result);

    // Agregar detalles a cada salida
    foreach ($salidas as &$salida) {
        $id = intval($salida['id_salida']);
        $stmt = mysqli_prepare($conn,
            "SELECT d.id_detalle_salida,
                    d.cantidad_presentacion,
                    d.cantidad_total,
                    d.motivo,
                    d.id_producto1,
                    p.nombre           AS nombre_producto,
                    p.codigo_barras,
                    p.tipo_medida,
                    p.cantidad_por_unidad,
                    s.cantidad_actual
             FROM detalles_salidas_pro d
             INNER JOIN productos p ON p.id_producto = d.id_producto1
             LEFT JOIN stocks s ON s.id_producto1 = d.id_producto1
             WHERE d.id_salida1 = ? AND d.activo = 1"
        );
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        $salida['detalles'] = [];
        while ($det = mysqli_fetch_assoc($res)) {
            $salida['detalles'][] = $det;
        }
        mysqli_stmt_close($stmt);
    }

    echo json_encode(["success" => true, "data" => $salidas], JSON_UNESCAPED_UNICODE);
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

    $stock = 'SELECT cantidad_actual FROM stocks WHERE id_producto1 = ?';
    $s = mysqli_prepare($GLOBALS['conn'], $stock);
    mysqli_stmt_bind_param($s, "i", $id_producto);
    mysqli_stmt_execute($s);
    mysqli_stmt_store_result($s);
    if (mysqli_stmt_num_rows($s) === 0) {
        $errores["{$pre}.id_producto1"] = "❗El producto no tiene stock registrado.";
    } else {
        mysqli_stmt_bind_result($s, $cantidad_actual);
        mysqli_stmt_fetch($s);
        if (isset($d['cantidad_total']) && floatval($d['cantidad_total']) > $cantidad_actual) {
            $errores["{$pre}.cantidad_total"] = "❗No hay suficiente stock. Disponible: $cantidad_actual.";
        }
    }

    if (!isset($d['cantidad_presentacion']) || $d['cantidad_presentacion'] === '') {
        $errores["{$pre}.cantidad_presentacion"] = "❗La cantidad de presentación es obligatoria.";
    } else {
        $cp = intval($d['cantidad_presentacion']);
        if ($cp <= 0)      $errores["{$pre}.cantidad_presentacion"] = "❗Debe ser mayor a 0.";
        elseif ($cp > 99999) $errores["{$pre}.cantidad_presentacion"] = "❗No puede superar 99,999.";
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
        $errores['detalles'] = "❗Debe incluir al menos un producto en la salida.";
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
        // 1. Insertar salida
        $stmt = mysqli_prepare($conn,
            "INSERT INTO salidas_productos (fecha_hora, observaciones) VALUES (?, ?)"
        );
        mysqli_stmt_bind_param($stmt, "ss", $fecha_hora, $observaciones);
        if (!mysqli_stmt_execute($stmt)) {
            throw new Exception($debug ? mysqli_stmt_error($stmt) : "❗Error al registrar la salida.");
        }
        $id_salida = mysqli_insert_id($conn);
        mysqli_stmt_close($stmt);

        // 2. Insertar cada detalle
        $stmtDet = mysqli_prepare($conn,
            "INSERT INTO detalles_salidas_pro
                (cantidad_presentacion, cantidad_total, motivo, id_producto1, id_salida1)
             VALUES (?, ?, ?, ?, ?)"
        );

        foreach ($detalles as $det) {
            $cp    = intval($det['cantidad_presentacion']);
            $ct    = floatval($det['cantidad_total']);
            $mot   = trim($det['motivo']);
            $idpro = intval($det['id_producto1']);

            mysqli_stmt_bind_param($stmtDet, "idsii", $cp, $ct, $mot, $idpro, $id_salida);
            if (!mysqli_stmt_execute($stmtDet)) {
                throw new Exception($debug ? mysqli_stmt_error($stmtDet) : "❗Error al registrar un detalle.");
            }
        }
        mysqli_stmt_close($stmtDet);

        mysqli_commit($conn);

        echo json_encode([
            "success"    => true,
            "id_salida" => $id_salida,
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

// ── PUT: editar cabecera de salida ─────────────────────────────────────────
if ($method === 'PUT') {
    $id_salida    = intval($body['id_salida']    ?? 0);
    $fecha_hora    = trim($body['fecha_hora']      ?? '');
    $observaciones = trim($body['observaciones']   ?? '');
    $errores       = [];

    if ($id_salida === 0)  $errores['id_salida']    = "ID de salida inválido.";
    if ($fecha_hora === '')  $errores['fecha_hora']    = "La fecha es obligatoria.";
    if (strlen($observaciones) > 100)
        $errores['observaciones'] = "❗Las observaciones no pueden superar los 100 caracteres.";

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn,
        "UPDATE salidas_productos
         SET fecha_hora = ?, observaciones = ?
         WHERE id_salida = ? AND activo = 1"
    );
    mysqli_stmt_bind_param($stmt, "ssi", $fecha_hora, $observaciones, $id_salida);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al actualizar la salida."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── DELETE: soft delete salida + sus detalles ───────────────────────────────
if ($method === 'DELETE') {
    $id_salida = intval($body['id_salida'] ?? 0);

    if ($id_salida === 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "❗ID de salida inválido."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    mysqli_begin_transaction($conn);

    try {
        // Desactivar detalles
        $s1 = mysqli_prepare($conn,
            "UPDATE detalles_salidas_pro SET activo = 0 WHERE id_salida1 = ?"
        );
        mysqli_stmt_bind_param($s1, "i", $id_salida);
        if (!mysqli_stmt_execute($s1)) {
            throw new Exception($debug ? mysqli_stmt_error($s1) : "❗Error al desactivar los detalles.");
        }
        mysqli_stmt_close($s1);

        // Desactivar salida
        $s2 = mysqli_prepare($conn,
            "UPDATE salidas_productos SET activo = 0 WHERE id_salida = ?"
        );
        mysqli_stmt_bind_param($s2, "i", $id_salida);
        if (!mysqli_stmt_execute($s2)) {
            throw new Exception($debug ? mysqli_stmt_error($s2) : "❗Error al desactivar la salida.");
        }

        if (mysqli_stmt_affected_rows($s2) === 0) {
            mysqli_rollback($conn);
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗Salida no encontrada."]
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
