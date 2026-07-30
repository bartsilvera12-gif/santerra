"use client";

import { useEffect, useState } from "react";
import { createClient } from "./supabase/client";
import { isSupabaseConfigured } from "./supabase/config";

export type Ajustes = {
  phone: string;
  phone_e164: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  facebook: string;
  linkedin: string;
};

/**
 * Valores por defecto. Son los que el sitio mostraba escritos a mano, y
 * siguen sirviendo de respaldo si la consulta falla o la tabla esta vacia.
 */
export const AJUSTES_POR_DEFECTO: Ajustes = {
  phone: "0981 401 909",
  phone_e164: "+595981401909",
  whatsapp: "595981401909",
  email: "hola@santerra.com.py",
  address: "Asunción, Paraguay",
  instagram: "",
  facebook: "",
  linkedin: ""
};

// Una sola consulta por carga de pagina, compartida entre los componentes
// que la piden (footer, contacto, boton de WhatsApp).
let cache: Promise<Ajustes> | null = null;

async function traerAjustes(): Promise<Ajustes> {
  if (!isSupabaseConfigured) return AJUSTES_POR_DEFECTO;

  const supabase = createClient();
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();

  if (error || !data) return AJUSTES_POR_DEFECTO;
  return { ...AJUSTES_POR_DEFECTO, ...(data as Partial<Ajustes>) };
}

/** Datos de contacto del sitio, editables desde el panel. */
export function useAjustes(): Ajustes {
  const [ajustes, setAjustes] = useState<Ajustes>(AJUSTES_POR_DEFECTO);

  useEffect(() => {
    let vivo = true;
    cache = cache ?? traerAjustes();
    cache.then((a) => {
      if (vivo) setAjustes(a);
    });
    return () => {
      vivo = false;
    };
  }, []);

  return ajustes;
}

/** Link de WhatsApp con un mensaje opcional. */
export function linkWhatsApp(numero: string, mensaje?: string): string {
  const base = `https://wa.me/${numero.replace(/\D/g, "")}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
