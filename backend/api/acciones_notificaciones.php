<?php

require_once '../config/conexion.php';
require_once '../config/session_config.php';

header('Content-Type: application/json');

$data = json_decode(
    file_get_contents('php://input'),
    true
);

$id_detalle = $data['id_detalle_entrada'];

$opcion = $data['opcion'];

$check_stock = "

SELECT

    dep.id_detalle_entrada,
    p.nombre,
    dep.fecha_vencimiento,
    dep.id_producto1,
    s.cantidad_total_por_unidad

FROM detalles_entradas_pro dep

INNER JOIN productos p
    ON p.id_producto = dep.id_producto1

INNER JOIN stocks s
    ON s.id_producto1 = p.id_producto

WHERE dep.id_detalle_entrada = ?

";

$stmt = mysqli_prepare($conn, $check_stock);
mysqli_stmt_bind_param($stmt, 'i', $id_detalle);
$result = mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$stock_bajo = false;
if($row = mysqli_fetch_assoc($result)){
    if($row['cantidad_total_por_unidad'] <= 5){
        $stock_bajo = true;
    }
}

if ($stock_bajo && $opcion == 1) {

    echo json_encode([
        'data' => $row,
        'success' => false,
        'error' => 'No se puede realizar la salida automática porque el stock del producto es bajo. Por favor, realice una nueva entrada o desactive el producto para evitar problemas de inventario.'

    ]);

    exit;

}


/* SI */
if($opcion == 1){



    $stmt = mysqli_prepare(
        $conn,
        "CALL sp_salida_automatica_vencimiento(?)"
    );

    mysqli_stmt_bind_param(
        $stmt,
        'i',
        $id_detalle
    );

    if(mysqli_stmt_execute($stmt)){

        echo json_encode([

            'success' => true,
            'message' => 'Salida automática creada'

        ]);

    }else{

        echo json_encode([

            'success' => false,
            'error' => mysqli_error($conn)

        ]);
    }

    mysqli_stmt_close($stmt);

}


/* NO */

if($opcion == 2){

    $stmt = mysqli_prepare(

        $conn,

        "UPDATE detalles_entradas_pro
        SET notificado = 1
        WHERE id_detalle_entrada = ?"

    );

    mysqli_stmt_bind_param(

        $stmt,
        'i',
        $id_detalle

    );

    if(mysqli_stmt_execute($stmt)){

        echo json_encode([

            'success' => true,
            'message' => 'Notificación descartada'

        ]);

    }else{

        echo json_encode([

            'success' => false,
            'error' => mysqli_error($conn)

        ]);
    }

    mysqli_stmt_close($stmt);

}