<?php

namespace Luminarix\LaravelWebTinker\OutputModifiers;

interface OutputModifier
{
    public function modify(string $output, float $runtime): string;
}
