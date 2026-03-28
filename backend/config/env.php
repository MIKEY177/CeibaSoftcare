<?php
function env($key, $default = null) {
    // primero intenta variables del sistema (Render)
    $value = getenv($key);

    if ($value !== false) {
        return $value;
    }

    // fallback a $_ENV
    if (isset($_ENV[$key])) {
        return $_ENV[$key];
    }

    return $default;
}

// opcional: cargar .env solo en local
function loadEnv($path) {
    if (!file_exists($path)) return;

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;

        list($key, $value) = explode('=', $line, 2);

        $_ENV[trim($key)] = trim($value);
    }
}