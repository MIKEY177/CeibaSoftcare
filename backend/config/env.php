<?php
function env($key, $default = null) {
    $value = getenv($key);
    if ($value !== false) return $value;
    if (isset($_ENV[$key])) return $_ENV[$key];
    return $default;
}

function loadEnv($path) {
    if (!file_exists($path)) return;

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);

        putenv("$key=$value");  // ✅ este es el cambio clave
        $_ENV[$key] = $value;
    }
}