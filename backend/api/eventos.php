<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . '/config/session_config.php';

header("Content-Type: application/json");

$debug = true;

$method = $_SERVER['REQUEST_METHOD'];

// ── GET: listar eventos ────────────────────────────────────────────────────
if ($method === 'GET') {
    $sql = "SELECT e.id_evento, e.nombre, e.descripcion, e.fecha_hora, e.lugar, e.requiere_producto
FROM eventos e
WHERE e.activo = 1";

    $result = mysqli_query($conn, $sql);

    if (!$result) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error"   => $debug ? mysqli_error($conn) : "❗Error en la consulta"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $eventos = [];
    while ($row = mysqli_fetch_assoc($result)) {
    $row["requiere_producto"] = (int)$row["requiere_producto"];
    $eventos[] = $row;
}

    echo json_encode(["success" => true, "data" => $eventos], JSON_UNESCAPED_UNICODE);
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

// ── POST: registrar evento ─────────────────────────────────────────────────
// ── POST: registrar evento ─────────────────────────────────────────────────
if ($method === 'POST') {
    $nombre            = trim($body['nombre'] ?? '');
    $descripcion       = trim($body['descripcion'] ?? '');
    $fecha_hora        = trim($body['fecha_hora'] ?? '');
    $lugar             = trim($body['lugar'] ?? '');
    $requiere_producto = isset($body['requiere_producto']) ? intval($body['requiere_producto']) : 0;
    $productos         = $body['productos'] ?? [];

    $errores = [];

    if ($nombre === '') {
        $errores['nombre'] = "❗El nombre del evento es obligatorio.";
    } elseif (strlen($nombre) > 100) {
        $errores['nombre'] = "❗El nombre no puede superar los 100 caracteres.";
    }

    if (strlen($descripcion) > 100) {
        $errores['descripcion'] = "❗La descripción no puede superar los 100 caracteres.";
    }

    if ($fecha_hora === '') {
        $errores['fecha_hora'] = "❗La fecha y hora son obligatorias.";
    } else {
        try {
            $dt = new DateTime($fecha_hora);
            if ($dt <= new DateTime()) {
                $errores['fecha_hora'] = "❗Debe ser una fecha futura.";
            }
        } catch (Exception $e) {
            $errores['fecha_hora'] = "❗Formato inválido.";
        }
    }

    if ($lugar === '') {
        $errores['lugar'] = "❗El lugar es obligatorio.";
    } elseif (strlen($lugar) > 100) {
        $errores['lugar'] = "❗El lugar no puede superar los 100 caracteres.";
    }

    if ($requiere_producto === 1 && empty($productos)) {
        $errores['general'] = "❗Debes agregar al menos un producto.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // ── Iniciar transacción ──────────────────────────────────────────────
    mysqli_begin_transaction($conn);

    try {
        // 1. Insertar evento
        $stmt = mysqli_prepare($conn,
            "INSERT INTO eventos (nombre, descripcion, fecha_hora, lugar, requiere_producto)
             VALUES (?, ?, ?, ?, ?)"
        );
        mysqli_stmt_bind_param($stmt, "ssssi",
            $nombre, $descripcion, $fecha_hora, $lugar, $requiere_producto
        );
        mysqli_stmt_execute($stmt);
        $id_evento = mysqli_insert_id($conn);
        mysqli_stmt_close($stmt);

// 2. Si requiere producto → solo insertar detalles (la salida la crea el trigger)
if ($requiere_producto === 1 && !empty($productos)) {

    // Obtener el id_salida que creó el trigger
    $s = mysqli_prepare($conn,
        "SELECT id_salida FROM salidas_productos WHERE id_evento1 = ? ORDER BY id_salida DESC LIMIT 1"
    );
    mysqli_stmt_bind_param($s, "i", $id_evento);
    mysqli_stmt_execute($s);
    $res_salida = mysqli_stmt_get_result($s);
    $salida     = mysqli_fetch_assoc($res_salida);
    mysqli_stmt_close($s);

    if (!$salida) {
        throw new Exception("❗No se encontró la salida generada para el evento.");
    }

    $id_salida = $salida['id_salida'];

    // Insertar detalles
    $stmt = mysqli_prepare($conn,
        "INSERT INTO detalles_salidas_pro
            (id_salida1, id_producto1, cantidad_presentacion, cantidad_total, motivo)
         VALUES (?, ?, ?, ?, ?)"
    );

    foreach ($productos as $p) {
        $id_producto           = intval($p['id_producto']);
        $cantidad_presentacion = intval($p['cantidad_presentacion']);
        $cantidad_total        = floatval($p['cantidad_total']);
        $motivo                = "Evento: $nombre";

        mysqli_stmt_bind_param($stmt, "iiids",
            $id_salida, $id_producto, $cantidad_presentacion, $cantidad_total, $motivo
        );
        mysqli_stmt_execute($stmt);
    }

    mysqli_stmt_close($stmt);
}

if (!empty($errores)) {
    http_response_code(422);
    echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
    exit;
}

        mysqli_commit($conn);

        echo json_encode([
            "success"  => true,
            "data" => [
                "id_evento"         => $id_evento,
                "nombre"            => $nombre,
                "descripcion"       => $descripcion,
                "fecha_hora"        => $fecha_hora,
                "lugar"             => $lugar,
                "requiere_producto" => $requiere_producto
            ]
        ], JSON_UNESCAPED_UNICODE);

    } catch (Exception $e) {
        mysqli_rollback($conn);
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? $e->getMessage() : "❗Error al registrar el evento."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_close($conn);
    exit;
}

// ── PUT: editar evento ─────────────────────────────────────────────────────
// ── PUT: editar evento ─────────────────────────────────────────────────────
if ($method === 'PUT') {
    $id_evento         = intval($body['id_evento'] ?? 0);
    $nombre            = trim($body['nombre'] ?? '');
    $descripcion       = trim($body['descripcion'] ?? '');
    $fecha_hora        = trim($body['fecha_hora'] ?? '');
    $lugar             = trim($body['lugar'] ?? '');
    $requiere_producto = isset($body['requiere_producto']) ? intval($body['requiere_producto']) : 0;
    $productos         = $body['productos'] ?? [];

    $errores = [];

    if ($nombre === '') {
        $errores['nombre'] = "❗El nombre es obligatorio.";
    } elseif (strlen($nombre) > 100) {
        $errores['nombre'] = "❗El nombre no puede superar los 100 caracteres.";
    }

    if ($fecha_hora === '') {
        $errores['fecha_hora'] = "❗La fecha y hora son obligatorias.";
    } else {
        try {
            $dt = new DateTime($fecha_hora);
            if ($dt <= new DateTime()) {
                $errores['fecha_hora'] = "❗Debe ser una fecha futura.";
            }
        } catch (Exception $e) {
            $errores['fecha_hora'] = "❗Formato inválido.";
        }
    }

    if (strlen($descripcion) > 100) {
        $errores['descripcion'] = "❗La descripción no puede superar los 100 caracteres.";
    }

    if ($lugar === '') {
        $errores['lugar'] = "❗El lugar es obligatorio.";
    } elseif (strlen($lugar) > 100) {
        $errores['lugar'] = "❗El lugar no puede superar los 100 caracteres.";
    }

    if ($requiere_producto === 1 && empty($productos)) {
        $errores['general'] = "❗Debes agregar al menos un producto.";
    }

    if (!empty($errores)) {
        http_response_code(422);
        echo json_encode(["success" => false, "errores" => $errores], JSON_UNESCAPED_UNICODE);
        exit;
    }

    mysqli_begin_transaction($conn);
    try {
        // 1. Actualizar evento
        $stmt = mysqli_prepare($conn,
            "UPDATE eventos SET nombre=?, descripcion=?, fecha_hora=?, lugar=?, requiere_producto=?
             WHERE id_evento=?"
        );
        mysqli_stmt_bind_param($stmt, "ssssii",
            $nombre, $descripcion, $fecha_hora, $lugar, $requiere_producto, $id_evento
        );
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);

        // 2. Si cambia a no requiere producto → desactivar salida
      if ($requiere_producto === 0) {
    $s = mysqli_prepare($conn,
        "SELECT id_salida FROM salidas_productos WHERE id_evento1 = ? ORDER BY id_salida DESC LIMIT 1"
    );
    mysqli_stmt_bind_param($s, "i", $id_evento);
    
    if (!mysqli_stmt_execute($s)) {
        throw new Exception("Error SELECT salida: " . mysqli_stmt_error($s));
    }
    
    $res_salida = mysqli_stmt_get_result($s);
    $salida = mysqli_fetch_assoc($res_salida);
    mysqli_stmt_close($s);

    if ($salida) {
        $del_det = mysqli_prepare($conn,
            "UPDATE detalles_salidas_pro SET activo = 0 WHERE id_salida1 = ?"
        );
        mysqli_stmt_bind_param($del_det, "i", $salida['id_salida']);
        
        if (!mysqli_stmt_execute($del_det)) {
            throw new Exception("Error UPDATE detalles: " . mysqli_stmt_error($del_det));
        }
        
        mysqli_stmt_close($del_det);
    }
}

        // 3. Si requiere producto → reemplazar detalles
        if ($requiere_producto === 1 && !empty($productos)) {
            $s = mysqli_prepare($conn,
                "SELECT id_salida FROM salidas_productos WHERE id_evento1 = ? AND activo = 1 ORDER BY id_salida DESC LIMIT 1"
            );
            mysqli_stmt_bind_param($s, "i", $id_evento);
            mysqli_stmt_execute($s);
            $res_salida = mysqli_stmt_get_result($s);
            $salida = mysqli_fetch_assoc($res_salida);
            mysqli_stmt_close($s);

            if (!$salida) {
                $ins = mysqli_prepare($conn,
                    "INSERT INTO salidas_productos (id_evento1) VALUES (?)"
                );
                mysqli_stmt_bind_param($ins, "i", $id_evento);
                mysqli_stmt_execute($ins);
                $id_salida = mysqli_insert_id($conn);
                mysqli_stmt_close($ins);
            } else {
                $id_salida = $salida['id_salida'];
            }

            $del = mysqli_prepare($conn,
    "UPDATE detalles_salidas_pro SET activo = 0 WHERE id_salida1 = ?"
);
mysqli_stmt_bind_param($del, "i", $id_salida);
mysqli_stmt_execute($del);
mysqli_stmt_close($del);

            $stmt = mysqli_prepare($conn,
                "INSERT INTO detalles_salidas_pro
                    (id_salida1, id_producto1, cantidad_presentacion, cantidad_total, motivo)
                 VALUES (?, ?, ?, ?, ?)"
            );
            foreach ($productos as $p) {
                $id_producto           = intval($p['id_producto']);
                $cantidad_presentacion = intval($p['cantidad_presentacion']);
                $cantidad_total        = floatval($p['cantidad_total']);
                $motivo                = "Evento: $nombre";
                mysqli_stmt_bind_param($stmt, "iiids",
                    $id_salida, $id_producto, $cantidad_presentacion, $cantidad_total, $motivo
                );
                mysqli_stmt_execute($stmt);
            }
            mysqli_stmt_close($stmt);
        }

        mysqli_commit($conn);
        echo json_encode(["success" => true, "mensaje" => "Evento actualizado correctamente."], JSON_UNESCAPED_UNICODE);

   } catch (Exception $e) {
    mysqli_rollback($conn);
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "errores" => ["general" => $e->getMessage() . " | Línea: " . $e->getLine()]
    ], JSON_UNESCAPED_UNICODE);
}

    mysqli_close($conn);
    exit;
}
// ── DELETE: desactivar evento ──────────────────────────────────────────────
if ($method === 'DELETE') {
    $id_evento = intval($body['id_evento'] ?? 0);

    if ($id_evento === 0) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => "ID de evento inválido."]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = mysqli_prepare($conn, "UPDATE eventos SET activo = 0 WHERE id_evento = ?");
    mysqli_stmt_bind_param($stmt, "i", $id_evento);

    if (mysqli_stmt_execute($stmt)) {
        if (mysqli_stmt_affected_rows($stmt) === 0) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "errores" => ["general" => "❗Evento no encontrado."]
            ], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => true], JSON_UNESCAPED_UNICODE);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "errores" => ["general" => $debug ? mysqli_stmt_error($stmt) : "❗Error al desactivar el evento."]
        ], JSON_UNESCAPED_UNICODE);
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);
    exit;
}

// ── Método no permitido ──────────────────────────────────────────────────────
http_response_code(405);
echo json_encode(["success" => false, "errores" => ["general" => "Método no permitido."]], JSON_UNESCAPED_UNICODE);
