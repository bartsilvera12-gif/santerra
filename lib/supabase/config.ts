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
 * Se puede apuntar a uno ya existente con NEXT_PUBLIC_STORAGE_BUCKET. Crear
 * un bucket nuevo por SQL no siempre se puede: en Supabase autoalojado las
 * tablas de storage son de supabase_storage_admin y el editor no tiene
 * permiso, asi que reutilizar uno existente evita el problema.
 */
export const PROPERTY_IMAGES_BUCKET =
  process.env.NEXT_PUBLIC_STORAGE_BUCKET ?? "property-images";

/**
 * Carpeta dentro del bucket. Importa cuando el bucket se comparte con otro
 * proyecto: asi los archivos de Santerra quedan separados.
 */
export const STORAGE_PREFIX = process.env.NEXT_PUBLIC_STORAGE_PREFIX ?? "santerra";

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
