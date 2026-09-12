<?php
declare(strict_types=1);

$results = [];

$results['php_version'] = PHP_VERSION;
$results['loaded_extensions'] = array_values(get_loaded_extensions());

$tests = [
    'mbstring_loaded' => extension_loaded('mbstring'),
    'mb_split_exists' => function_exists('mb_split'),
    'mb_strlen_exists' => function_exists('mb_strlen'),
    'pdo_pgsql_exists' => extension_loaded('pdo_pgsql'),
    'pdo_mysql_exists' => extension_loaded('pdo_mysql'),
    'gd_exists' => extension_loaded('gd'),
    'zip_exists' => extension_loaded('zip'),
];

foreach ($tests as $name => $value) {
    $results[$name] = $value ? 'YES' : 'NO';
}

header('Content-Type: application/json');
echo json_encode($results, JSON_PRETTY_PRINT);
