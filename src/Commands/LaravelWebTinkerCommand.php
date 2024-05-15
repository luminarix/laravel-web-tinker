<?php

namespace Luminarix\LaravelWebTinker\Commands;

use Illuminate\Console\Command;

class LaravelWebTinkerCommand extends Command
{
    public $signature = 'laravel-web-tinker';

    public $description = 'My command';

    public function handle(): int
    {
        $this->comment('All done');

        return self::SUCCESS;
    }
}
