<?php

namespace Luminarix\LaravelWebTinker\Tests;

use Illuminate\Database\Eloquent\Factories\Factory;
use Luminarix\LaravelWebTinker\LaravelWebTinkerServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;

class TestCase extends Orchestra
{
    protected function setUp(): void
    {
        parent::setUp();

        Factory::guessFactoryNamesUsing(
            fn (string $modelName) => 'Luminarix\\LaravelWebTinker\\Database\\Factories\\' . class_basename($modelName) . 'Factory'
        );
    }

    protected function getPackageProviders($app)
    {
        return [
            LaravelWebTinkerServiceProvider::class,
        ];
    }
}
