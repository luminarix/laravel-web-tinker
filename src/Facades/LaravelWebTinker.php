<?php

namespace Luminarix\LaravelWebTinker\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \Luminarix\LaravelWebTinker\LaravelWebTinker
 */
class LaravelWebTinker extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \Luminarix\LaravelWebTinker\LaravelWebTinker::class;
    }
}
