# Small Laravel package to use Tinker in your browser

[![Latest Version on Packagist](https://img.shields.io/packagist/v/luminarix/laravel-web-tinker.svg?style=flat-square)](https://packagist.org/packages/luminarix/laravel-web-tinker)
[![GitHub Tests Action Status](https://img.shields.io/github/actions/workflow/status/luminarix/laravel-web-tinker/run-tests.yml?branch=main&label=tests&style=flat-square)](https://github.com/luminarix/laravel-web-tinker/actions?query=workflow%3Arun-tests+branch%3Amain)
[![GitHub Code Style Action Status](https://img.shields.io/github/actions/workflow/status/luminarix/laravel-web-tinker/fix-php-code-style-issues.yml?branch=main&label=code%20style&style=flat-square)](https://github.com/luminarix/laravel-web-tinker/actions?query=workflow%3A"Fix+PHP+code+style+issues"+branch%3Amain)
[![Total Downloads](https://img.shields.io/packagist/dt/luminarix/laravel-web-tinker.svg?style=flat-square)](https://packagist.org/packages/luminarix/laravel-web-tinker)

This package allows you to use Tinker in your browser. Wildly inspired by Spatie's [Laravel Web Tinker](https://github.com/spatie/laravel-web-tinker), but with added functionality, and React frontend.

## 🚨 A word to the wise 🚨

This package can run arbitrary code. Unless you know what you are doing, you should never install or use this in a production environment, or any environment where you handle real world data.

## Known issues

- None. Please report any issues you find.

## Requirements

- PHP ^8.3
- Laravel ^11.0

## Extra features
- Tabs for multiple code snippets
  - Tabs can be renamed
  - Tabs have their own code history
  - Both of the above are saved in local storage, so they persist between sessions and page reloads
- Runtime counter displayed while loading and total runtime displayed in the final output
- Loading state is displayed while the code is running

## Installation

#### If you've used Spatie's Laravel Web Tinker before, please remove the config/web-tinker.php file before installing this package.

You can install the package via composer:

```bash
composer require luminarix/laravel-web-tinker
```

Publish the assets:

```bash
php artisan vendor:publish --tag="laravel-web-tinker-assets"
```

You can publish the config file with:

```bash
php artisan vendor:publish --tag="laravel-web-tinker-config"
```

Optionally, you can publish the views using

```bash
php artisan vendor:publish --tag="laravel-web-tinker-views"
```

Or if you want to publish everything at once, you can use

```bash
php artisan laravel-web-tinker:install
```

## Usage

By default this package will only run in a local environment.

Visit `/tinker` in your local environment of your app to view the tinker page.

## Authorization

Should you want to run this in another environment (we do not recommend this), there are two steps you must perform.

1. You must register a `viewWebTinker` ability. A good place to do this is in the `AuthServiceProvider` that ships with Laravel.

```php
public function boot()
{
    $this->registerPolicies();

    Gate::define('viewWebTinker', function ($user = null) {
        // return true if access to web tinker is allowed
    });
}
```

2. You must set the `enabled` variable in the `web-tinker` config file to `true`.

## Modifying the output

You can modify the output of tinker by specifying an output modifier in the `output_modifier` key of the `web-tinker` config file. An output modifier is any class that implements `\Luminarix\LaravelWebTinker\OutputModifiers\OutputModifier`.

This is how that interface looks like.

```php
namespace Luminarix\LaravelWebTinker\OutputModifiers;

interface OutputModifier
{
    public function modify(string $output = ''): string;
}
```

The default install of this package will use the `PrefixDataTime` output modifier which prefixes the output from Tinker with the current date time and the run-time of the code.

## Testing

```bash
composer test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Credits

- [Luminarix Labs](https://github.com/luminarix)
- [Lajos Gere](https://github.com/gere-lajos)
- [Márk Magyar](https://github.com/xHeaven)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
