import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Verificar si la configuración es válida (similar a isFirebaseConfigured)
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabasePublishableKey && 
  /^https?:\/\//.test(supabaseUrl) &&
  supabaseUrl !== 'https://tu-proyecto.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublishableKey)
  : null;

// Nombre del bucket de almacenamiento (debe coincidir con el creado en el panel de Supabase)
export const STORAGE_BUCKET = 'invitaciones';