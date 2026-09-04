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

        // Security Headers
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'no-referrer-when-downgrade');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        $response->headers->set('Content-Security-Policy', "default-src 'self' https://casagan.free.je; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net https://casagan.free.je; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://casagan.free.je; img-src 'self' data: https: https://*.facebook.com https://casagan.free.je; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.facebook.com https://casagan.free.je; frame-src 'self' https://*.facebook.com https://*.facebook.net;");

        return $response;
    }
}
