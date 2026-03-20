<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/conexion.php';
 
header("Content-Type: application/json");
 
session_set_cookie_params([
    'lifetime' => 3600,
    'path'     => '/',
    'domain'   => '',
    'secure'   => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
 
session_start();

$id_usuario = $_SESSION['user_id'] ?? null;
session_write_close(); // 👈 libera el bloqueo inmediatamente
error_reporting(E_ALL);
ini_set('display_errors', 1);
 
$debug  = (getenv('APP_ENV') === 'development' ||
           (isset($_SERVER['APP_ENV']) && $_SERVER['APP_ENV'] === 'development'));
$method = $_SERVER['REQUEST_METHOD'];
 
// ── GET: listar detalles de una entrada ──────────────────────────────────────
if ($method === 'GET') {
    $id_entrada = intval($_GET['id_entrada'] ?? 0);
 
    if ($id_entrada === 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "Se requiere id_entrada."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
 
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
         WHERE d.id_entrada1 = ? AND d.activo = 1
         ORDER BY d.id_detalle_entrada ASC"
    );
    mysqli_stmt_bind_param($stmt, "i", $id_entrada);
    mysqli_stmt_execute($stmt);
    $res      = mysqli_stmt_get_result($stmt);
    $detalles = [];
    while ($row = mysqli_fetch_assoc($res)) {
        $detalles[] = $row;
    }
    mysqli_stmt_close($stmt);
 
    echo json_encode(["success" => true, "data" => $detalles], JSON_UNESCAPED_UNICODE);
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
 
if ($id_usuario === null) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "errores" => ["sesion" => "No tienes una sesión activa. Por favor inicia sesión."]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
 

// ── Función: verificar que el producto existe y está activo ──────────────────
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
 if ($method === 'POST') {
    $id_entrada1           = intval($body['id_entrada1'] ?? 0);
    $id_producto1          = intval($body['id_producto1'] ?? 0);
    $cantidad_presentacion = intval($body['cantidad_presentacion'] ?? 0);
    $cantidad_total        = floatval($body['cantidad_total'] ?? 0);
    $fecha_vencimiento     = trim($body['fecha_vencimiento'] ?? '');
    $motivo                = trim($body['motivo'] ?? '');

    $stmt = mysqli_prepare($conn,
        "INSERT INTO detalles_entradas_pro
            (id_entrada1, id_producto1, cantidad_presentacion, cantidad_total, fecha_vencimiento, motivo)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    mysqli_stmt_bind_param($stmt, "iiidss",
        $id_entrada1, $id_producto1, $cantidad_presentacion,
        $cantidad_total, $fecha_vencimiento, $motivo
    );

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "errores" => ["general" => mysqli_stmt_error($stmt)]], JSON_UNESCAPED_UNICODE);
    }
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}
// ── PUT: editar detalle ──────────────────────────────────────────────────────
if ($method === 'PUT') {
    $id_detalle            = intval($body['id_detalle_entrada']   ?? 0);
    $id_producto           = intval($body['id_producto1']          ?? 0);
    $cantidad_presentacion = $body['cantidad_presentacion']        ?? '';
    $cantidad_total        = $body['cantidad_total']               ?? '';
    $fecha_vencimiento     = trim($body['fecha_vencimiento']       ?? '');
    $motivo                = trim($body['motivo']                  ?? '');
    $errores               = [];
 
    if ($id_detalle === 0)
        $errores['id_detalle_entrada'] = "ID de detalle inválido.";
 
    if ($id_producto === 0) {
        $errores['id_producto1'] = "El producto es obligatorio.";
    } elseif (!productoExiste($conn, $id_producto)) {
        $errores['id_producto1'] = "El producto no existe o está inactivo.";
    }
 
    if ($cantidad_presentacion === '' || intval($cantidad_presentacion) <= 0)
        $errores['cantidad_presentacion'] = "La cantidad de presentación debe ser mayor a 0.";
    elseif (intval($cantidad_presentacion) > 99999)
        $errores['cantidad_presentacion'] = "No puede superar 99,999.";
 
    if ($cantidad_total === '' || floatval($cantidad_total) <= 0)
        $errores['cantidad_total'] = "La cantidad total debe ser mayor a 0.";
    elseif (floatval($cantidad_total) > 99999999.99)
        $errores['cantidad_total'] = "Excede el límite permitido.";
 
    if ($fecha_vencimiento === '') {
        $errores['fecha_vencimiento'] = "La fecha de vencimiento es obligatoria.";
    } else {
        $dt = DateTime::createFromFormat('Y-m-d', $fecha_vencimiento);
        if (!$dt || $dt->format('Y-m-d') !== $fecha_vencimiento)
            $errores['fecha_vencimiento'] = "Formato inválido, use YYYY-MM-DD.";
        elseif ($dt <= new DateTime('today'))
            $errores['fecha_vencimiento'] = "Debe ser una fecha futura.";
    }
 
    if ($motivo === '')
        $errores['motivo'] = "El motivo es obligatorio.";
    elseif (strlen($motivo) > 100)
        $errores['motivo'] = "No puede superar los 100 caracteres.";
 
    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }
 
    $cp = intval($cantidad_presentacion);
    $ct = floatval($cantidad_total);
 
    $stmt = mysqli_prepare($conn,
        "UPDATE detalles_entradas_pro
         SET id_producto1          = ?,
             cantidad_presentacion = ?,
             cantidad_total        = ?,
             fecha_vencimiento     = ?,
             motivo                = ?
         WHERE id_detalle_entrada = ? AND activo = 1"
    );
    mysqli_stmt_bind_param($stmt, "iidssi",
        $id_producto, $cp, $ct, $fecha_vencimiento, $motivo, $id_detalle
    );
 
    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "Detalle no encontrado."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "Error al actualizar el detalle."]
        ], JSON_UNESCAPED_UNICODE);
    }
 
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}
 
// ── DELETE: desactivar detalle (soft delete) ─────────────────────────────────
if ($method === 'DELETE') {
    $id_detalle = intval($body['id_detalle_entrada'] ?? 0);
 
    if ($id_detalle === 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "ID de detalle inválido."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
 
    $stmt = mysqli_prepare($conn,
        "UPDATE detalles_entradas_pro SET activo = 0 WHERE id_detalle_entrada = ?"
    );
    mysqli_stmt_bind_param($stmt, "i", $id_detalle);
 
    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "Detalle no encontrado."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "Error al desactivar el detalle."]
        ], JSON_UNESCAPED_UNICODE);
    }
 
    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

 
// ── Método no permitido ──────────────────────────────────────────────────────
http_response_code(405);
echo json_encode([
    "success" => false,
    "errores" => ["general" => "Método no permitido."]
], JSON_UNESCAPED_UNICODE);