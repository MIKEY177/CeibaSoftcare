<?php
require_once dirname(__DIR__) . '/config/cors.php';
require_once dirname(__DIR__) . '/config/conexion.php';
require_once dirname(__DIR__) . '/config/session_config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error" => "Método no permitido."
    ]);
    exit;
}

$sql = "
SELECT 
    v.id_verificacion,
    v.id_animal1,
    v.fecha,
    a.nombre
FROM verificaciones v

INNER JOIN animales a 
    ON a.id_animal = v.id_animal1

LEFT JOIN ingresos_animales ia
    ON ia.id_verificacion1 = v.id_verificacion
    AND ia.activo = 1

WHERE 
    v.activo = 1
    AND ia.id_ingreso IS NULL
";

$result = mysqli_query($conn, $sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error en la consulta: " . mysqli_error($conn)
    ]);
    exit;
}

$verificaciones = [];

while ($row = mysqli_fetch_assoc($result)) {
    $verificaciones[] = $row;
}

echo json_encode([
    "success" => true,
    "data" => $verificaciones
], JSON_UNESCAPED_UNICODE);

mysqli_free_result($result);
mysqli_close($conn);
exit;
?>