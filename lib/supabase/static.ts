import { createClient } from "@supabase/supabase-js";
import { DB_SCHEMA, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Cliente de Supabase para lecturas en tiempo de build (generateStaticParams,
 * sitemap, paginas publicas). No usa cookies, asi que no depende del contexto
 * de una request y funciona bajo output: "export".
 *
 * Como es solo lectura y con la clave anon, sigue estando cubierto por RLS.
 */
export function createStaticClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: { schema: DB_SCHEMA },
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
