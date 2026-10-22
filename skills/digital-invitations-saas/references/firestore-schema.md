# Firestore Schema & Data Modeling

## Colecciones Principales

### 1. `usuarios`
Perfiles de usuario autenticados (clientes administradores o novios/organizadores).
- `uid`: string (ID del usuario generado por Firebase Auth)
- `email`: string
- `displayName`: string
- `photoURL`: string
- `role`: 'client' | 'admin'
- `createdAt`: serverTimestamp
- `updatedAt`: serverTimestamp

### 2. `servicios`
Catálogo de paquetes de invitación inspirados en Canva.
- `id`: string (slug identificador, ej: 'boda-premium-elegante')
- `title`: string
- `eventType`: 'bodas' | 'xv_anos' | 'bautizos' | 'graduaciones'
- `style`: 'elegante' | 'vintage' | 'moderna'
- `price`: number (ej: 49.99)
- `description`: string
- `image`: string (URL de imagen de portada)
- `tags`: array of string
- `templateId`: string ('elegante' | 'vintage' | 'moderna')
- `rating`: number
- `reviewsCount`: number

### 3. `invitaciones`
Documento central de cada invitación publicada.
- `id`: string (auto-generado o slug)
- `slug`: string (único, ej: 'j-m-2024')
- `userId`: string (dueño de la invitación)
- `templateId`: string ('elegante' | 'vintage' | 'moderna')
- `couple`: {
    bride: string,
    groom: string,
    initials: string,
    quote: string
  }
- `eventDate`: string (ISO 8601 o timestamp)
- `locations`: {
    ceremony: {
      title: string,
      place: string,
      time: string,
      address: string,
      city: string,
      googleMapsUrl: string,
      wazeUrl: string
    },
    reception: { ... }
  }
- `itinerary`: array of { time: string, title: string, icon: string }
- `dressCode`: { title: string, type: string, description: string }
- `gallery`: array of { url: string, caption: string }
- `gifts`: {
    message: string,
    stores: array of { name: string, eventNumber: string, link: string },
    bankDetails: { bank: string, clabe: string, beneficiary: string, concept: string }
  }
- `rsvpDeadline`: string (YYYY-MM-DD)
- `status`: 'active' | 'draft' | 'archived'
- `createdAt`: serverTimestamp
- `updatedAt`: serverTimestamp

### 4. `confirmaciones_rsvp`
Respuestas de asistencia de los invitados.
- `id`: string (auto-generado)
- `invitationId`: string (referencia a la invitación)
- `name`: string
- `phone`: string
- `attending`: boolean
- `companionsCount`: number
- `dietaryRestrictions`: string
- `message`: string
- `createdAt`: serverTimestamp
