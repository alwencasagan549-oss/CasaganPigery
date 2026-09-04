<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
    <title>CasaganPigery</title>
    <meta name="description" content="Browse available inahin, platining, and biik from CasaganPigery, a family-run piggery in Bulacan, Philippines. Honest pricing, healthy livestock." />
    <meta name="author" content="CasaganPigery" />

    <meta property="og:title" content="CasaganPigery" />
    <meta property="og:description" content="Available inahin, platining, and biik from a family-run piggery in Bulacan." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/assets/fb-icon.png" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="CasaganPigery" />
    <meta name="twitter:image" content="/assets/fb-icon.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/logo.png">
    <link rel="manifest" href="/site.webmanifest">

    <meta name="csrf-token" content="{{ csrf_token() }}">
    @viteReactRefresh
    @vite(['resources/js/main.tsx', 'resources/js/index.css'])
  </head>

  <body>
    <div id="root"></div>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
          }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
        });
      }
    </script>
  </body>
</html>
