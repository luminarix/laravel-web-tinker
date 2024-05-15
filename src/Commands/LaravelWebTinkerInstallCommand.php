<?php

namespace Luminarix\LaravelWebTinker\Commands;

use Illuminate\Console\Command;

class LaravelWebTinkerInstallCommand extends Command
{
    public $signature = 'laravel-web-tinker:install';

    public $description = 'Install the Laravel Web Tinker resources';

    public function handle()
    {
        $this->comment('Publishing Laravel Web Tinker Assets...');

        $this->call('vendor:publish', ['--tag' => 'config']);
        $this->call('vendor:publish', ['--tag' => 'views']);
        $this->call('vendor:publish', ['--tag' => 'laravel-web-tinker-assets']);

        $this->info('Laravel Web Tinker installed successfully.');
    }
}
