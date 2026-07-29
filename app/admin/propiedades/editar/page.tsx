"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Property } from "@/lib/properties";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AdminGuard from "../../AdminGuard";
import PropertyForm from "../PropertyForm";

export default function EditarPropiedadPage() {
  return (
    <AdminGuard>
      <Contenido />
    </AdminGuard>
  );
}

function Contenido() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      router.replace("/admin/propiedades/");
      return;
    }
    let vivo = true;
    (async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        setNotFound(true);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();
      if (!vivo) return;
      if (!data) {
        setNotFound(true);
      } else {
        setProperty(data as unknown as Property);
      }
      setLoading(false);
    })();
    return () => {
      vivo = false;
    };
  }, [id, router]);

  if (loading) {
    return (
      <p className="text-[12px] uppercase tracking-[0.22em] text-santerra-gray-mid">Cargando…</p>
    );
  }

  if (notFound || !property) {
    return (
      <div>
        <Link
          href="/admin/propiedades/"
          className="text-[11px] uppercase tracking-[0.22em] text-santerra-gray-mid transition hover:text-santerra-red"
        >
          ← Propiedades
        </Link>
        <h1 className="section-title mb-2 mt-4 text-[30px] leading-tight text-santerra-graphite md:text-[40px]">
          No encontramos esa propiedad.
        </h1>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/propiedades/"
        className="text-[11px] uppercase tracking-[0.22em] text-santerra-gray-mid transition hover:text-santerra-red"
      >
        ← Propiedades
      </Link>
      <h1 className="section-title mb-2 mt-4 text-[30px] leading-tight text-santerra-graphite md:text-[40px]">
        {property.title}
      </h1>
      <p className="mb-8 text-[13px] text-santerra-gray-mid">
        /propiedades/<span className="text-santerra-red">{property.id}</span>
      </p>
      <PropertyForm initial={property} />
    </div>
  );
}
