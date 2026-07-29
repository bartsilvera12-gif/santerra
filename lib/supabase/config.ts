export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Mientras no existan las credenciales, el sitio publico sigue funcionando
 * con los datos estaticos de lib/properties.ts y el panel avisa que falta
 * configurar el entorno.
 */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/**
 * Bucket donde se guardan las fotos.
 *
 * El nombre lleva la marca a proposito: esta instancia de Supabase aloja
 * varios proyectos y los buckets son un espacio de nombres compartido.
 * "property-images", por ejemplo, ya lo ocupa otra inmobiliaria.
 */
export const PROPERTY_IMAGES_BUCKET =
  process.env.NEXT_PUBLIC_STORAGE_BUCKET ?? "santerra-medios";

/** Carpeta opcional dentro del bucket. Vacia si el bucket es solo nuestro. */
export const STORAGE_PREFIX = process.env.NEXT_PUBLIC_STORAGE_PREFIX ?? "";

/** Arma la ruta de un archivo respetando el prefijo cuando existe. */
export function rutaDeArchivo(...partes: string[]): string {
  return [STORAGE_PREFIX, ...partes].filter(Boolean).join("/");
}

/**
 * Las tablas viven en un schema propio, no en "public".
 * Tiene que estar agregado en Supabase -> Project Settings -> API ->
 * Data API -> Exposed schemas, si no PostgREST lo rechaza.
 */
export const DB_SCHEMA = "santerra";

/**
 * Unicos correos habilitados para entrar al panel. Se puede ampliar con
 * NEXT_PUBLIC_ADMIN_EMAILS separando por comas.
 *
 * Esto es solo la primera barrera: la que manda son las politicas RLS de
 * supabase/schema.sql, que exigen el mismo correo para escribir. Sin eso,
 * cualquier usuario de Supabase podria escribir atacando la API directo.
 */
export const ADMIN_EMAILS = (
  process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "admin@santerra.com"
)
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
