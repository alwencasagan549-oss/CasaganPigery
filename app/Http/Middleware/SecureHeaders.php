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
        $response->headers->set('Content-Security-Policy', "default-src 'self' http://casaganpigery.ct.ws https://casaganpigery.ct.ws; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net http://casaganpigery.ct.ws https://casaganpigery.ct.ws; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com http://casaganpigery.ct.ws https://casaganpigery.ct.ws; img-src 'self' data: https: https://*.facebook.com http://casaganpigery.ct.ws https://casaganpigery.ct.ws; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.facebook.com http://casaganpigery.ct.ws https://casaganpigery.ct.ws; frame-src 'self' https://*.facebook.com https://*.facebook.net;");

        return $response;
    }
}
