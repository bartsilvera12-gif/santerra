"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Property } from "@/lib/properties";
import { createClient } from "@/lib/supabase/client";
import { PROPERTY_IMAGES_BUCKET, isSupabaseConfigured } from "@/lib/supabase/config";
import { esUrlDeMapsPermitida, extraerCoordenadas } from "@/lib/maps";
import AdminSelect from "../AdminSelect";
import FileButton from "../FileButton";
import NumberField from "../NumberField";
import { explicarErrorDeSubida } from "../errores";

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

  // Al editar, el campo unico de ciudad arranca con el texto mas completo de
  // los dos que hay guardados, para no perder el detalle ya cargado.
  const [p, setP] = useState<Property>(
    initial ? { ...initial, city: initial.location || initial.city } : EMPTY
  );
  const [featuresText, setFeaturesText] = useState((initial?.features ?? []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mapsUrl, setMapsUrl] = useState("");
  const [ubicando, setUbicando] = useState(false);
  const [mapsMsg, setMapsMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [coordsAMano, setCoordsAMano] = useState(false);
  const [imagenUrl, setImagenUrl] = useState("");

  /**
   * Suma una imagen pegando su URL, sin pasar por el storage.
   * Sirve de escape cuando el bucket no esta disponible.
   */
  function agregarImagenPorUrl() {
    const url = imagenUrl.trim();
    if (!url) return;

    try {
      const u = new URL(url);
      if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error();
    } catch {
      setError("Esa no es una URL válida. Tiene que empezar con https://");
      return;
    }

    if (p.gallery.includes(url)) {
      setError("Esa imagen ya está en la lista.");
      return;
    }

    setError(null);
    setP((prev) => ({
      ...prev,
      gallery: [...prev.gallery, url],
      image: prev.image || url
    }));
    setImagenUrl("");
  }

  /**
   * Resuelve un link de Google Maps y completa latitud y longitud.
   *
   * Primero intenta sacar las coordenadas del link tal cual (los links largos
   * ya las traen). Si no hay, llama a la Edge Function `resolve-maps` de
   * Supabase, que sigue la redireccion de los links cortos (maps.app.goo.gl)
   * y devuelve las coordenadas. No lo podemos hacer desde el navegador
   * directamente por CORS.
   */
  async function ubicarDesdeMaps() {
    const url = mapsUrl.trim();
    if (!url) return;

    setMapsMsg(null);
    setUbicando(true);
    try {
      if (!esUrlDeMapsPermitida(url)) {
        setMapsMsg({
          ok: false,
          text: "El link tiene que ser de Google Maps (google.com/maps o maps.app.goo.gl)."
        });
        return;
      }

      // 1) Intento client-side: los links largos ya traen lat/lng en la URL.
      let coords = extraerCoordenadas(url);

      // 2) Si no hay coords (tipico de los cortos), hay que seguir la
      //    redireccion desde un servidor. Primero el script PHP que viaja con
      //    el sitio (mismo dominio, sin CORS); si no esta disponible, se
      //    prueba la Edge Function de Supabase.
      if (!coords) {
        let ultimoError = "";

        try {
          const res = await fetch("/api/resolve-maps.php", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ url })
          });
          const data = await res.json();
          if (res.ok && typeof data?.lat === "number" && typeof data?.lng === "number") {
            coords = { lat: data.lat, lng: data.lng };
          } else {
            ultimoError = String(data?.error ?? "");
          }
        } catch {
          // En `npm run dev` no hay PHP: se cae al siguiente intento.
        }

        if (!coords && isSupabaseConfigured) {
          try {
            const supabase = createClient();
            const { data, error } = await supabase.functions.invoke("resolve-maps", {
              body: { url }
            });
            if (!error && typeof data?.lat === "number" && typeof data?.lng === "number") {
              coords = { lat: data.lat, lng: data.lng };
            } else if (!ultimoError) {
              ultimoError = error?.message ?? "";
            }
          } catch {
            /* la Edge Function puede no estar desplegada */
          }
        }

        if (!coords) {
          setMapsMsg({
            ok: false,
            text:
              ultimoError ||
              "No se pudo resolver el link corto. Abrilo en Google Maps y copiá el link largo desde la barra de direcciones."
          });
          return;
        }
      }

      if (!coords) {
        setMapsMsg({
          ok: false,
          text:
            "Ese link no trae coordenadas. Abrilo en Google Maps y copiá el link largo desde la barra de direcciones."
        });
        return;
      }

      setP((prev) => ({ ...prev, lat: coords!.lat, lng: coords!.lng }));
      setMapsMsg({
        ok: true,
        text: `Ubicación cargada: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
      });
    } finally {
      setUbicando(false);
    }
  }

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
        setError(`No se pudo subir ${file.name}. ${explicarErrorDeSubida(upErr.message)}`);
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
      // Un solo campo en el formulario alimenta las dos columnas: location es
      // lo que muestra el sitio publico y city lo que usa el buscador.
      location: p.city,
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

    router.push("/admin/propiedades/");
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

        <div>
          <label className={label}>Ciudad</label>
          <input
            required
            value={p.city}
            onChange={(e) => set("city", e.target.value)}
            className={field}
            placeholder="San Bernardino, Cordillera"
          />
          <p className="mt-2 text-[12px] text-santerra-gray-mid">
            Es lo que se muestra bajo el título en las tarjetas y en el detalle.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={label}>Operación</label>
            <AdminSelect
              value={p.operation}
              onChange={(v) => set("operation", v as Property["operation"])}
              options={OPERACIONES.map((o) => ({ value: o, label: o }))}
            />
          </div>
          <div>
            <label className={label}>Tipo</label>
            <AdminSelect
              value={p.type}
              onChange={(v) => set("type", v as Property["type"])}
              options={TIPOS.map((t) => ({ value: t, label: t }))}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-4">
          <div>
            <label className={label}>Dormitorios</label>
            <NumberField
              value={p.beds}
              onChange={(v) => set("beds", v)}
              className={field}
            />
          </div>
          <div>
            <label className={label}>Baños</label>
            <NumberField
              value={p.baths}
              onChange={(v) => set("baths", v)}
              className={field}
            />
          </div>
          <div>
            <label className={label}>Superficie m²</label>
            <NumberField
              value={p.area}
              onChange={(v) => set("area", v)}
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

        {/* ---------- Ubicación en el mapa ---------- */}
        <div className="border-t border-santerra-gray-line pt-6">
          <label className={label}>Link de Google Maps</label>
          <div className="flex flex-wrap gap-3">
            <input
              value={mapsUrl}
              onChange={(e) => setMapsUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  ubicarDesdeMaps();
                }
              }}
              placeholder="https://maps.app.goo.gl/…"
              className={`${field} min-w-[220px] flex-1`}
            />
            <button
              type="button"
              onClick={ubicarDesdeMaps}
              disabled={ubicando}
              className="bg-santerra-graphite px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-white transition hover:bg-santerra-red disabled:opacity-60"
            >
              {ubicando ? "Buscando…" : "Ubicar"}
            </button>
          </div>

          <p className="mt-2 text-[12px] leading-relaxed text-santerra-gray-mid">
            Pegá el link que te da “Compartir” en Google Maps. Sirve tanto el corto
            (<code>maps.app.goo.gl</code>) como el largo.
          </p>

          {mapsMsg && (
            <p
              className={`mt-3 border-l-2 px-4 py-2.5 text-[13px] ${
                mapsMsg.ok
                  ? "border-santerra-graphite bg-santerra-gray text-santerra-graphite"
                  : "border-santerra-red bg-white text-santerra-graphite"
              }`}
            >
              {mapsMsg.text}
            </p>
          )}

          {coordsAMano && (
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
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
          )}

          <div className="mt-5">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <span className={`${label} mb-0`}>Vista previa</span>
              <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.16em]">
                <button
                  type="button"
                  onClick={() => setCoordsAMano((v) => !v)}
                  className="text-santerra-gray-mid transition hover:text-santerra-red"
                >
                  {coordsAMano ? "Ocultar coordenadas" : "Editar a mano"}
                </button>
                <a
                  href={`https://www.google.com/maps/@${p.lat},${p.lng},17z`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-santerra-gray-mid transition hover:text-santerra-red"
                >
                  Abrir en Maps
                </a>
              </div>
            </div>
            <div className="aspect-[16/9] w-full overflow-hidden border border-santerra-gray-line bg-santerra-gray">
              <iframe
                key={`${p.lat},${p.lng}`}
                src={`https://maps.google.com/maps?q=${p.lat},${p.lng}&z=16&t=m&hl=es&output=embed`}
                className="h-full w-full border-0"
                loading="lazy"
                title="Ubicación de la propiedad"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Imágenes y acciones ---------- */}
      <div className="space-y-6">
        <div className="bg-white p-6">
          <label className={label}>Imágenes</label>

          <FileButton onFiles={onUpload} multiple disabled={uploading}>
            {uploading ? "Subiendo…" : "Subir imágenes"}
          </FileButton>

          {/* Alternativa si el storage no esta disponible. */}
          <div className="mt-3 flex gap-2">
            <input
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  agregarImagenPorUrl();
                }
              }}
              placeholder="…o pegá la URL de una imagen"
              className="min-w-0 flex-1 border border-santerra-gray-line bg-white px-3 py-2 text-[13px] text-santerra-graphite outline-none transition focus:border-santerra-red"
            />
            <button
              type="button"
              onClick={agregarImagenPorUrl}
              className="shrink-0 border border-santerra-gray-line px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-santerra-gray-mid transition hover:border-santerra-red hover:text-santerra-red"
            >
              Agregar
            </button>
          </div>

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
            onClick={() => router.push("/admin/propiedades/")}
            className="border border-santerra-gray-line bg-white px-6 py-3.5 text-[12px] uppercase tracking-[0.22em] text-santerra-graphite transition hover:border-santerra-red hover:text-santerra-red"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
