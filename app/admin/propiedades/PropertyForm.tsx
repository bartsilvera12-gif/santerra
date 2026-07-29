"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Property } from "@/lib/properties";
import { createClient } from "@/lib/supabase/client";
import { PROPERTY_IMAGES_BUCKET, isSupabaseConfigured } from "@/lib/supabase/config";

const OPERACIONES = ["VENTA", "ALQUILER"] as const;
const TIPOS = ["Casa", "Departamento", "Terreno", "Comercial"] as const;

const EMPTY: Property = {
  id: "",
  title: "",
  location: "",
  city: "",
  beds: 0,
  baths: 0,
  area: 0,
  price: "",
  operation: "VENTA",
  type: "Casa",
  image: "",
  gallery: [],
  description: "",
  features: [],
  lat: -25.2989,
  lng: -57.568
};

/** Convierte un título en un identificador apto para la URL. */
function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

const label = "mb-2 block text-[11px] uppercase tracking-[0.22em] text-santerra-gray-mid";
const field =
  "w-full border border-santerra-gray-line bg-white px-4 py-3 text-[14px] text-santerra-graphite outline-none transition focus:border-santerra-red";

export default function PropertyForm({ initial }: { initial?: Property }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [p, setP] = useState<Property>(initial ?? EMPTY);
  const [featuresText, setFeaturesText] = useState((initial?.features ?? []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Property>(key: K, value: Property[K]) =>
    setP((prev) => ({ ...prev, [key]: value }));

  async function onUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (!isSupabaseConfigured) {
      setError("Configurá Supabase para poder subir imágenes.");
      return;
    }

    setError(null);
    setUploading(true);
    const supabase = createClient();
    const subidas: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${p.id || "sin-id"}/${crypto.randomUUID()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from(PROPERTY_IMAGES_BUCKET)
        .upload(path, file, { cacheControl: "31536000", upsert: false });

      if (upErr) {
        setError(`No se pudo subir ${file.name}: ${upErr.message}`);
        break;
      }

      const { data } = supabase.storage.from(PROPERTY_IMAGES_BUCKET).getPublicUrl(path);
      subidas.push(data.publicUrl);
    }

    if (subidas.length) {
      setP((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...subidas],
        image: prev.image || subidas[0]
      }));
    }
    setUploading(false);
  }

  function quitarImagen(url: string) {
    setP((prev) => {
      const gallery = prev.gallery.filter((g) => g !== url);
      return { ...prev, gallery, image: prev.image === url ? gallery[0] ?? "" : prev.image };
    });
  }

  function moverImagen(url: string, dir: -1 | 1) {
    setP((prev) => {
      const gallery = [...prev.gallery];
      const i = gallery.indexOf(url);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= gallery.length) return prev;
      [gallery[i], gallery[j]] = [gallery[j], gallery[i]];
      return { ...prev, gallery };
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Configurá Supabase para poder guardar.");
      return;
    }

    const id = p.id || slugify(p.title);
    if (!id) {
      setError("Poné un título para poder generar el identificador.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const row = {
      id,
      title: p.title,
      location: p.location,
      city: p.city,
      beds: p.beds,
      baths: p.baths,
      area: p.area,
      price: p.price,
      operation: p.operation,
      type: p.type,
      image: p.image || p.gallery[0] || null,
      gallery: p.gallery,
      description: p.description,
      features: featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      lat: p.lat,
      lng: p.lng
    };

    const { error } = isEdit
      ? await supabase.from("properties").update(row).eq("id", initial!.id)
      : await supabase.from("properties").insert(row);

    setSaving(false);

    if (error) {
      setError(
        error.code === "23505"
          ? "Ya existe una propiedad con ese identificador. Cambiá el título."
          : error.message
      );
      return;
    }

    router.push("/admin/propiedades");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* ---------- Datos ---------- */}
      <div className="space-y-6 bg-white p-6 md:p-8">
        <div>
          <label className={label}>Título</label>
          <input
            required
            value={p.title}
            onChange={(e) => set("title", e.target.value)}
            className={field}
            placeholder="Residencia en San Bernardino"
          />
          {!isEdit && p.title && (
            <p className="mt-2 text-[12px] text-santerra-gray-mid">
              URL: /propiedades/<span className="text-santerra-red">{slugify(p.title)}</span>
            </p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={label}>Ubicación</label>
            <input
              required
              value={p.location}
              onChange={(e) => set("location", e.target.value)}
              className={field}
              placeholder="San Bernardino, Cordillera"
            />
          </div>
          <div>
            <label className={label}>Ciudad</label>
            <input
              required
              value={p.city}
              onChange={(e) => set("city", e.target.value)}
              className={field}
              placeholder="San Bernardino"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={label}>Operación</label>
            <select
              value={p.operation}
              onChange={(e) => set("operation", e.target.value as Property["operation"])}
              className={field}
            >
              {OPERACIONES.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Tipo</label>
            <select
              value={p.type}
              onChange={(e) => set("type", e.target.value as Property["type"])}
              className={field}
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-4">
          <div>
            <label className={label}>Dormitorios</label>
            <input
              type="number"
              min={0}
              value={p.beds}
              onChange={(e) => set("beds", Number(e.target.value))}
              className={field}
            />
          </div>
          <div>
            <label className={label}>Baños</label>
            <input
              type="number"
              min={0}
              value={p.baths}
              onChange={(e) => set("baths", Number(e.target.value))}
              className={field}
            />
          </div>
          <div>
            <label className={label}>Superficie m²</label>
            <input
              type="number"
              min={0}
              value={p.area}
              onChange={(e) => set("area", Number(e.target.value))}
              className={field}
            />
          </div>
          <div>
            <label className={label}>Precio</label>
            <input
              required
              value={p.price}
              onChange={(e) => set("price", e.target.value)}
              className={field}
              placeholder="USD 690.000"
            />
          </div>
        </div>

        <div>
          <label className={label}>Descripción</label>
          <textarea
            rows={5}
            value={p.description}
            onChange={(e) => set("description", e.target.value)}
            className={`${field} resize-y`}
          />
        </div>

        <div>
          <label className={label}>Características (una por línea)</label>
          <textarea
            rows={6}
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            className={`${field} resize-y`}
            placeholder={"Piscina\nCochera x2\nParrillero"}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={label}>Latitud</label>
            <input
              type="number"
              step="any"
              value={p.lat}
              onChange={(e) => set("lat", Number(e.target.value))}
              className={field}
            />
          </div>
          <div>
            <label className={label}>Longitud</label>
            <input
              type="number"
              step="any"
              value={p.lng}
              onChange={(e) => set("lng", Number(e.target.value))}
              className={field}
            />
          </div>
        </div>
      </div>

      {/* ---------- Imágenes y acciones ---------- */}
      <div className="space-y-6">
        <div className="bg-white p-6">
          <label className={label}>Imágenes</label>

          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(e) => onUpload(e.target.files)}
            className="w-full text-[13px] text-santerra-gray-mid file:mr-4 file:border-0 file:bg-santerra-graphite file:px-4 file:py-2.5 file:text-[11px] file:uppercase file:tracking-[0.18em] file:text-white hover:file:bg-santerra-red"
          />
          {uploading && (
            <p className="mt-3 text-[12px] text-santerra-gray-mid">Subiendo imágenes…</p>
          )}

          <div className="mt-5 space-y-3">
            {p.gallery.map((url, i) => (
              <div key={url} className="flex items-center gap-3">
                <img src={url} alt="" className="h-14 w-20 shrink-0 object-cover" />
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => set("image", url)}
                    className={`text-[11px] uppercase tracking-[0.16em] transition ${
                      p.image === url
                        ? "text-santerra-red"
                        : "text-santerra-gray-mid hover:text-santerra-graphite"
                    }`}
                  >
                    {p.image === url ? "Portada" : "Usar de portada"}
                  </button>
                </div>
                <div className="flex items-center gap-1 text-santerra-gray-mid">
                  <button
                    type="button"
                    onClick={() => moverImagen(url, -1)}
                    disabled={i === 0}
                    aria-label="Subir"
                    className="px-2 py-1 transition hover:text-santerra-red disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moverImagen(url, 1)}
                    disabled={i === p.gallery.length - 1}
                    aria-label="Bajar"
                    className="px-2 py-1 transition hover:text-santerra-red disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => quitarImagen(url)}
                    aria-label="Quitar"
                    className="px-2 py-1 transition hover:text-santerra-red"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {p.gallery.length === 0 && (
              <p className="text-[13px] text-santerra-gray-mid">Todavía no cargaste imágenes.</p>
            )}
          </div>
        </div>

        {error && (
          <p className="border-l-2 border-santerra-red bg-white px-4 py-3 text-[13px] text-santerra-graphite">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-santerra-red px-6 py-3.5 text-[12px] uppercase tracking-[0.22em] text-white transition hover:bg-santerra-red-dark disabled:opacity-60"
          >
            {saving ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear propiedad"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/propiedades")}
            className="border border-santerra-gray-line bg-white px-6 py-3.5 text-[12px] uppercase tracking-[0.22em] text-santerra-graphite transition hover:border-santerra-red hover:text-santerra-red"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
