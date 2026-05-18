<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . '/config/session_config.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

$json = file_get_contents('php://input');
$body = json_decode($json, true);

$nombre_usuario = $_SESSION['user_name'] ?? 'Usuario Desconocido';

/* ─────────────────────────────── GET ─────────────────────────────── */
if ($method === 'GET') {

    // LISTAR EVENTOS
    if (!isset($_GET['id_evento'])) {

        $id_historia_medica = intval($_GET['id_historia_medica'] ?? 0);

        if ($id_historia_medica <= 0) {

            http_response_code(400);

            echo json_encode([
                "success" => false,
                "error" => "ID inválido"
            ]);

            exit;
        }

        $sql = "SELECT 
                    id_evento,
                    fecha,
                    descripcion,
                    responsable,
                    requiere_producto
                FROM eventos_clinicos
                WHERE id_historia1 = ?
                ORDER BY fecha DESC";

        $stmt = mysqli_prepare($conn, $sql);

        mysqli_stmt_bind_param($stmt, "i", $id_historia_medica);

        mysqli_stmt_execute($stmt);

        $result = mysqli_stmt_get_result($stmt);

        $data = [];

        while ($row = mysqli_fetch_assoc($result)) {

            $row['requiere_producto'] = (int)$row['requiere_producto'];

            $data[] = $row;
        }

        echo json_encode([
            "success" => true,
            "data" => $data
        ]);

        exit;
    }

    $id_evento = intval($_GET['id_evento']);

    $stmt = mysqli_prepare(
        $conn,
        "SELECT * FROM eventos_clinicos WHERE id_evento = ?"
    );

    mysqli_stmt_bind_param($stmt, "i", $id_evento);

    mysqli_stmt_execute($stmt);

    $evento = mysqli_fetch_assoc(mysqli_stmt_get_result($stmt));

    if (!$evento) {

        http_response_code(404);

        echo json_encode([
            "success" => false,
            "error" => "Evento no encontrado"
        ]);

        exit;
    }

    echo json_encode([
        "success" => true,
        "data" => $evento
    ]);

    exit;
}

if ($method !== 'GET' && $body === null) {

    http_response_code(400);

    echo json_encode([
        "success" => false,
        "errores" => [
            "general" => "Body JSON inválido o vacío"
        ]
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$id_usuario = $_SESSION['user_id'] ?? null;

if ($method !== 'GET' && $id_usuario === null) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "errores" => [
            "sesion" => "❗No tienes una sesión activa."
        ]
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


if ($method === 'POST') {

    $id_historia_medica = intval($body['id_historia_medica'] ?? 0);
    $fecha = trim($body['fecha'] ?? '');
    $descripcion = trim($body['descripcion'] ?? '');
    $requiere_producto = intval($body['requiere_producto'] ?? 0);
    $productos = $body['productos'] ?? [];

    $errores = [];
    if ($id_historia_medica <= 0) {
        $errores['historia'] = "❗Historia médica inválida.";
    }

    if ($fecha === '') {
        $errores['fecha'] = "❗La fecha es obligatoria.";
    }

    if ($descripcion === '') {
        $errores['descripcion'] = "❗La descripción es obligatoria.";
    } 
    if ($descripcion !== '' && strlen($descripcion) > 1000) {
        $errores['descripcion'] = "❗La descripción no puede exceder los 1000 caracteres.";
    }

    if ($requiere_producto === 1 && empty($productos)) {
        $errores['productos'] = "❗Debes agregar al menos un producto.";
    }

    if (!empty($errores)) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "errores" => $errores
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    $check = mysqli_prepare(
        $conn,
        "SELECT id_evento
         FROM eventos_clinicos
         WHERE id_historia1 = ?
         AND fecha = ?
         AND descripcion = ?
         LIMIT 1"
    );

    mysqli_stmt_bind_param(
        $check,
        "iss",
        $id_historia_medica,
        $fecha,
        $descripcion
    );

    mysqli_stmt_execute($check);

    if (mysqli_num_rows(mysqli_stmt_get_result($check)) > 0) {

        http_response_code(409);

        echo json_encode([
            "success" => false,
            "error" => "Ya existe un evento igual."
        ]);

        exit;
    }

    mysqli_begin_transaction($conn);

    try {

        $stmt = mysqli_prepare(
            $conn,
            "INSERT INTO eventos_clinicos
            (
                fecha,
                descripcion,
                responsable,
                requiere_producto,
                id_historia1
            )
            VALUES (?, ?, ?, ?, ?)"
        );

        mysqli_stmt_bind_param(
            $stmt,
            "sssii",
            $fecha,
            $descripcion,
            $nombre_usuario,
            $requiere_producto,
            $id_historia_medica
        );

        mysqli_stmt_execute($stmt);

        $id_evento = mysqli_insert_id($conn);

        if ($requiere_producto === 1 && !empty($productos)) {

            $s = mysqli_prepare(
                $conn,
                "SELECT id_salida
                 FROM salidas_productos
                 WHERE id_evento_clinico1 = ?
                 LIMIT 1"
            );

            mysqli_stmt_bind_param($s, "i", $id_evento);

            mysqli_stmt_execute($s);

            $res_s = mysqli_stmt_get_result($s);

            $salida = mysqli_fetch_assoc($res_s);

            if (!$salida) {
                throw new Exception("No se encontró la salida automática.");
            }

            $id_salida = $salida['id_salida'];

            $stmtDet = mysqli_prepare(
                $conn,
                "INSERT INTO detalles_salidas_pro
                (
                    id_salida1,
                    id_producto1,
                    cantidad_presentacion,
                    cantidad_total,
                    motivo
                )
                VALUES (?, ?, ?, ?, ?)"
            );

            foreach ($productos as $p) {

                $id_p = intval($p['id_producto']);
                $c_p = intval($p['cantidad_presentacion']);
                $c_t = floatval($p['cantidad_total']);
                $mot = "Evento: $descripcion";

                mysqli_stmt_bind_param(
                    $stmtDet,
                    "iiids",
                    $id_salida,
                    $id_p,
                    $c_p,
                    $c_t,
                    $mot
                );

                mysqli_stmt_execute($stmtDet);
            }
        }

        mysqli_commit($conn);

        echo json_encode([
            "success" => true,
            "data" => [
                "id_evento" => $id_evento
            ]
        ]);

    } catch (Exception $e) {

        mysqli_rollback($conn);

        http_response_code(500);

        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ]);
    }

    exit;
}

if ($method === 'PUT') {

    $id = intval($body['id_evento'] ?? 0);
    $fecha = trim($body['fecha'] ?? '');
    $descripcion = trim($body['descripcion'] ?? '');
    $requiere = intval($body['requiere_producto'] ?? 0);
    $productos = $body['productos'] ?? [];

    $errores = [];

    if ($id <= 0) {
        $errores['id'] = "❗ID inválido.";
    }

    if ($fecha === '') {
        $errores['fecha'] = "❗La fecha es obligatoria.";
    }

    if ($descripcion === '') {
        $errores['descripcion'] = "❗La descripción es obligatoria.";
    }

    if ($requiere === 1 && empty($productos)) {
        $errores['productos'] = "❗Debes agregar al menos un producto.";
    }

    if (!empty($errores)) {

        http_response_code(400);

        echo json_encode([
            "success" => false,
            "errores" => $errores
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    mysqli_begin_transaction($conn);

    try {
        $stmt = mysqli_prepare(
            $conn,
            "UPDATE eventos_clinicos
             SET fecha = ?,
                 descripcion = ?,
                 responsable = ?,
                 requiere_producto = ?
             WHERE id_evento = ?"
        );

        mysqli_stmt_bind_param(
            $stmt,
            "sssii",
            $fecha,
            $descripcion,
            $nombre_usuario,
            $requiere,
            $id
        );

        mysqli_stmt_execute($stmt);

        $stmtSalida = mysqli_prepare(
            $conn,
            "SELECT id_salida
             FROM salidas_productos
             WHERE id_evento_clinico1 = ?
             LIMIT 1"
        );

        mysqli_stmt_bind_param($stmtSalida, "i", $id);

        mysqli_stmt_execute($stmtSalida);

        $resSalida = mysqli_stmt_get_result($stmtSalida);

        $salida = mysqli_fetch_assoc($resSalida);

        if ($salida) {

            $id_salida = $salida['id_salida'];

            $delete = mysqli_prepare(
                $conn,
                "UPDATE detalles_salidas_pro
                 SET activo = 0
                 WHERE id_salida1 = ?
                 AND activo = 1"
            );

            mysqli_stmt_bind_param($delete, "i", $id_salida);

            mysqli_stmt_execute($delete);

            if ($requiere === 1 && !empty($productos)) {

                $insert = mysqli_prepare(
                    $conn,
                    "INSERT INTO detalles_salidas_pro
                    (
                        id_salida1,
                        id_producto1,
                        cantidad_presentacion,
                        cantidad_total,
                        motivo
                    )
                    VALUES (?, ?, ?, ?, ?)"
                );

                foreach ($productos as $p) {

                    $id_producto = intval($p['id_producto']);
                    $cantidad_presentacion = intval($p['cantidad_presentacion']);
                    $cantidad_total = floatval($p['cantidad_total']);
                    $motivo = "Evento: $descripcion";

                    mysqli_stmt_bind_param(
                        $insert,
                        "iiids",
                        $id_salida,
                        $id_producto,
                        $cantidad_presentacion,
                        $cantidad_total,
                        $motivo
                    );

                    mysqli_stmt_execute($insert);
                }
            }
        }

        mysqli_commit($conn);

        echo json_encode([
            "success" => true,
            "mensaje" => "Actualizado correctamente"
        ]);

    } catch (Exception $e) {

        mysqli_rollback($conn);

        http_response_code(500);

        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ]);
    }

    exit;
}

/* ───────────────────────── MÉTODO INVÁLIDO ───────────────────────── */

http_response_code(405);

echo json_encode([
    "success" => false,
    "error" => "Método no permitido"
]);