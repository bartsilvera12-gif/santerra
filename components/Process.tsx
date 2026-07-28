"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportOnce, staggerCards } from "@/lib/animations";

const steps = [
  { n: "01", title: "Escuchamos tus objetivos", text: "Conocemos tus prioridades, tu presupuesto y el tipo de propiedad que buscás." },
  { n: "02", title: "Analizamos el mercado", text: "Comparamos zonas, precios y proyecciones para recomendarte la mejor opción." },
  { n: "03", title: "Curamos las propiedades", text: "Seleccionamos oportunidades que se alinean con lo que necesitás." },
  { n: "04", title: "Cerramos con seguridad", text: "Te acompañamos en la negociación, documentación y firma final." }
];

export default function Process() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <motion.div
          variants={staggerCards}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-santerra-red" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-santerra-gray-mid">Proceso</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="section-title text-[32px] md:text-[48px] leading-[1.05] text-santerra-graphite max-w-xl">
            Un asesoramiento claro, en cuatro pasos.
          </motion.h2>

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 relative">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                variants={fadeUp}
                className="relative pt-8"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-santerra-gray-line">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "40%" }}
                    viewport={viewportOnce}
                    transition={{ duration: 1, delay: 0.2 + i * 0.15 }}
                    className="h-full bg-santerra-red"
                  />
                </div>
                <span className="text-santerra-red text-[12px] tracking-[0.28em] font-bold">{s.n}</span>
                <h3 className="section-title text-santerra-graphite text-xl mt-3">{s.title}</h3>
                <p className="mt-3 text-santerra-gray-mid text-[14px] leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
