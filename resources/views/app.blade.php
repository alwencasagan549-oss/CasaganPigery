<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="manifest" href="/manifest.json" crossorigin="use-credentials">
  <meta name="theme-color" content="#2D4F1E">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="application-name" content="CasaganPigery">
  
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="CasaganPigery">
  
  <title>CasaganPigery — Healthy Pigs from a Family Farm in Bulacan</title>
  <meta name="description"
    content="Browse available inahin, platining, and biik from CasaganPigery, a family-run piggery in Bulacan, Philippines. Honest pricing, healthy livestock." />
  <meta name="author" content="CasaganPigery" />

  <meta property="og:title" content="CasaganPigery — Healthy Pigs from a Family Farm" />
  <meta property="og:description"
    content="Available inahin, platining, and biik from a family-run piggery in Bulacan." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/og-image.png" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="CasaganPigery — Bulacan's Trusted Piggery" />
  <meta name="twitter:image" content="/og-image.png" />

  <meta name="csrf-token" content="{{ csrf_token() }}">
  @viteReactRefresh
  @vite(['resources/js/main.tsx', 'resources/js/index.css'])
</head>

<body>
  <div id="root"></div>
</body>

</html>