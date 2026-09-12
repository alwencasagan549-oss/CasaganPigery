<?php
declare(strict_types=1);

$log = [];
$log['php_version'] = PHP_VERSION;
$log['memory_usage'] = memory_get_usage(true);
$log['loaded_extensions_count'] = count(get_loaded_extensions());

try {
    require __DIR__ . '/../vendor/autoload.php';
    $log['autoload'] = 'OK';

    $app = require __DIR__ . '/../bootstrap/app.php';
    $log['bootstrap'] = 'OK';

    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $log['kernel'] = 'OK';
    $log['status'] = 'healthy';
} catch (Throwable $e) {
    $log['status'] = 'error';
    $log['error_class'] = get_class($e);
    $log['error_message'] = $e->getMessage();
    $log['error_file'] = $e->getFile();
    $log['error_line'] = $e->getLine();
    $log['trace'] = explode("\n", $e->getTraceAsString());
}

header('Content-Type: application/json');
echo json_encode($log, JSON_PRETTY_PRINT);
