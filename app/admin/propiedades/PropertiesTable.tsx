"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { Property } from "@/lib/properties";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AdminSelect from "../AdminSelect";

export default function PropertiesTable({ items }: { items: Property[] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [op, setOp] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((p) => {
      if (op && p.operation !== op) return false;
      if (!term) return true;
      return (
        p.title.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.city.toLowerCase().includes(term)
      );
    });
  }, [items, q, op]);

  async function remove(p: Property) {
    if (!confirm(`¿Borrar "${p.title}"? Esta acción no se puede deshacer.`)) return;

    setError(null);
    setBusyId(p.id);
    const supabase = createClient();
    const { error } = await supabase.from("properties").delete().eq("id", p.id);
    setBusyId(null);

    if (error) {
      setError(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título, ubicación o ciudad…"
          className="min-w-[240px] flex-1 border border-santerra-gray-line bg-white px-4 py-3 text-[14px] text-santerra-graphite outline-none transition focus:border-santerra-red"
        />
        <AdminSelect
          value={op}
          onChange={setOp}
          placeholder="Todas las operaciones"
          options={[
            { value: "VENTA", label: "Venta" },
            { value: "ALQUILER", label: "Alquiler" }
          ]}
          className="min-w-[220px]"
        />
      </div>

      {!isSupabaseConfigured && (
        <p className="mb-6 border-l-2 border-santerra-red bg-white px-4 py-3 text-[13px] text-santerra-gray-mid">
          Datos de ejemplo: sin credenciales de Supabase no se puede editar ni borrar.
        </p>
      )}

      {error && (
        <p className="mb-6 border-l-2 border-santerra-red bg-white px-4 py-3 text-[13px] text-santerra-graphite">
          {error}
        </p>
      )}

      <div className="overflow-x-auto bg-white">
        <table className="w-full min-w-[760px] text-left text-[14px]">
          <thead>
            <tr className="border-b border-santerra-gray-line text-[10px] uppercase tracking-[0.22em] text-santerra-gray-mid">
              <th className="px-5 py-4 font-normal">Propiedad</th>
              <th className="px-5 py-4 font-normal">Tipo</th>
              <th className="px-5 py-4 font-normal">Operación</th>
              <th className="px-5 py-4 font-normal">Precio</th>
              <th className="px-5 py-4 font-normal" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b border-santerra-gray-line last:border-0 hover:bg-santerra-gray/60"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={p.image}
                      alt=""
                      className="h-12 w-16 shrink-0 object-cover"
                      loading="lazy"
                    />
                    <div>
                      <div className="font-medium text-santerra-graphite">{p.title}</div>
                      <div className="text-[12px] text-santerra-gray-mid">{p.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-santerra-gray-mid">{p.type}</td>
                <td className="px-5 py-4">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-white ${
                      p.operation === "VENTA" ? "bg-santerra-red" : "bg-santerra-graphite"
                    }`}
                  >
                    {p.operation}
                  </span>
                </td>
                <td className="px-5 py-4 text-santerra-graphite">{p.price}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-4 text-[12px] uppercase tracking-[0.16em]">
                    <Link
                      href={`/admin/propiedades/editar/?id=${encodeURIComponent(p.id)}`}
                      className="text-santerra-gray-mid transition hover:text-santerra-red"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => remove(p)}
                      disabled={busyId === p.id || !isSupabaseConfigured}
                      className="text-santerra-gray-mid transition hover:text-santerra-red disabled:opacity-40"
                    >
                      {busyId === p.id ? "Borrando…" : "Borrar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-santerra-gray-mid">
                  No hay propiedades que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[12px] text-santerra-gray-mid">
        {filtered.length} de {items.length} propiedades
      </p>
    </div>
  );
}
