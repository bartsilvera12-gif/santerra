"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { fadeUp, viewportOnce, EASE } from "@/lib/animations";

const list = [
  {
    quote:
      "Nos acompañaron desde el primer día. Encontramos la casa que buscábamos y el proceso fue transparente de principio a fin.",
    name: "María y Diego G.",
    role: "Compradores en San Bernardino"
  },
  {
    quote:
      "Vendimos nuestro departamento en menos tiempo del esperado. La estrategia de marketing marcó la diferencia.",
    name: "Fernando R.",
    role: "Propietario en Asunción"
  },
  {
    quote:
      "Profesionalismo, honestidad y un asesoramiento serio de inversión. Volveríamos a elegirlos sin dudarlo.",
    name: "Laura V.",
    role: "Inversora"
  }
];

export default function Testimonials() {
  const [i, setI] = useState(0);
  const t = list[i];

  return (
    <section className="bg-santerra-gray py-20 md:py-28">
      <div className="max-w-[1000px] mx-auto px-5 md:px-10 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-santerra-red" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-santerra-gray-mid">Testimonios</span>
            <div className="w-8 h-[2px] bg-santerra-red" />
          </motion.div>
          <motion.h2 variants={fadeUp} className="section-title text-[28px] md:text-[40px] text-santerra-graphite">
            Historias de quienes confiaron en Santerra.
          </motion.h2>

          <div className="mt-12 relative min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={t.quote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="text-santerra-graphite text-[20px] md:text-[26px] leading-relaxed font-light"
              >
                <span className="text-santerra-red text-4xl leading-none">“</span>
                {t.quote}
                <span className="text-santerra-red text-4xl leading-none">”</span>
                <footer className="mt-6 text-[13px] tracking-[0.18em] uppercase text-santerra-gray-mid">
                  <div className="text-santerra-graphite">{t.name}</div>
                  <div>{t.role}</div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            {list.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                className={`h-[3px] transition-all duration-500 ${
                  idx === i ? "w-10 bg-santerra-red" : "w-6 bg-santerra-gray-line hover:bg-santerra-gray-mid"
                }`}
                aria-label={`Testimonio ${idx + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
