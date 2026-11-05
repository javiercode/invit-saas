export const EVENT_TYPES = [
  { id: 'all', label: 'Todos los tipos' },
  { id: 'bodas', label: 'Boda' },
  { id: 'cumpleanos', label: 'Cumpleaños' },
  { id: 'xv_anos', label: '15 Años' },
  { id: 'bautizos', label: 'Bautizo' },
  { id: 'graduaciones', label: 'Graduación' }
];

// Secciones opcionales de la invitación (desmarcadas por defecto)
export const SECTIONS = [
  { key: 'ceremony', label: 'Ceremonia religiosa' },
  { key: 'reception', label: 'Recepción & Fiesta' },
  { key: 'itinerary', label: 'Cronograma' },
  { key: 'dressCode', label: 'Código de vestimenta' },
  { key: 'gallery', label: 'Fotos' }
];

export const DRESS_CODES = [
  'Rigurosa etiqueta / Formal',
  'Etiqueta (traje y vestido largo)',
  'Cóctel / Semi formal',
  'Casual elegante',
  'Boho chic / Campestre',
  'Playa / Ligero',
  'Colores claros',
  'Todo de blanco'
];

export const PHOTO_CAPTIONS = ['Nuestra propuesta', 'Caminando juntos', 'Mirando hacia el futuro', 'Cada momento cuenta', 'Nuestra historia'];

/** Devuelve los datos con solo las secciones activadas (`sections[key] === true`). */
export const applySections = (data = {}) => {
  const on = (k) => data.sections?.[k] === true;
  const { ceremony, reception, ...otherLocations } = data.locations || {};
  return {
    ...data,
    locations: { ...otherLocations, ...(on('ceremony') && ceremony ? { ceremony } : {}), ...(on('reception') && reception ? { reception } : {}) },
    itinerary: on('itinerary') ? data.itinerary || [] : [],
    dressCode: on('dressCode') ? data.dressCode : null,
    gallery: on('gallery') ? data.gallery || [] : []
  };
};
