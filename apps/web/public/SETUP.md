
## Web Pack Setup Guide

### 1. Extract Files
Extract the Web Pack ZIP to your project's `public/` folder:

```
your-app/
├── public/
│   ├── favicon.ico
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── favicon-192.png
│   ├── apple-touch-icon.png
│   ├── site.webmanifest
│   └── browserconfig.xml
```

### 2. Add Meta Tags
Copy these tags into the `<head>` of your HTML:

```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">

<!-- Apple -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="mask-icon" href="/favicon.svg" color="#000000">

<!-- Web App -->
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#ffffff">

<!-- Windows -->
<meta name="msapplication-config" content="/browserconfig.xml">
```

### 3. Customize Manifest
Edit `site.webmanifest` to match your app:

```json
{
  "name": "Your App Name",
  "short_name": "App",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000"
}
```

### 4. Test
- Browser tab: Should show icon
- PWA install: Should show icon in install prompt
- Apple pinned tab: Icon appears in Safari
- Windows tile: Icon appears if pinned to Start menu

That's it! Your icons are now live.
