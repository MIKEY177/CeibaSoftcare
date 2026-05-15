<?php

require_once '../config/conexion.php';
require_once '../config/session_config.php';

header('Content-Type: application/json');

$notificaciones = [];
if($_SESSION['user_rol'] !== 'veterinario'){
$sql = "
SELECT
    dep.id_detalle_entrada,
    p.nombre,
    dep.fecha_vencimiento
FROM detalles_entradas_pro dep
INNER JOIN productos p
    ON p.id_producto = dep.id_producto1
WHERE dep.fecha_vencimiento BETWEEN CURDATE()
AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
AND dep.notificado = 0
AND dep.activo = 1
";

$result = $conn->query($sql);

while($row = $result->fetch_assoc()){

    $notificaciones[] = [
        'id_detalle_entrada' => $row['id_detalle_entrada'],
        'tipo' => 'vencimiento',
        'mensaje' => "El producto {$row['nombre']} está próximo a vencer. [{$row['fecha_vencimiento']}]",
        'fecha' => $row['fecha_vencimiento']
    ];
}

}



/* STOCK BAJO */

$sqlStock = "
SELECT 
    p.nombre,
    s.cantidad_total_por_unidad
FROM stocks s
INNER JOIN productos p
    ON p.id_producto = s.id_producto1
WHERE s.cantidad_total_por_unidad <= 5
AND p.activo = 1
";

$resultStock = $conn->query($sqlStock);

while($row = $resultStock->fetch_assoc()){

    $notificaciones[] = [
        "tipo" => "stock",
        "mensaje" => $_SESSION['user_rol'] === 'veterinario' ? "Stock bajo de {$row['nombre']} ({$row['cantidad_total_por_unidad']} unidades)." : "El producto {$row['nombre']} tiene un stock bajo ({$row['cantidad_total_por_unidad']} unidades). Por favor, realice una nueva entrada o desactive el producto para evitar problemas de inventario.",
    ];
        }

echo json_encode($notificaciones);