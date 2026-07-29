"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AdminGuard from "../AdminGuard";
import CategoriesEditor from "./CategoriesEditor";

export default function AdminCategorias() {
  return (
    <AdminGuard>
      <Contenido />
    </AdminGuard>
  );
}

function Contenido() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let vivo = true;
    (async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!vivo) return;
      setCats((data ?? []) as Category[]);
      setLoading(false);
    })();
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-[2px] w-8 bg-santerra-red" />
        <span className="text-[11px] uppercase tracking-[0.28em] text-santerra-gray-mid">Home</span>
      </div>
      <h1 className="section-title text-[30px] leading-tight text-santerra-graphite md:text-[40px]">
        Categorías
      </h1>
      <p className="mb-8 mt-3 max-w-2xl text-[14px] leading-relaxed text-santerra-gray-mid">
        Son las tarjetas de la sección “Oportunidades” del inicio. El conteo de propiedades se
        calcula solo.
      </p>

      {loading ? (
        <p className="text-[12px] uppercase tracking-[0.22em] text-santerra-gray-mid">Cargando…</p>
      ) : (
        <CategoriesEditor initial={cats} />
      )}
    </div>
  );
}
