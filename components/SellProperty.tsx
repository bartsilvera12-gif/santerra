"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportOnce, EASE } from "@/lib/animations";

export default function SellProperty() {
  return (
    <section className="relative bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative bg-santerra-graphite text-white overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(135deg, #C52A42 0 1px, transparent 1px 26px)" }}
          />
          <div className="relative grid md:grid-cols-[1.1fr_1fr] gap-0">
            <div className="p-8 md:p-16 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                className="flex items-center gap-3 mb-5"
              >
                <div className="w-10 h-[2px] bg-santerra-red" />
                <span className="text-[11px] tracking-[0.28em] uppercase text-white/70">¿Vendés o alquilás?</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
                className="section-title text-[36px] md:text-[54px] leading-[1.02]"
              >
                Publicá tu propiedad con Santerra.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                className="mt-5 text-white/75 max-w-md text-[15px] md:text-[17px]"
              >
                Te acompañamos con tasación profesional, marketing digital y una red de compradores
                calificados. Vendé o alquilá con confianza.
              </motion.p>
              <motion.a
                href="/vender"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
                whileHover={{ backgroundColor: "#9E1F33" }}
                className="mt-8 inline-flex items-center gap-3 bg-santerra-red text-white px-7 py-4 text-[12px] tracking-[0.22em] uppercase self-start"
              >
                Solicitar tasación
                <svg width="16" height="10" viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="0" y1="7" x2="20" y2="7" />
                  <polyline points="14 1 20 7 14 13" />
                </svg>
              </motion.a>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 1, ease: EASE }}
              className="relative min-h-[280px] md:min-h-full overflow-hidden"
            >
              <img
                src="/images/property-2.png"
                alt="Publicá tu propiedad"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
