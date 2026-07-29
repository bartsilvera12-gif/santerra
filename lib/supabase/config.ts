export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Mientras no existan las credenciales, el sitio publico sigue funcionando
 * con los datos estaticos de lib/properties.ts y el panel avisa que falta
 * configurar el entorno.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const PROPERTY_IMAGES_BUCKET = "property-images";

/**
 * Las tablas viven en un schema propio, no en "public".
 * Tiene que estar agregado en Supabase -> Project Settings -> API ->
 * Data API -> Exposed schemas, si no PostgREST lo rechaza.
 */
export const DB_SCHEMA = "santerra";
