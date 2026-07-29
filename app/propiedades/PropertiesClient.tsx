"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PageHero from "@/components/PageHero";
import PropertyCard from "@/components/PropertyCard";
import type { Property } from "@/lib/properties";
import { fadeUp, viewportOnce } from "@/lib/animations";

const PropertiesMap = dynamic(() => import("@/components/PropertiesMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-santerra-gray border border-santerra-gray-line flex items-center justify-center text-santerra-gray-mid text-sm">
      Cargando mapa…
    </div>
  )
});

const TIPOS = ["Todas", "Casa", "Departamento", "Terreno", "Comercial"] as const;
const OPS = ["Todas", "VENTA", "ALQUILER"] as const;

function normalizeTipo(v: string): (typeof TIPOS)[number] {
  const map: Record<string, (typeof TIPOS)[number]> = {
    Casa: "Casa",
    Departamento: "Departamento",
    Terreno: "Terreno",
    Comercial: "Comercial"
  };
  return map[v] ?? "Todas";
}
function normalizeOp(v: string): (typeof OPS)[number] {
  const up = v.toUpperCase();
  if (up === "VENTA" || up === "ALQUILER") return up;
  return "Todas";
}

export default function PropertiesClient({
  properties,
  initialTipo,
  initialOp,
  initialUbi
}: {
  properties: Property[];
  initialTipo: string;
  initialOp: string;
  initialUbi: string;
}) {
  const [tipo, setTipo] = useState<(typeof TIPOS)[number]>(normalizeTipo(initialTipo));
  const [op, setOp] = useState<(typeof OPS)[number]>(normalizeOp(initialOp));
  const [q, setQ] = useState(initialUbi);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (tipo !== "Todas" && p.type !== tipo) return false;
      if (op !== "Todas" && p.operation !== op) return false;
      if (q && !`${p.title} ${p.location}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [properties, tipo, op, q]);

  return (
    <main>
      <Header forceSolid />
      <PageHero
        eyebrow="Catálogo"
        title="Propiedades disponibles."
        subtitle="Explorá casas, departamentos, terrenos y locales comerciales seleccionados por nuestro equipo."
        image="/images/property-2.png"
      />

      <section className="bg-santerra-gray py-6 md:py-8 border-b border-santerra-gray-line sticky top-[72px] z-30">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10 flex flex-wrap items-center gap-3 md:gap-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título o ubicación"
            className="flex-1 min-w-[220px] bg-white border border-santerra-gray-line px-4 py-3 text-sm outline-none focus:border-santerra-red transition-colors"
          />
          <div className="flex items-center gap-2 flex-wrap">
            {TIPOS.map((t) => (
              <button
                key={t}
                onClick={() => setTipo(t)}
                className={`px-4 py-2 text-[11px] tracking-[0.18em] uppercase border transition-colors ${
                  tipo === t
                    ? "bg-santerra-graphite text-white border-santerra-graphite"
                    : "bg-white text-santerra-graphite border-santerra-gray-line hover:border-santerra-graphite"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {OPS.map((o) => (
              <button
                key={o}
                onClick={() => setOp(o)}
                className={`px-4 py-2 text-[11px] tracking-[0.18em] uppercase border transition-colors ${
                  op === o
                    ? "bg-santerra-red text-white border-santerra-red"
                    : "bg-white text-santerra-graphite border-santerra-gray-line hover:border-santerra-red hover:text-santerra-red"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-santerra-red" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-santerra-gray-mid">Mapa</span>
            </div>
            <PropertiesMap items={filtered} />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="flex items-center justify-between mb-8"
          >
            <motion.p variants={fadeUp} className="text-santerra-gray-mid text-sm">
              {filtered.length} {filtered.length === 1 ? "propiedad" : "propiedades"} encontradas
            </motion.p>
          </motion.div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center text-santerra-gray-mid">
              No hay propiedades con esos filtros.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p, i) => (
                <PropertyCard key={p.id} p={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
