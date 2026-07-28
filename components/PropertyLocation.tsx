"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { EASE, viewportOnce } from "@/lib/animations";

type Tab = "mapa" | "street";

export default function PropertyLocation({
  lat,
  lng,
  location
}: {
  lat: number;
  lng: number;
  location: string;
}) {
  const [tab, setTab] = useState<Tab>("mapa");

  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=15&t=m&hl=es&output=embed`;
  const streetSrc = `https://maps.google.com/maps?q=&layer=c&cbll=${lat},${lng}&cbp=11,0,0,0,0&hl=es&output=svembed`;
  const externalMap = `https://www.google.com/maps/@${lat},${lng},17z`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, ease: EASE }}
      className="mt-14"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-[2px] bg-santerra-red" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-santerra-gray-mid">Ubicación</span>
          </div>
          <h2 className="section-title text-2xl md:text-3xl text-santerra-graphite">{location}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-santerra-gray p-1">
            <button
              onClick={() => setTab("mapa")}
              className={`px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors ${
                tab === "mapa" ? "bg-santerra-graphite text-white" : "text-santerra-graphite hover:text-santerra-red"
              }`}
            >
              Mapa
            </button>
            <button
              onClick={() => setTab("street")}
              className={`px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors ${
                tab === "street" ? "bg-santerra-graphite text-white" : "text-santerra-graphite hover:text-santerra-red"
              }`}
            >
              Street View
            </button>
          </div>
          <a
            href={externalMap}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-santerra-graphite hover:text-santerra-red transition-colors"
          >
            Abrir en Google Maps
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-santerra-graphite border border-santerra-gray-line">
        <AnimatePresence mode="wait">
          <motion.iframe
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            src={tab === "mapa" ? mapSrc : streetSrc}
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title={tab === "mapa" ? "Mapa de ubicación" : "Street View"}
          />
        </AnimatePresence>
      </div>

      <p className="mt-3 text-[12px] text-santerra-gray-mid">
        La ubicación exacta se comparte con clientes calificados. Consultá con un asesor para coordinar una visita.
      </p>
    </motion.div>
  );
}
