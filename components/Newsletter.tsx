"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, viewportOnce, EASE } from "@/lib/animations";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

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
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}
              >
                <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-[2px] bg-santerra-red" />
                  <span className="text-[11px] tracking-[0.28em] uppercase text-white/70">Alertas de propiedades</span>
                </motion.div>
                <motion.h2 variants={fadeUp} className="section-title text-[36px] md:text-[54px] leading-[1.02]">
                  Recibí las mejores oportunidades primero.
                </motion.h2>
                <motion.p variants={fadeUp} className="mt-5 text-white/75 max-w-md text-[15px] md:text-[17px]">
                  Suscribite y te avisamos por email cuando ingresa una propiedad que se ajusta a lo
                  que estás buscando. Sin spam, sin costo.
                </motion.p>

                <motion.form
                  variants={fadeUp}
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!email) return;
                    setSent(true);
                    setEmail("");
                    setTimeout(() => setSent(false), 3500);
                  }}
                  className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="flex-1 bg-transparent border-b border-white/25 focus:border-santerra-red outline-none py-3 text-white placeholder:text-white/40 transition-colors text-[15px]"
                  />
                  <motion.button
                    whileHover={{ backgroundColor: "#9E1F33" }}
                    transition={{ duration: 0.3 }}
                    type="submit"
                    className="bg-santerra-red text-white px-8 py-4 text-[12px] tracking-[0.22em] uppercase whitespace-nowrap"
                  >
                    {sent ? "¡Suscripto!" : "Suscribirme"}
                  </motion.button>
                </motion.form>

                <motion.ul variants={fadeUp} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-white/50">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-santerra-red" /> Curado por asesores
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-santerra-red" /> Máximo 2 emails al mes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-santerra-red" /> Cancelás cuando quieras
                  </li>
                </motion.ul>
              </motion.div>
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
                alt="Alertas de propiedades"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-santerra-graphite/40" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
