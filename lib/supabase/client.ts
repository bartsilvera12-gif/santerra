"use client";

import { createBrowserClient } from "@supabase/ssr";
import { DB_SCHEMA, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/** Cliente de Supabase para componentes que corren en el navegador. */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: { schema: DB_SCHEMA }
  });
}
