@php
    $indexPath = base_path('/vendor/luminarix/laravel-web-tinker/dist/index.html');

    $assetsExist = false;
    if (is_dir(public_path('vendor/web-tinker/assets'))) {
        $files = scandir(public_path('vendor/web-tinker/assets'));
        foreach ($files as $file) {
            if (preg_match('/^index(-[a-zA-Z0-9]+)?\.js$/', $file)) {
                $assetsExist = true;
                break;
            }
        }
    }

    if (file_exists($indexPath) && $assetsExist) {
        $htmlContent = file_get_contents($indexPath);

        $dataPath = url(config('web-tinker.path', '/tinker'));
        $dataEnvironment = e($environment);

        $attributes = 'data-path="' . $dataPath . '" data-environment="' . $dataEnvironment . '"';

        $modifiedHtml = preg_replace(
            '/(<div id="root")(\s+data-path="[^"]*")?/',
            '$1 ' . $attributes,
            $htmlContent,
            1
        );

        if ($modifiedHtml === $htmlContent) {
             $modifiedHtml = str_replace(
                 '<div id="root"',
                 '<div id="root" ' . $attributes,
                 $htmlContent
             );
        }

        $modifiedHtml = str_replace('href="/assets/', 'href="/vendor/web-tinker/assets/', $modifiedHtml);
        $modifiedHtml = str_replace('src="/assets/', 'src="/vendor/web-tinker/assets/', $modifiedHtml);
        $modifiedHtml = str_replace('href="/favicon', 'href="/vendor/web-tinker/favicon', $modifiedHtml);
        $modifiedHtml = str_replace('href="/img/', 'href="/vendor/web-tinker/img/', $modifiedHtml);

        echo $modifiedHtml;
    } else {
        echo "<!DOCTYPE html><html><head><title>Error</title><style>body { font-family: sans-serif; padding: 20px; color: #dc3545; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; }</style></head><body>";
        echo "<h1>Web Tinker Error</h1>";
        echo "<p>Web Tinker assets not found or incomplete.</p>";
        echo "<p>Please ensure you have run the following commands:</p>";
        echo "<pre><code>php artisan vendor:publish --tag=laravel-web-tinker-assets --force\n";
        echo "npm run build --prefix vendor/luminarix/laravel-web-tinker</code></pre>";
        echo "<p>Expected location for assets: <code>" . public_path('vendor/web-tinker/assets') . "</code></p>";
        echo "<p>Looked for index.html at: <code>" . $indexPath . "</code></p>";
        echo "</body></html>";
    }
@endphp
