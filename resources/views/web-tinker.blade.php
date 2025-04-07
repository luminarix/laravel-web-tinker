<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="{{ asset('vendor/web-tinker/img/favicon.png') }}" />
    <title>Tinker</title>
  </head>
  <body>
    <div id="root" data-path="/tinker"></div>
    @if(app()->environment('production'))
      <script src="{{ asset('vendor/web-tinker/production.js') }}"></script>
    @else
      <script src="{{ asset('vendor/web-tinker/development.js') }}"></script>
    @endif
  </body>
</html>