"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Property } from "@/lib/properties";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AdminGuard from "../AdminGuard";
import PropertiesTable from "./PropertiesTable";

export default function AdminPropiedades() {
  return (
    <AdminGuard>
      <Contenido />
    </AdminGuard>
  );
}

function Contenido() {
  const [items, setItems] = useState<Property[]>([]);
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
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (!vivo) return;
      setItems((data ?? []) as unknown as Property[]);
      setLoading(false);
    })();
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="h-[2px] w-8 bg-santerra-red" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-santerra-gray-mid">
              Catálogo
            </span>
          </div>
          <h1 className="section-title text-[30px] leading-tight text-santerra-graphite md:text-[40px]">
            Propiedades
          </h1>
        </div>
        <Link
          href="/admin/propiedades/nueva"
          className="bg-santerra-red px-6 py-3.5 text-[12px] uppercase tracking-[0.22em] text-white transition hover:bg-santerra-red-dark"
        >
          Cargar propiedad
        </Link>
      </div>

      {loading ? (
        <p className="text-[12px] uppercase tracking-[0.22em] text-santerra-gray-mid">Cargando…</p>
      ) : (
        <PropertiesTable items={items} />
      )}
    </div>
  );
}
