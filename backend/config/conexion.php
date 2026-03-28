<?php
require_once "env.php";

// cargar .env solo en local
if (!getenv('APP_ENV')) {
    loadEnv(__DIR__ . "/../../.env.development");
}

$env = env('APP_ENV', 'local');

if ($env === 'aiven') {

    // 🔵 AIVEN
    $host = env('AIVEN_HOST');
    $user = env('AIVEN_USER');
    $password = env('AIVEN_PASS');
    $database = env('AIVEN_NAME');
    $port = env('AIVEN_PORT');

    $ssl_ca = __DIR__ . "/etc/secrets/ca.pem";

    $conn = mysqli_init();

    // solo CA (como viste en la doc)
    mysqli_ssl_set($conn, NULL, NULL, $ssl_ca, NULL, NULL);

    $connected = mysqli_real_connect(
        $conn,
        $host,
        $user,
        $password,
        $database,
        $port,
        NULL,
        MYSQLI_CLIENT_SSL
    );

} else {

    // 🟢 LOCAL (tu código original)
    $host = env('DB_HOST', 'localhost');
    $user = env('DB_USER', 'root');
    $password = env('DB_PASS', '');
    $database = env('DB_NAME', 'proyectoceiba');
    $port = env('DB_PORT', 3306);

    $conn = mysqli_connect($host, $user, $password, $database, $port);
    $connected = $conn ? true : false;
}

// ❌ Manejo de error (igual que el tuyo pero mejorado)
if (!$connected) {
    header("Content-Type: application/json");
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión a la base de datos",
        "env" => $env
    ]);
    exit;
}

// charset recomendado
mysqli_set_charset($conn, "utf8mb4");
?>