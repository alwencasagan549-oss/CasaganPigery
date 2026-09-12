<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecureHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $appUrl = rtrim((string) config('app.url'), '/');
        $appHost = parse_url($appUrl, PHP_URL_HOST) ?: 'self';
        $appOrigin = "https://{$appHost}";

        // Security Headers
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'no-referrer-when-downgrade');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        $response->headers->set('Content-Security-Policy', "default-src 'self' {$appOrigin}; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net {$appOrigin}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com {$appOrigin}; img-src 'self' data: https: https://*.facebook.com {$appOrigin}; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.facebook.com {$appOrigin}; frame-src 'self' https://*.facebook.com https://*.facebook.net;");

        return $response;
    }
}
