<?php

namespace Luminarix\LaravelWebTinker\OutputModifiers;

class PrefixDateTime implements OutputModifier
{
    public function modify(string $output, float $runtime): string
    {
        return '<span style="color:rgba(255,255,255,0.2);font-style:italic">' . now()->format('Y-m-d H:i:s') . ' (runtime: ' . number_format($runtime / 1_000, 3) . 's)</span><br>' . $output;
    }
}
