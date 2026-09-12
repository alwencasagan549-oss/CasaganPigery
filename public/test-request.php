<?php
declare(strict_types=1);

$log = [];
$log['php_version'] = PHP_VERSION;

try {
    require __DIR__ . '/../vendor/autoload.php';
    $log['autoload'] = 'OK';

    $app = require __DIR__ . '/../bootstrap/app.php';
    $log['bootstrap'] = 'OK';

    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $log['kernel_created'] = 'OK';

    $request = Illuminate\Http\Request::create('/health', 'GET');
    $log['request_created'] = 'OK';

    $app->instance('request', $request);
    $log['request_bound'] = 'OK';

    $response = $kernel->handle($request);
    $log['kernel_handled'] = 'OK';
    $log['response_status'] = $response->getStatusCode();

    $kernel->terminate($request, $response);
    $log['terminated'] = 'OK';

    $log['status'] = 'healthy';
} catch (Throwable $e) {
    $log['status'] = 'error';
    $log['error_class'] = get_class($e);
    $log['error_message'] = $e->getMessage();
    $log['error_file'] = $e->getFile();
    $log['error_line'] = $e->getLine();
    $log['trace'] = array_slice(explode("\n", $e->getTraceAsString()), 0, 30);
}

header('Content-Type: application/json');
echo json_encode($log, JSON_PRETTY_PRINT);
