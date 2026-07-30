"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyCard from "@/components/PropertyCard";
import PropertyLocation from "@/components/PropertyLocation";
import type { Property } from "@/lib/properties";
import { usePropiedad, usePropiedades } from "@/lib/supabase/useLiveData";
import { linkWhatsApp, useAjustes } from "@/lib/settings";

/**
 * Detalle de una propiedad.
 *
 * Es un componente de cliente a proposito: el sitio se publica como export
 * estatico, asi que sin esto mostraria siempre los datos del ultimo build.
 * Ademas permite abrir propiedades creadas despues de esa publicacion, que
 * no tienen pagina generada.
 */
export default function PropertyDetail({
  id,
  initial
}: {
  id: string;
  initial?: Property;
}) {
  const { item: p, buscando } = usePropiedad(id, initial);
  const ajustes = useAjustes();
  const todas = usePropiedades([]);

  if (buscando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-[11px] uppercase tracking-[0.28em] text-santerra-gray-mid">
        Cargando…
      </main>
    );
  }

  if (!p) {
    return (
      <main>
        <Header forceSolid />
        <section className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
          <h1 className="section-title text-[32px] text-santerra-graphite">
            No encontramos esa propiedad
          </h1>
          <p className="mt-3 text-santerra-gray-mid">
            Puede que ya no esté publicada.
          </p>
          <Link
            href="/propiedades"
            className="mt-8 bg-santerra-red px-8 py-4 text-[12px] uppercase tracking-[0.22em] text-white transition hover:bg-santerra-red-dark"
          >
            Ver todas las propiedades
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  const related = todas.filter((x) => x.id !== p.id && x.type === p.type).slice(0, 3);

  return (
    <main>
      <Header forceSolid />

      <section className="pt-28 md:pt-32 pb-8 bg-white">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10">
          <nav className="text-[11px] tracking-[0.2em] uppercase text-santerra-gray-mid">
            <Link href="/" className="hover:text-santerra-red transition">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/propiedades" className="hover:text-santerra-red transition">Propiedades</Link>
            <span className="mx-2">/</span>
            <span className="text-santerra-graphite">{p.title}</span>
          </nav>
        </div>
      </section>

      <PropertyGallery images={p.gallery} title={p.title} operation={p.operation} />

      <section className="bg-white py-12 md:py-16">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10 grid lg:grid-cols-[1.6fr_1fr] gap-10 md:gap-16">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-[2px] bg-santerra-red" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-santerra-gray-mid">{p.type}</span>
            </div>
            <h1 className="section-title text-[32px] md:text-[46px] leading-[1.05] text-santerra-graphite">
              {p.title}
            </h1>
            <p className="mt-3 text-santerra-gray-mid text-[15px]">{p.location}</p>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Superficie", value: `${p.area} m²` },
                { label: "Dormitorios", value: p.beds > 0 ? p.beds : "—" },
                { label: "Baños", value: p.baths > 0 ? p.baths : "—" },
                { label: "Operación", value: p.operation }
              ].map((item) => (
                <div key={item.label} className="border-t border-santerra-gray-line pt-3">
                  <div className="text-[10px] tracking-[0.24em] uppercase text-santerra-gray-mid">{item.label}</div>
                  <div className="text-santerra-graphite text-lg font-medium mt-1">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="section-title text-2xl md:text-3xl text-santerra-graphite">Descripción</h2>
              <p className="mt-4 text-santerra-gray-mid text-[15px] leading-relaxed">{p.description}</p>
            </div>

            <div className="mt-12">
              <h2 className="section-title text-2xl md:text-3xl text-santerra-graphite">Características</h2>
              <ul className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-santerra-graphite text-[15px] border-b border-santerra-gray-line py-2">
                    <span className="w-1.5 h-1.5 bg-santerra-red" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <PropertyLocation lat={p.lat} lng={p.lng} location={p.location} />
          </div>

          <aside className="lg:sticky lg:top-28 h-fit">
            <div className="bg-santerra-graphite text-white p-8">
              <div className="text-[11px] tracking-[0.24em] uppercase text-white/60">{p.operation}</div>
              <div className="section-title text-4xl mt-1 text-santerra-red">{p.price}</div>
              <div className="mt-6 text-sm text-white/70">
                Consultá con un asesor de Santerra y coordiná una visita sin compromiso.
              </div>
              <a
                href={linkWhatsApp(ajustes.whatsapp, `Hola, me interesa la propiedad "${p.title}"`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-3 w-full bg-santerra-red hover:bg-santerra-red-dark transition-colors text-white py-4 text-[12px] tracking-[0.22em] uppercase"
              >
                Consultar por WhatsApp
              </a>
              <Link
                href="/contacto"
                className="mt-3 flex items-center justify-center gap-3 w-full border border-white/25 hover:border-white text-white py-4 text-[12px] tracking-[0.22em] uppercase transition-colors"
              >
                Solicitar visita
              </Link>
              <div className="mt-6 pt-6 border-t border-white/10 text-sm">
                <div className="text-white/60 text-[11px] tracking-[0.2em] uppercase">Contacto directo</div>
                <a href={`tel:${ajustes.phone_e164}`} className="mt-1 block hover:text-santerra-red transition">{ajustes.phone}</a>
                <a href={`mailto:${ajustes.email}`} className="hover:text-santerra-red transition">{ajustes.email}</a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-santerra-gray py-16 md:py-20">
          <div className="max-w-[1320px] mx-auto px-5 md:px-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-[2px] bg-santerra-red" />
              <h2 className="section-title text-2xl md:text-3xl text-santerra-graphite">Propiedades similares</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r, i) => (
                <PropertyCard key={r.id} p={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
