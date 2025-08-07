<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return $this->unauthenticatedResponse($request);
        }

        if ($request->user()->role !== 'admin') {
            Log::warning('Unauthorized admin access attempt', [
                'user_id' => $request->user()->id,
                'email' => $request->user()->email,
                'path' => $request->path(),
                'method' => $request->method(),
                'ip' => $request->ip(),
            ]);

            return $this->unauthorizedResponse($request);
        }

        return $next($request);
    }

    private function unauthenticatedResponse(Request $request): Response
    {
        return $request->expectsJson()
            ? response()->json(['message' => 'Unauthenticated. Please log in.'], 401)
            : redirect()->guest(route('login'));
    }

    private function unauthorizedResponse(Request $request): Response
    {
        return $request->expectsJson()
            ? response()->json(['message' => 'Unauthorized. Admins only.'], 403)
            : redirect()->route('home')->with('error', 'Access denied. Admins only.');
    }
}
