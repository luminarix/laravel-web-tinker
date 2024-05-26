<?php

namespace Luminarix\LaravelWebTinker\OutputModifiers;

class PrefixDateTime implements OutputModifier
{
    public function modify(string $output, float $runtime): string
    {
        $timestamp = now()->format('Y-m-d H:i:s');
        $formattedRuntime = number_format($runtime / 1_000, 3);

        return <<<HTML
<span style="color:rgba(255,255,255,0.2);font-style:italic">{$timestamp} (runtime: {$formattedRuntime}s)</span><br>{$output}
HTML;
    }
}
