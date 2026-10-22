# GitHub Pages Single-Page Application (SPA) Routing Strategy

## El Desafío
GitHub Pages es un servidor estático que busca archivos físicos en el sistema de archivos (`.html`). Cuando un usuario recarga o ingresa directamente a una ruta profunda como `https://usuario.github.io/repositorio/invitacion/boda-juan-y-maria`, el servidor no encuentra el archivo `boda-juan-y-maria.html` y arroja el error 404 de GitHub Pages.

## Solución Técnica: Redirección SPA sin Hashes

### Paso 1: `public/404.html`
Captura la ruta que falló, la codifica como parámetro de búsqueda en formato `/?/` y redirige a la raíz de la aplicación:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <script>
      var pathSegmentsToKeep = 1; // 1 para repositorios usuario.github.io/repo/
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

### Paso 2: Script en `<head>` de `index.html`
Antes de que React monte, decodifica el parámetro `/?/` y reescribe el historial del navegador con la URL original:

```html
<script type="text/javascript">
  (function(l) {
    if (l.search[1] === '/' ) {
      var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&') 
      }).join('?');
      window.history.replaceState(null, null,
          l.pathname.slice(0, -1) + decoded + l.hash
      );
    }
  }(window.location))
</script>
```

### Paso 3: Configuración en `vite.config.js` y `BrowserRouter`
En Vite:
```javascript
export default defineConfig({
  base: process.env.VITE_BASE_PATH || './',
});
```

En React Router:
```jsx
<BrowserRouter basename={import.meta.env.BASE_URL}>
  <Routes>...</Routes>
</BrowserRouter>
```
