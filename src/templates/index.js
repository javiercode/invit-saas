import EleganteTemplate from './elegante/EleganteTemplate';
import VintageTemplate from './vintage/VintageTemplate';
import ModernaTemplate from './moderna/ModernaTemplate';

/**
 * Registro dinámico de plantillas para el SaaS de Invitaciones.
 * Permite renderizar intercambiablemente cualquier plantilla recibiendo el mismo JSON de datos.
 */
export const TEMPLATES_REGISTRY = {
  elegante: {
    id: 'elegante',
    name: 'Colección Elegante (Boho & Oro)',
    component: EleganteTemplate,
    style: 'elegante',
    previewImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    description: 'Estilo sofisticado con tipografías serif clásicas, monograma personalizado, detalles en oro y diseño mobile-first.'
  },
  vintage: {
    id: 'vintage',
    name: 'Colección Vintage & Campestre',
    component: VintageTemplate,
    style: 'vintage',
    previewImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    description: 'Tonos botánicos, eucalipto y texturas cálidas para bodas rústicas, jardines y eventos al aire libre.'
  },
  moderna: {
    id: 'moderna',
    name: 'Colección Moderna & Minimalista',
    component: ModernaTemplate,
    style: 'moderna',
    previewImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80',
    description: 'Diseño geométrico de vanguardia, tipografía limpia, paleta urbana y componentes interactivos de alto impacto.'
  }
};

/**
 * Helper para obtener una plantilla o retornar la plantilla por defecto ('elegante')
 */
export const getTemplateById = (templateId) => {
  return TEMPLATES_REGISTRY[templateId] || TEMPLATES_REGISTRY.elegante;
};

export default TEMPLATES_REGISTRY;
