<?php

namespace Luminarix\LaravelWebTinker;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Luminarix\LaravelWebTinker\Commands\LaravelWebTinkerInstallCommand;
use Luminarix\LaravelWebTinker\Controllers\WebTinkerController;
use Luminarix\LaravelWebTinker\OutputModifiers\OutputModifier;

class LaravelWebTinkerServiceProvider extends ServiceProvider
{
    public function boot()
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__ . '/../config/web-tinker.php' => config_path('web-tinker.php'),
            ], 'laravel-web-tinker-config');

            $this->publishes([
                __DIR__ . '/../resources/views' => base_path('resources/views/vendor/web-tinker'),
            ], 'laravel-web-tinker-views');

            $this->publishes([
                __DIR__ . '/../dist' => public_path('vendor/web-tinker'),
            ], 'laravel-web-tinker-assets');
        }

        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'web-tinker');

        $this->app->bind(OutputModifier::class, config('web-tinker.output_modifier'));

        Route::middlewareGroup('web-tinker', config('web-tinker.middleware', []));

        $this
            ->registerRoutes()
            ->registerWebTinkerGate();
    }

    public function register()
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/web-tinker.php', 'web-tinker');

        $this->commands(LaravelWebTinkerInstallCommand::class);
    }

    protected function routeConfiguration()
    {
        return [
            'prefix' => config('web-tinker.path'),
            'middleware' => 'web-tinker',
        ];
    }

    protected function registerRoutes()
    {
        Route::group($this->routeConfiguration(), function () {
            Route::get('/', [WebTinkerController::class, 'index']);
            Route::post('/', [WebTinkerController::class, 'execute']);
        });

        return $this;
    }

    protected function registerWebTinkerGate()
    {
        Gate::define('viewWebTinker', function ($user = null) {
            return app()->environment('local');
        });

        return $this;
    }
}
