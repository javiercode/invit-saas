/**
 * Datos mock de alta fidelidad inspirados en las referencias de Canva solicitadas:
 * - Catálogo: tu-invitación-ideal.my.canva.site/catalogobodas
 * - Invitación de Boda: clic-estudio-creativo-ag.my.canva.site/j-m-2024
 */

const BASE_SERVICES = [
  {
    id: 'boda-premium-elegante',
    title: 'Boda Premium - Colección Elegante',
    eventType: 'bodas',
    style: 'elegante',
    price: 49.99,
    description: 'Invitación interactiva con tipografía serif dorada, cuenta regresiva, confirmación RSVP y galería fotográfica.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    tags: ['Boda', 'Elegante', 'Bestseller'],
    templateId: 'elegante',
    rating: 4.9,
    reviewsCount: 128
  },
  {
    id: 'boda-boho-vintage',
    title: 'Boda Boho & Rústica - Vintage',
    eventType: 'bodas',
    style: 'vintage',
    price: 45.00,
    description: 'Estilo floral botánico en tonos cálidos y eucalipto. Ideal para bodas campestres, jardín o playa.',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    tags: ['Boda', 'Vintage', 'Boho Chic'],
    templateId: 'vintage',
    rating: 4.8,
    reviewsCount: 94
  },
  {
    id: 'boda-minimal-moderna',
    title: 'Boda Urbana Minimalista - Moderna',
    eventType: 'bodas',
    style: 'moderna',
    price: 39.99,
    description: 'Diseño geométrico limpio con modo oscuro/claro, transiciones fluidas y enlaces directos a Google Maps y Waze.',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
    tags: ['Boda', 'Moderna', 'Minimal'],
    templateId: 'moderna',
    rating: 5.0,
    reviewsCount: 76
  },
  {
    id: 'xv-anos-princesa-glam',
    title: 'Mis XV Años - Royal Glam',
    eventType: 'xv_anos',
    style: 'elegante',
    price: 42.00,
    description: 'Invitación deslumbrante con animación de confeti, selección de vestimenta y formulario de confirmación para jóvenes.',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    tags: ['XV Años', 'Elegante', 'Glamour'],
    templateId: 'elegante',
    rating: 4.9,
    reviewsCount: 82
  },
  {
    id: 'bautizo-angelical-soft',
    title: 'Bautizo & Baby Shower - Dulce Nube',
    eventType: 'bautizos',
    style: 'vintage',
    price: 35.00,
    description: 'Colores pasteles acogedores con itinerario del evento, tarjeta de regalos y ubicación interactiva de la iglesia.',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
    tags: ['Bautizo', 'Vintage', 'Tierno'],
    templateId: 'vintage',
    rating: 4.7,
    reviewsCount: 65
  },
  {
    id: 'graduacion-exito-total',
    title: 'Fiesta de Graduación - Gala de Éxito',
    eventType: 'graduaciones',
    style: 'moderna',
    price: 35.00,
    description: 'Invitación formal de fin de carrera con galería de recuerdos, mapa al centro de eventos y confirmación de invitados.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    tags: ['Graduación', 'Moderna', 'Celebración'],
    templateId: 'moderna',
    rating: 4.8,
    reviewsCount: 43
  }
];

/**
 * Variantes del catálogo: 10 propuestas adicionales por sección (tipo de evento).
 * Cada una combina estilo/plantilla, imagen y etiquetas propias.
 */
const VARIANTS = {
  bodas: {
    label: 'Boda', price: 38,
    images: ['photo-1519741497674-611481863552', 'photo-1511285560929-80b456fea0bc', 'photo-1465495976277-4387d4b0b4c6'],
    names: ['Jardín Secreto', 'Atardecer en la Playa', 'Civil Íntima', 'Hacienda Colonial', 'Destino Europeo', 'Black Tie', 'Bosque Encantado', 'Rosa Pastel', 'Art Déco', 'Boda Eco-Friendly']
  },
  xv_anos: {
    label: 'XV Años', price: 34,
    images: ['photo-1517457373958-b7bdd4587205', 'photo-1583939003579-730e3918a45a', 'photo-1469371670807-013ccf25f16a'],
    names: ['Cuento de Hadas', 'Mascarada Veneciana', 'Rosa Gold', 'Noche de Estrellas', 'Quinceañera Tropical', 'Vestido Azul Real', 'Mariposas', 'Paris Chic', 'Neón Party', 'Vintage Glam']
  },
  bautizos: {
    label: 'Bautizo', price: 28,
    images: ['photo-1515934751635-c81c6bc9a2d8', 'photo-1511285560929-80b456fea0bc', 'photo-1469371670807-013ccf25f16a'],
    names: ['Angelito Celeste', 'Bendición Rosa', 'Cruz Dorada', 'Nubes y Estrellas', 'Primer Sacramento', 'Paloma de Paz', 'Safari Bebé', 'Osito Dulce', 'Luna y Sol', 'Rústico Blanco']
  },
  graduaciones: {
    label: 'Graduación', price: 30,
    images: ['photo-1523050854058-8df90110c9f1', 'photo-1465495976277-4387d4b0b4c6', 'photo-1583939003579-730e3918a45a'],
    names: ['Toga y Birrete', 'Generación 2026', 'Honor y Gloria', 'Campus Night', 'Medicina Elite', 'Ingeniería Pro', 'Derecho Clásico', 'Arte y Diseño', 'Posgrado Master', 'Fiesta de Egreso']
  }
};
const STYLES = ['elegante', 'vintage', 'moderna'];

const VARIANT_SERVICES = Object.entries(VARIANTS).flatMap(([eventType, v]) =>
  v.names.map((name, i) => {
    const style = STYLES[i % STYLES.length];
    return {
      id: `${eventType}-${style}-${i + 1}`,
      title: `${v.label} ${name}`,
      eventType,
      style,
      price: v.price + (i % 4) * 3 + 0.99,
      description: `Invitación interactiva "${name}" con cuenta regresiva, ubicación en mapa, galería y confirmación RSVP.`,
      image: `https://images.unsplash.com/${v.images[i % v.images.length]}?auto=format&fit=crop&w=800&q=80`,
      tags: [v.label, style.charAt(0).toUpperCase() + style.slice(1), 'Nuevo'],
      templateId: style,
      rating: +(4.5 + (i % 5) / 10).toFixed(1),
      reviewsCount: 20 + i * 7
    };
  })
);

export const MOCK_SERVICES = [...BASE_SERVICES, ...VARIANT_SERVICES];

export const MOCK_INVITATIONS = {
  'j-m-2024': {
    id: 'j-m-2024',
    slug: 'j-m-2024',
    ownerId: 'demo-user-123',
    confirmedGuests: 84,
    totalPases: 120,
    enabled: true,
    templateId: 'elegante',
    couple: {
      bride: 'Juliana',
      groom: 'Mauricio',
      initials: 'J & M',
      quote: '"El amor no mira con los ojos, sino con el alma."'
    },
    eventDate: '2026-11-28T18:00:00',
    locations: {
      ceremony: {
        title: 'Ceremonia Religiosa',
        place: 'Parroquia Nuestra Señora de la Candelaria',
        time: '18:00 hrs',
        address: 'Calle Mayor 45, Centro Histórico',
        city: 'Guadalajara, Jalisco',
        googleMapsUrl: 'https://maps.google.com/?q=20.6736,-103.344',
        wazeUrl: 'https://waze.com/ul?ll=20.6736,-103.344&navigate=yes'
      },
      reception: {
        title: 'Recepción & Fiesta',
        place: 'Hacienda San José de las Palmas',
        time: '20:00 hrs',
        address: 'Carretera al Bosque Km 12',
        city: 'Zapopan, Jalisco',
        googleMapsUrl: 'https://maps.google.com/?q=20.7166,-103.405',
        wazeUrl: 'https://waze.com/ul?ll=20.7166,-103.405&navigate=yes'
      }
    },
    itinerary: [
      { time: '18:00', title: 'Ceremonia de Boda', icon: 'church' },
      { time: '19:30', title: 'Coctel de Bienvenida', icon: 'cocktail' },
      { time: '20:30', title: 'Entrada de los Novios y Cena', icon: 'dinner' },
      { time: '22:00', title: 'Brindis & Apertura de Pista', icon: 'dance' },
      { time: '02:00', title: 'Tornaboda & Despedida', icon: 'moon' }
    ],
    dressCode: {
      title: 'Código de Vestimenta',
      type: 'Rigurosa Etiqueta / Formal',
      description: 'Hombres: Traje oscuro o esmoquin. Mujeres: Vestido largo de noche. (Nos reservamos el color blanco y beige para la novia).'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
        caption: 'Nuestra propuesta'
      },
      {
        url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
        caption: 'Caminando juntos'
      },
      {
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
        caption: 'Mirando hacia el futuro'
      },
      {
        url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1000&q=80',
        caption: 'Cada momento cuenta'
      }
    ],
    gifts: {
      message: 'Su presencia es nuestro mayor regalo. Sin embargo, si desean tener un detalle con nosotros, les dejamos nuestras opciones:',
      stores: [
        {
          name: 'Liverpool',
          eventNumber: 'Evento No. 51203948',
          link: 'https://www.liverpool.com.mx'
        },
        {
          name: 'Amazon Bodas',
          eventNumber: 'Mesa: Juliana y Mauricio',
          link: 'https://www.amazon.com.mx'
        }
      ],
      bankDetails: {
        bank: 'BBVA Bancomer',
        clabe: '012180015482910394',
        beneficiary: 'Mauricio Méndez & Juliana Ramos',
        concept: 'Boda J&M'
      }
    },
    rsvpDeadline: '2026-11-01',
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
  },
  'boda-juan-y-maria': {
    id: 'boda-juan-y-maria',
    slug: 'boda-juan-y-maria',
    ownerId: 'cliente-demo-456',
    confirmedGuests: 62,
    totalPases: 90,
    enabled: true,
    templateId: 'vintage',
    couple: {
      bride: 'María',
      groom: 'Juan',
      initials: 'J & M',
      quote: '"Juntos es nuestro lugar favorito para estar."'
    },
    eventDate: '2026-10-15T17:00:00',
    locations: {
      ceremony: {
        title: 'Ceremonia Campestre',
        place: 'Jardín de los Cerezos',
        time: '17:00 hrs',
        address: 'Camino Real 108, Valle Verde',
        city: 'Querétaro',
        googleMapsUrl: 'https://maps.google.com/?q=20.5888,-100.3899',
        wazeUrl: 'https://waze.com/ul?ll=20.5888,-100.3899&navigate=yes'
      },
      reception: {
        title: 'Fiesta & Brindis',
        place: 'Quinta La Enramada',
        time: '19:00 hrs',
        address: 'Camino Real 120, Valle Verde',
        city: 'Querétaro',
        googleMapsUrl: 'https://maps.google.com/?q=20.5900,-100.3910',
        wazeUrl: 'https://waze.com/ul?ll=20.5900,-100.3910&navigate=yes'
      }
    },
    itinerary: [
      { time: '17:00', title: 'Llegada e ingreso al jardín', icon: 'clock' },
      { time: '17:30', title: 'Ceremonia Simbólica', icon: 'heart' },
      { time: '18:30', title: 'Sesión de Fotos y Coctel', icon: 'camera' },
      { time: '20:00', title: 'Cena Bajo las Estrellas', icon: 'dinner' },
      { time: '21:30', title: 'Música en Vivo & Fiesta', icon: 'music' }
    ],
    dressCode: {
      title: 'Código de Vestimenta',
      type: 'Boho Chic / Guayabera & Vestido de Cóctel',
      description: 'Tonos tierra y pasteles. Se sugiere calzado cómodo para césped.'
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
        caption: 'En nuestro rincón especial'
      },
      {
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1000&q=80',
        caption: 'Risas inolvidables'
      }
    ],
    gifts: {
      message: 'Tu compañía es lo más valioso para este gran día. Si deseas regalarnos algo, puedes hacerlo a través de nuestra lluvia de sobres o transferencia:',
      stores: [],
      bankDetails: {
        bank: 'Santander',
        clabe: '014180605928192019',
        beneficiary: 'Juan Carlos & María Fernández',
        concept: 'Boda Juan y María'
      }
    },
    rsvpDeadline: '2026-09-30',
    heroImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80'
  }
};
