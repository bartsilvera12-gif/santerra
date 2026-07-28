"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { EASE, viewportOnce } from "@/lib/animations";
import type { Property } from "@/lib/properties";

export default function PropertyCard({ p, index = 0 }: { p: Property; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, delay: (index % 6) * 0.12, ease: EASE }}
      className="group relative w-full aspect-[16/11] overflow-hidden bg-santerra-graphite"
    >
      <Link href={`/propiedades/${p.id}`} className="block absolute inset-0">
        <motion.img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 group-hover:from-black/90 transition-all duration-500" />

        <span
          className={`absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.22em] font-bold ${
            p.operation === "VENTA" ? "bg-santerra-red" : "bg-santerra-graphite"
          } text-white`}
        >
          {p.operation}
        </span>

        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white">
          <h3 className="section-title text-xl md:text-2xl leading-tight">{p.title}</h3>
          <div className="mt-3 flex items-center flex-wrap gap-x-4 gap-y-1 text-[12px] text-white/80 border-t border-white/20 pt-3">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
              {p.location}
            </span>
            {p.beds > 0 && (<><span className="opacity-40">|</span><span>{p.beds} Dorm.</span></>)}
            {p.baths > 0 && (<><span className="opacity-40">|</span><span>{p.baths} Baños</span></>)}
            <span className="opacity-40">|</span>
            <span>{p.area} m²</span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-santerra-red text-sm font-medium">{p.price}</span>
            <motion.span
              className="flex items-center gap-2 text-white text-[11px] tracking-[0.22em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
            >
              Ver propiedad
              <svg width="14" height="8" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="0" y1="7" x2="20" y2="7" /><polyline points="14 1 20 7 14 13" />
              </svg>
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
