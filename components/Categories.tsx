"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportOnce, EASE, staggerCards } from "@/lib/animations";

const cats = [
  { title: "Casas", count: "42 propiedades", image: "/images/property-1.png" },
  { title: "Departamentos", count: "68 propiedades", image: "/images/property-2.png" },
  { title: "Terrenos", count: "24 propiedades", image: "/images/property-3.png" },
  { title: "Comerciales", count: "18 propiedades", image: "/images/property-1.png" }
];

export default function Categories() {
  return (
    <section id="inversiones" className="bg-santerra-gray py-20 md:py-28">
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <motion.div
          variants={staggerCards}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-santerra-red" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-santerra-gray-mid">Inversiones inteligentes</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="section-title text-[32px] md:text-[48px] leading-[1.05] text-santerra-graphite max-w-2xl">
            Oportunidades que se adaptan a tu proyecto.
          </motion.h2>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {cats.map((c, i) => (
              <motion.a
                key={c.title}
                variants={fadeUp}
                href="#propiedades"
                className="group relative aspect-[4/5] overflow-hidden bg-santerra-graphite"
              >
                <motion.img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.9, ease: EASE }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 text-white">
                  <div className="w-6 h-[2px] bg-santerra-red mb-3" />
                  <h3 className="section-title text-xl md:text-2xl">{c.title}</h3>
                  <p className="text-[12px] text-white/70 mt-1">{c.count}</p>
                  <motion.div
                    className="mt-3 flex items-center gap-2 text-santerra-red text-[11px] tracking-[0.22em] uppercase"
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                  >
                    Ver más
                    <svg width="14" height="8" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="0" y1="7" x2="20" y2="7" />
                      <polyline points="14 1 20 7 14 13" />
                    </svg>
                  </motion.div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
