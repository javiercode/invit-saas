---
name: digital-invitations-saas
description: Standards and blueprints for building digital invitations SaaS with React, Vite, Firebase, Clean Architecture, and GitHub Pages routing.
---

# Digital Invitations SaaS Architecture & Standards

## Overview

Este skill contiene las directrices de arquitectura limpia, patrones de diseño y estándares de ingeniería para construir una plataforma SaaS de invitaciones digitales interactivas, responsivas y mobile-first con React (Vite), Firebase y soporte para GitHub Pages.

## Directrices de Arquitectura

### 1. Arquitectura Modular y Limpia de Directorios
Cada componente debe encapsular su lógica, vista y estilos en una carpeta dedicada:
```text
src/
├── core/             # Firebase SDK, contextos de Auth, hooks y servicios globales
├── features/         # Módulos de negocio (catalog, builder, dashboard, auth)
│   ├── catalog/      # Catálogo inspirado en Canva (CardCatalogo, GridServicios, FilterBar)
│   ├── builder/      # Constructor, previsualizador y TemplateRenderer.jsx
│   └── dashboard/    # Gestión de eventos, confirmaciones RSVP y métricas
└── templates/        # Motor de plantillas dinámicas (Elegante, Vintage, Moderna)
```

### 2. Principios de Componentes
- **Auto-contenido:** Toda carpeta de componente contiene `NombreComponente.jsx`, `NombreComponente.css` y opcionalmente `index.js`.
- **Inyección de JSON:** Las plantillas en `templates/` reciben exactamente el mismo objeto JSON de datos (`couple`, `eventDate`, `locations`, `itinerary`, `gallery`, `gifts`).
- **Mobile First:** El 90% de los usuarios finales visualizan invitaciones en dispositivos móviles. Los layouts deben diseñarse primero para pantallas de 360px-420px.

### 3. Componentes Obligatorios de Invitación
Toda plantilla interactiva debe incorporar:
1. **CountdownTimer:** Cuenta regresiva en tiempo real con días, horas, minutos y segundos.
2. **InteractiveMap:** Enlaces directos a Google Maps y Waze con coordenadas precisas.
3. **RsvpModal:** Formulario de confirmación conectado a Firestore con animación de confeti.
4. **PhotoGallery:** Cuadrícula con visor modal lightbox.
5. **GiftTable:** Mesa de regalos con enlace a tiendas y copia en 1 clic de datos bancarios / CLABE.

### 4. Integración con Firebase (v10 Modular)
- **Auth:** Autenticación con Google y correo/contraseña.
- **Firestore:** Colecciones `usuarios`, `servicios`, `invitaciones`, `confirmaciones_rsvp`.
- **Storage:** Fotos de novios y galerías multimedia.
- Consulta [references/firestore-schema.md](references/firestore-schema.md) para el modelo detallado de datos.

### 5. Estrategia de Enrutamiento para GitHub Pages
Para prevenir el error 404 al recargar o entrar directamente a rutas profundas (`/invitacion/:slug`):
- Implementar el script redireccionador en `public/404.html`.
- Decodificar el estado en el `<head>` de `index.html`.
- Configurar `base` en `vite.config.js` y `basename={import.meta.env.BASE_URL}` en `BrowserRouter`.
- Consulta [references/github-pages-routing.md](references/github-pages-routing.md) para la implementación paso a paso.
