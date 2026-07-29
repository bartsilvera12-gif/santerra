"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  PROPERTY_IMAGES_BUCKET,
  STORAGE_PREFIX,
  isSupabaseConfigured
} from "@/lib/supabase/config";
import type { Category } from "@/lib/supabase/queries";
import FileButton from "../FileButton";
import { explicarErrorDeSubida } from "../errores";

const label = "mb-2 block text-[11px] uppercase tracking-[0.22em] text-santerra-gray-mid";
const field =
  "w-full border border-santerra-gray-line bg-white px-4 py-3 text-[14px] text-santerra-graphite outline-none transition focus:border-santerra-red";

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoriesEditor({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [cats, setCats] = useState(initial);
  const [nuevo, setNuevo] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = () => createClient();

  function guard() {
    if (!isSupabaseConfigured) {
      setError("Configurá Supabase para poder editar las categorías.");
      return false;
    }
    return true;
  }

  async function agregar(e: React.FormEvent) {
    e.preventDefault();
    if (!guard() || !nuevo.trim()) return;

    setError(null);
    setBusy("nuevo");
    const { error } = await supabase()
      .from("categories")
      .insert({
        slug: slugify(nuevo),
        title: nuevo.trim(),
        sort_order: cats.length + 1
      });
    setBusy(null);

    if (error) {
      setError(error.code === "23505" ? "Ya existe una categoría con ese nombre." : error.message);
      return;
    }
    setNuevo("");
    router.refresh();
  }

  async function guardar(c: Category) {
    if (!guard()) return;
    setError(null);
    setBusy(c.id);
    const { error } = await supabase()
      .from("categories")
      .update({ title: c.title, image: c.image, sort_order: c.sort_order })
      .eq("id", c.id);
    setBusy(null);
    if (error) setError(error.message);
    else router.refresh();
  }

  async function borrar(c: Category) {
    if (!guard()) return;
    if (!confirm(`¿Borrar la categoría "${c.title}"?`)) return;
    setError(null);
    setBusy(c.id);
    const { error } = await supabase().from("categories").delete().eq("id", c.id);
    setBusy(null);
    if (error) setError(error.message);
    else router.refresh();
  }

  async function subirImagen(c: Category, file: File | null) {
    if (!file || !guard()) return;
    setError(null);
    setBusy(c.id);

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${STORAGE_PREFIX}/categorias/${c.slug}-${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase()
      .storage.from(PROPERTY_IMAGES_BUCKET)
      .upload(path, file, { cacheControl: "31536000" });

    if (upErr) {
      setBusy(null);
      setError(explicarErrorDeSubida(upErr.message));
      return;
    }

    const { data } = supabase().storage.from(PROPERTY_IMAGES_BUCKET).getPublicUrl(path);
    setCats((prev) => prev.map((x) => (x.id === c.id ? { ...x, image: data.publicUrl } : x)));
    setBusy(null);
  }

  const set = (id: string, patch: Partial<Category>) =>
    setCats((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  return (
    <div className="space-y-6">
      {!isSupabaseConfigured && (
        <p className="border-l-2 border-santerra-red bg-white px-4 py-3 text-[13px] text-santerra-gray-mid">
          Datos de ejemplo: sin credenciales de Supabase no se puede editar.
        </p>
      )}
      {error && (
        <p className="border-l-2 border-santerra-red bg-white px-4 py-3 text-[13px] text-santerra-graphite">
          {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {cats.map((c) => (
          <div key={c.id} className="flex gap-5 bg-white p-5">
            <div className="w-28 shrink-0">
              {c.image ? (
                <img src={c.image} alt="" className="aspect-[4/5] w-full object-cover" />
              ) : (
                <div className="flex aspect-[4/5] w-full items-center justify-center bg-santerra-gray text-[11px] text-santerra-gray-mid">
                  Sin imagen
                </div>
              )}
              <FileButton
                onFiles={(files) => subirImagen(c, files?.[0] ?? null)}
                disabled={busy === c.id}
                className="mt-2"
              >
                {c.image ? "Cambiar" : "Subir"}
              </FileButton>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <label className={label}>Nombre</label>
                <input
                  value={c.title}
                  onChange={(e) => set(c.id, { title: e.target.value })}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>Orden</label>
                <input
                  type="number"
                  value={c.sort_order}
                  onChange={(e) => set(c.id, { sort_order: Number(e.target.value) })}
                  className={field}
                />
              </div>
              <div className="flex gap-4 text-[11px] uppercase tracking-[0.16em]">
                <button
                  onClick={() => guardar(c)}
                  disabled={busy === c.id}
                  className="text-santerra-red transition hover:text-santerra-red-dark disabled:opacity-40"
                >
                  {busy === c.id ? "Guardando…" : "Guardar"}
                </button>
                <button
                  onClick={() => borrar(c)}
                  disabled={busy === c.id}
                  className="text-santerra-gray-mid transition hover:text-santerra-red disabled:opacity-40"
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={agregar} className="flex flex-wrap gap-3 bg-white p-5">
        <input
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          placeholder="Nombre de la nueva categoría"
          className={`${field} min-w-[240px] flex-1`}
        />
        <button
          type="submit"
          disabled={busy === "nuevo"}
          className="bg-santerra-red px-6 py-3 text-[12px] uppercase tracking-[0.22em] text-white transition hover:bg-santerra-red-dark disabled:opacity-60"
        >
          {busy === "nuevo" ? "Agregando…" : "Agregar"}
        </button>
      </form>
    </div>
  );
}
