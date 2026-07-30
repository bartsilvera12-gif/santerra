"use client";

import { useEffect, useState } from "react";
import type { Property } from "@/lib/properties";
import { createClient } from "./client";
import { isSupabaseConfigured } from "./config";
import { toProperty } from "./mapper";
import type { Category } from "./queries";

/**
 * El sitio se publica como export estatico: los datos que trae getProperties()
 * quedan congelados en el HTML del momento del build. Sin esto, una propiedad
 * cargada desde el panel no aparece hasta volver a compilar y subir.
 *
 * Se arranca con lo que vino del build (se ve al instante y lo indexa Google)
 * y apenas monta el componente se pide la version actual a Supabase.
 */
export function usePropiedades(iniciales: Property[]) {
  const [items, setItems] = useState(iniciales);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let vivo = true;

    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

      // Ante un error se deja lo del build, que es mejor que vaciar la pagina.
      if (!vivo || error || !data) return;
      setItems(data.map(toProperty));
    })();

    return () => {
      vivo = false;
    };
  }, []);

  return items;
}

/** Misma idea para una sola propiedad, en la pagina de detalle. */
export function usePropiedad(id: string, inicial?: Property) {
  const [item, setItem] = useState(inicial);
  const [buscando, setBuscando] = useState(!inicial);

  useEffect(() => {
    if (!isSupabaseConfigured || !id) {
      setBuscando(false);
      return;
    }
    let vivo = true;

    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .eq("published", true)
        .maybeSingle();

      if (!vivo) return;
      if (data) setItem(toProperty(data));
      setBuscando(false);
    })();

    return () => {
      vivo = false;
    };
  }, [id]);

  return { item, buscando };
}

/** Categorias frescas, para el conteo de las tarjetas del inicio. */
export function useCategorias(iniciales: Category[]) {
  const [cats, setCats] = useState(iniciales);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let vivo = true;

    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!vivo || error || !data || data.length === 0) return;
      setCats(data as Category[]);
    })();

    return () => {
      vivo = false;
    };
  }, []);

  return cats;
}
