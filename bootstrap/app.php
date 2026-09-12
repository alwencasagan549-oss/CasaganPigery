<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(\App\Http\Middleware\SecureHeaders::class);
        $middleware->append(\App\Http\Middleware\SanitizeInput::class);
    })
    ->withTrustedProxy(
        trustForwardedHeaders: true,
        trustedProxies: ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '127.0.0.1', '::1']
    )
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
