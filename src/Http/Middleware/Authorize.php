<?php

namespace Luminarix\LaravelWebTinker\Http\Middleware;

use Illuminate\Support\Facades\Gate;

class Authorize
{
    public function handle($request, $next)
    {
        abort_unless($this->allowedToUseTinker(), 403);

        return $next($request);
    }

    protected function allowedToUseTinker(): bool
    {
        if (!config('web-tinker.enabled')) {
            return false;
        }

        return Gate::check('viewWebTinker');
    }
}
