<?php
declare(strict_types=1);

$log = [];
$log['php_version'] = PHP_VERSION;

try {
    require __DIR__ . '/../vendor/autoload.php';
    $log['autoload'] = 'OK';

    $app = require __DIR__ . '/../bootstrap/app.php';
    $log['bootstrap'] = 'OK';

    $router = $app->make(Illuminate\Routing\Router::class);
    $log['router_created'] = 'OK';

    $request = Illuminate\Http\Request::create('/health', 'GET');
    $log['request_created'] = 'OK';

    $route = $router->findRoute($request);
    $log['route_found'] = $route->uri();

    $response = $route->run();
    $log['response_status'] = $response->getStatusCode();
    $log['response_content_type'] = $response->headers->get('Content-Type');
    $log['status'] = 'healthy';
} catch (\Throwable $e) {
    $log['status'] = 'error';
    $log['error_class'] = get_class($e);
    $log['error_message'] = $e->getMessage();
    $log['error_file'] = $e->getFile();
    $log['error_line'] = $e->getLine();
    $log['trace'] = array_slice(explode("\n", $e->getTraceAsString()), 0, 40);
}

header('Content-Type: application/json');
echo json_encode($log, JSON_PRETTY_PRINT);
