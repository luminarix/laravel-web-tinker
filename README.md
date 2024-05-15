# Small Laravel package to use Tinker in your browser

[![Latest Version on Packagist](https://img.shields.io/packagist/v/luminarix/laravel-web-tinker.svg?style=flat-square)](https://packagist.org/packages/luminarix/laravel-web-tinker)
[![GitHub Tests Action Status](https://img.shields.io/github/actions/workflow/status/luminarix/laravel-web-tinker/run-tests.yml?branch=main&label=tests&style=flat-square)](https://github.com/luminarix/laravel-web-tinker/actions?query=workflow%3Arun-tests+branch%3Amain)
[![GitHub Code Style Action Status](https://img.shields.io/github/actions/workflow/status/luminarix/laravel-web-tinker/fix-php-code-style-issues.yml?branch=main&label=code%20style&style=flat-square)](https://github.com/luminarix/laravel-web-tinker/actions?query=workflow%3A"Fix+PHP+code+style+issues"+branch%3Amain)
[![Total Downloads](https://img.shields.io/packagist/dt/luminarix/laravel-web-tinker.svg?style=flat-square)](https://packagist.org/packages/luminarix/laravel-web-tinker)

This is where your description should go. Limit it to a paragraph or two. Consider adding a small example.

## Installation

You can install the package via composer:

```bash
composer require luminarix/laravel-web-tinker
```

You can publish and run the migrations with:

```bash
php artisan vendor:publish --tag="laravel-web-tinker-migrations"
php artisan migrate
```

You can publish the config file with:

```bash
php artisan vendor:publish --tag="laravel-web-tinker-config"
```

Optionally, you can publish the views using

```bash
php artisan vendor:publish --tag="laravel-web-tinker-views"
```

## Usage

```php
$laravelWebTinker = new Luminarix\LaravelWebTinker();
echo $laravelWebTinker->echoPhrase('Hello, Luminarix!');
```

## Testing

```bash
composer test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Credits

- [Luminarix Labs](https://github.com/luminarix)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
