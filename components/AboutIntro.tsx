"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { fadeUp, stagger, viewportOnce, EASE } from "@/lib/animations";

export default function AboutIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section id="nosotros" className="relative bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <motion.div
          variants={stagger(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
            <div className="w-8 h-[2px] bg-santerra-red" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-santerra-gray-mid">Santerra</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="section-title text-[36px] md:text-[52px] leading-[1.05] text-santerra-graphite">
            Negocios inmobiliarios
            <br /> pensados para vos.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 text-santerra-gray-mid text-[15px] md:text-[17px] leading-relaxed max-w-md">
            Conocemos el mercado, entendemos tus objetivos y te acompañamos en cada decisión para que
            inviertas con seguridad y confianza.
          </motion.p>
          <motion.a
            variants={fadeUp}
            href="#nosotros-full"
            whileHover={{ backgroundColor: "#151C23", color: "#fff" }}
            transition={{ duration: 0.3 }}
            className="mt-8 inline-flex items-center gap-4 border border-santerra-graphite text-santerra-graphite px-6 py-3 text-[12px] tracking-[0.22em] uppercase group"
          >
            Conocé más
            <motion.span
              className="flex items-center justify-center w-8 h-8 bg-santerra-red text-white"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </motion.span>
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1, ease: EASE }}
          style={{ y }}
          className="relative aspect-[4/3] overflow-hidden clip-diagonal"
        >
          <img
            src="/images/property-1.png"
            alt="Interior premium"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
      </div>
      <style>{`
        .clip-diagonal {
          clip-path: polygon(6% 0, 100% 0, 100% 100%, 0 100%);
        }
      `}</style>
    </section>
  );
}
