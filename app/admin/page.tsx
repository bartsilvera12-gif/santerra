"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Property } from "@/lib/properties";
import type { Category } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AdminGuard from "./AdminGuard";

export default function AdminHome() {
  return (
    <AdminGuard>
      <Dashboard />
    </AdminGuard>
  );
}

function Dashboard() {
  const [items, setItems] = useState<Property[]>([]);
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
      const [props, catsRes] = await Promise.all([
        supabase.from("properties").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("sort_order", { ascending: true })
      ]);
      if (!vivo) return;
      setItems((props.data ?? []) as unknown as Property[]);
      setCats((catsRes.data ?? []) as Category[]);
      setLoading(false);
    })();
    return () => {
      vivo = false;
    };
  }, []);

  const enVenta = items.filter((p) => p.operation === "VENTA").length;
  const enAlquiler = items.filter((p) => p.operation === "ALQUILER").length;

  const stats = [
    { label: "Propiedades", value: items.length, href: "/admin/propiedades" },
    { label: "En venta", value: enVenta, href: "/admin/propiedades?op=VENTA" },
    { label: "En alquiler", value: enAlquiler, href: "/admin/propiedades?op=ALQUILER" },
    { label: "Categorías", value: cats.length, href: "/admin/categorias" }
  ];

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-[2px] w-8 bg-santerra-red" />
        <span className="text-[11px] uppercase tracking-[0.28em] text-santerra-gray-mid">Panel</span>
      </div>
      <h1 className="section-title text-[30px] leading-tight text-santerra-graphite md:text-[40px]">
        Resumen
      </h1>

      {!isSupabaseConfigured && (
        <div className="mt-8 border-l-2 border-santerra-red bg-white p-6 text-[14px] leading-relaxed text-santerra-gray-mid">
          <p className="section-title mb-2 text-lg text-santerra-graphite">
            Supabase todavía no está configurado
          </p>
          <p>
            Estás viendo el panel vacío. Los cambios que hagas no se van a guardar hasta
            completar <code className="text-santerra-red">.env.local</code> con las credenciales del
            proyecto.
          </p>
        </div>
      )}

      <div className="mt-10 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group border-t-2 border-santerra-red bg-white p-6 transition hover:shadow-[0_8px_24px_-16px_rgba(0,0,0,0.35)]"
          >
            <div className="section-title text-[38px] leading-none text-santerra-graphite">
              {loading ? "—" : s.value}
            </div>
            <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-santerra-gray-mid">
              {s.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/admin/propiedades/nueva"
          className="bg-santerra-red px-6 py-3.5 text-[12px] uppercase tracking-[0.22em] text-white transition hover:bg-santerra-red-dark"
        >
          Cargar propiedad
        </Link>
        <Link
          href="/admin/propiedades"
          className="border border-santerra-gray-line bg-white px-6 py-3.5 text-[12px] uppercase tracking-[0.22em] text-santerra-graphite transition hover:border-santerra-red hover:text-santerra-red"
        >
          Ver todas
        </Link>
      </div>
    </div>
  );
}
