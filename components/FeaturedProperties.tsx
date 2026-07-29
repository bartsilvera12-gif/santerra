"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { fadeUp, staggerCards, viewportOnce, EASE } from "@/lib/animations";
import type { Property } from "@/lib/properties";

function Card({ p, index }: { p: Property; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, delay: index * 0.15, ease: EASE }}
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

          <motion.div
            className="mt-4 flex items-center gap-3 text-santerra-red text-[12px] tracking-[0.18em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          >
            Ver propiedad
            <svg width="16" height="10" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="0" y1="7" x2="22" y2="7" /><polyline points="16 1 22 7 16 13" />
            </svg>
          </motion.div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function FeaturedProperties({ properties }: { properties: Property[] }) {
  const items = properties.slice(0, 5);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };

  return (
    <section id="propiedades" className="relative bg-santerra-black text-white py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, #C52A42 0 1px, transparent 1px 26px)" }}
      />

      <div className="relative max-w-[1320px] mx-auto px-5 md:px-10">
        <motion.div
          variants={staggerCards}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex items-end justify-between mb-10 md:mb-14 gap-4"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-4">
            <div className="w-8 h-[2px] bg-santerra-red" />
            <h2 className="section-title text-[28px] md:text-[42px] tracking-wide uppercase">Propiedades Destacadas</h2>
          </motion.div>

          <motion.div variants={fadeUp} className="hidden sm:flex items-center gap-3">
            <Link
              href="/propiedades"
              className="text-[11px] tracking-[0.22em] uppercase text-white/70 hover:text-santerra-red transition"
            >
              Ver todas
            </Link>
            <button
              onClick={() => scrollBy(-1)}
              className="w-11 h-11 rounded-full border border-white/25 flex items-center justify-center hover:border-santerra-red hover:text-santerra-red transition-colors duration-300"
              aria-label="Anterior"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="w-11 h-11 rounded-full border border-santerra-red text-santerra-red flex items-center justify-center hover:bg-santerra-red hover:text-white transition-colors duration-300"
              aria-label="Siguiente"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </motion.div>
        </motion.div>

        <div
          ref={trackRef}
          onMouseDown={(e) => {
            const el = trackRef.current;
            if (!el) return;
            setDragging(true);
            const startX = e.pageX - el.offsetLeft;
            const startScroll = el.scrollLeft;
            const move = (ev: MouseEvent) => {
              el.scrollLeft = startScroll - (ev.pageX - el.offsetLeft - startX);
            };
            const up = () => {
              setDragging(false);
              window.removeEventListener("mousemove", move);
              window.removeEventListener("mouseup", up);
            };
            window.addEventListener("mousemove", move);
            window.addEventListener("mouseup", up);
          }}
          className={`no-scrollbar flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-4 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ scrollBehavior: "smooth" }}
        >
          {items.map((p, i) => (
            <div
              key={p.id}
              className="snap-start flex-shrink-0 w-[86%] sm:w-[60%] md:w-[46%] lg:w-[38%]"
            >
              <Card p={p} index={i} />
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <p className="py-16 text-center text-white/50">
            Todavía no hay propiedades publicadas.
          </p>
        )}

        <div className="mt-8 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <div key={i} className={`h-[3px] ${i === 0 ? "w-8 bg-santerra-red" : "w-6 bg-white/25"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
