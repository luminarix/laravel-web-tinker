<?php

namespace Luminarix\LaravelWebTinker;

use Luminarix\LaravelWebTinker\Commands\LaravelWebTinkerCommand;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class LaravelWebTinkerServiceProvider extends PackageServiceProvider
{
    public function configurePackage(Package $package): void
    {
        /*
         * This class is a Package Service Provider
         *
         * More info: https://github.com/spatie/laravel-package-tools
         */
        $package
            ->name('laravel-web-tinker')
            ->hasConfigFile()
            ->hasViews()
            ->hasMigration('create_laravel-web-tinker_table')
            ->hasCommand(LaravelWebTinkerCommand::class);
    }
}
