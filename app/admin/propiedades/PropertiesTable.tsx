"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Property } from "@/lib/properties";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import AdminSelect from "../AdminSelect";
import Confirmar from "../Confirmar";

export default function PropertiesTable({ items }: { items: Property[] }) {
  const [q, setQ] = useState("");
  const [op, setOp] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [porBorrar, setPorBorrar] = useState<Property | null>(null);

  // La lista se mantiene en estado propio: en el sitio estatico no hay
  // servidor que re-renderice, asi que router.refresh() no haria nada y los
  // cambios no se verian hasta recargar a mano.
  const [lista, setLista] = useState(items);
  useEffect(() => setLista(items), [items]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return lista.filter((p) => {
      if (op && p.operation !== op) return false;
      if (!term) return true;
      return (
        p.title.toLowerCase().includes(term) ||
        p.location.toLowerCase().includes(term) ||
        p.city.toLowerCase().includes(term)
      );
    });
  }, [lista, q, op]);

  async function borrar(p: Property) {
    setError(null);
    setBusyId(p.id);

    const supabase = createClient();
    // El .select() es necesario: sin el, cuando RLS bloquea el borrado
    // PostgREST responde "todo bien" con cero filas afectadas, y la propiedad
    // parece borrarse aunque siga en la base.
    const { data, error } = await supabase
      .from("properties")
      .delete()
      .eq("id", p.id)
      .select("id");

    setBusyId(null);
    setPorBorrar(null);

    if (error) {
      setError(`No se pudo borrar: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      setError(
        "No se borró ninguna fila. Tu usuario no tiene permiso: revisá que el correo esté en santerra.is_admin()."
      );
      return;
    }

    setLista((prev) => prev.filter((x) => x.id !== p.id));
  }

  async function alternarDestacada(p: Property) {
    setError(null);
    setBusyId(p.id);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("properties")
      .update({ featured: !p.featured })
      .eq("id", p.id)
      .select("id");

    setBusyId(null);

    if (error) {
      setError(`No se pudo cambiar: ${error.message}`);
      return;
    }
    if (!data || data.length === 0) {
      setError("No se actualizó ninguna fila. Revisá los permisos de tu usuario.");
      return;
    }

    setLista((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, featured: !p.featured } : x))
    );
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
              <th className="px-5 py-4 text-center font-normal">Destacada</th>
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
                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => alternarDestacada(p)}
                    disabled={busyId === p.id || !isSupabaseConfigured}
                    aria-pressed={Boolean(p.featured)}
                    title={p.featured ? "Quitar de destacadas" : "Marcar como destacada"}
                    className={`transition disabled:opacity-40 ${
                      p.featured
                        ? "text-santerra-red"
                        : "text-santerra-gray-line hover:text-santerra-gray-mid"
                    }`}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill={p.featured ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m12 3.5 2.6 5.7 6.2.7-4.6 4.2 1.3 6.1L12 17.1 6.5 20.2l1.3-6.1L3.2 9.9l6.2-.7z" />
                    </svg>
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-4 text-[12px] uppercase tracking-[0.16em]">
                    <Link
                      href={`/admin/propiedades/editar/?id=${encodeURIComponent(p.id)}`}
                      className="text-santerra-gray-mid transition hover:text-santerra-red"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => setPorBorrar(p)}
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
                <td colSpan={6} className="px-5 py-16 text-center text-santerra-gray-mid">
                  No hay propiedades que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[12px] text-santerra-gray-mid">
        {filtered.length} de {lista.length} propiedades
      </p>

      <Confirmar
        abierto={porBorrar !== null}
        titulo={`¿Borrar “${porBorrar?.title ?? ""}”?`}
        detalle="La propiedad y sus datos se eliminan de la base. Esta acción no se puede deshacer."
        trabajando={busyId !== null && busyId === porBorrar?.id}
        onCancelar={() => setPorBorrar(null)}
        onConfirmar={() => porBorrar && borrar(porBorrar)}
      />
    </div>
  );
}
