"use client";

import { useEffect, useState } from "react";
import { AJUSTES_POR_DEFECTO, type Ajustes } from "@/lib/settings";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AdminGuard from "../AdminGuard";

export default function AdminContacto() {
  return (
    <AdminGuard>
      <Contenido />
    </AdminGuard>
  );
}

const label = "mb-2 block text-[11px] uppercase tracking-[0.22em] text-santerra-gray-mid";
const field =
  "w-full border border-santerra-gray-line bg-white px-4 py-3 text-[14px] text-santerra-graphite outline-none transition focus:border-santerra-red";
const ayuda = "mt-2 text-[12px] leading-relaxed text-santerra-gray-mid";

function Contenido() {
  const [a, setA] = useState<Ajustes>(AJUSTES_POR_DEFECTO);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    let vivo = true;
    (async () => {
      if (!isSupabaseConfigured) {
        setCargando(false);
        return;
      }
      const supabase = createClient();
      const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
      if (!vivo) return;
      if (data) setA({ ...AJUSTES_POR_DEFECTO, ...(data as Partial<Ajustes>) });
      setCargando(false);
    })();
    return () => {
      vivo = false;
    };
  }, []);

  const set = <K extends keyof Ajustes>(k: K, v: Ajustes[K]) =>
    setA((prev) => ({ ...prev, [k]: v }));

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setMensaje(null);
    setGuardando(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("settings")
      .update({
        phone: a.phone,
        phone_e164: a.phone_e164,
        whatsapp: a.whatsapp,
        email: a.email,
        address: a.address,
        instagram: a.instagram,
        facebook: a.facebook,
        linkedin: a.linkedin
      })
      .eq("id", 1)
      .select("id");

    setGuardando(false);

    if (error) {
      setMensaje({ ok: false, text: `No se pudo guardar: ${error.message}` });
      return;
    }
    if (!data || data.length === 0) {
      setMensaje({
        ok: false,
        text: "No se actualizó ninguna fila. ¿Corriste supabase/008-contacto.sql?"
      });
      return;
    }
    setMensaje({ ok: true, text: "Datos guardados. Ya se ven en el sitio." });
  }

  if (cargando) {
    return (
      <p className="text-[12px] uppercase tracking-[0.22em] text-santerra-gray-mid">Cargando…</p>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-[2px] w-8 bg-santerra-red" />
        <span className="text-[11px] uppercase tracking-[0.28em] text-santerra-gray-mid">Sitio</span>
      </div>
      <h1 className="section-title text-[30px] leading-tight text-santerra-graphite md:text-[40px]">
        Datos de contacto
      </h1>
      <p className="mb-8 mt-3 max-w-2xl text-[14px] leading-relaxed text-santerra-gray-mid">
        Se usan en el pie de página, en la sección de contacto, en el botón de WhatsApp y en cada
        propiedad.
      </p>

      <form onSubmit={guardar} className="max-w-[720px] space-y-6 bg-white p-6 md:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={label}>Teléfono (como se muestra)</label>
            <input value={a.phone} onChange={(e) => set("phone", e.target.value)} className={field} />
          </div>
          <div>
            <label className={label}>Teléfono para llamar</label>
            <input
              value={a.phone_e164}
              onChange={(e) => set("phone_e164", e.target.value)}
              className={field}
              placeholder="+595981401909"
            />
            <p className={ayuda}>Con código de país. Es el que se marca al tocar el número.</p>
          </div>
        </div>

        <div>
          <label className={label}>WhatsApp</label>
          <input
            value={a.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            className={field}
            placeholder="595981401909"
          />
          <p className={ayuda}>Solo números, con código de país y sin el +.</p>
        </div>

        <div>
          <label className={label}>Correo</label>
          <input
            type="email"
            value={a.email}
            onChange={(e) => set("email", e.target.value)}
            className={field}
          />
        </div>

        <div>
          <label className={label}>Dirección</label>
          <input
            value={a.address}
            onChange={(e) => set("address", e.target.value)}
            className={field}
          />
          <p className={ayuda}>Aparece en el pie de página. Dejalo vacío para no mostrarlo.</p>
        </div>

        <div className="space-y-6 border-t border-santerra-gray-line pt-6">
          <p className={label}>Redes sociales</p>
          {(["instagram", "facebook", "linkedin"] as const).map((red) => (
            <div key={red}>
              <label className={label}>{red}</label>
              <input
                value={a[red]}
                onChange={(e) => set(red, e.target.value)}
                className={field}
                placeholder={`https://www.${red}.com/santerra`}
              />
            </div>
          ))}
          <p className={ayuda}>
            Las que dejes vacías no se muestran en el pie de página.
          </p>
        </div>

        {mensaje && (
          <p
            className={`border-l-2 px-4 py-3 text-[13px] ${
              mensaje.ok
                ? "border-santerra-graphite bg-santerra-gray text-santerra-graphite"
                : "border-santerra-red bg-white text-santerra-graphite"
            }`}
          >
            {mensaje.text}
          </p>
        )}

        <button
          type="submit"
          disabled={guardando || !isSupabaseConfigured}
          className="bg-santerra-red px-8 py-3.5 text-[12px] uppercase tracking-[0.22em] text-white transition hover:bg-santerra-red-dark disabled:opacity-60"
        >
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
