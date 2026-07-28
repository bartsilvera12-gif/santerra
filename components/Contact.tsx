"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp, viewportOnce, EASE } from "@/lib/animations";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contacto" className="bg-santerra-graphite text-white py-20 md:py-28">
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 grid md:grid-cols-2 gap-12 md:gap-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-santerra-red" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-white/60">Contacto</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="section-title text-[32px] md:text-[48px] leading-[1.05]">
            Escribinos.
            <br />
            Te acompañamos.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-white/70 max-w-md">
            Contanos qué necesitás y un asesor de Santerra te responde en menos de 24 horas hábiles.
          </motion.p>

          <motion.ul variants={fadeUp} className="mt-10 space-y-5 text-[14px]">
            <li className="flex items-start gap-4">
              <span className="w-8 h-8 shrink-0 border border-santerra-red text-santerra-red flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </span>
              <div>
                <div className="text-white/50 text-[11px] tracking-[0.2em] uppercase">Teléfono</div>
                <a href="tel:+595981401909" className="hover:text-santerra-red transition">0981 401 909</a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-8 h-8 shrink-0 border border-santerra-red text-santerra-red flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </span>
              <div>
                <div className="text-white/50 text-[11px] tracking-[0.2em] uppercase">Email</div>
                <a href="mailto:hola@santerra.com.py" className="hover:text-santerra-red transition">hola@santerra.com.py</a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-8 h-8 shrink-0 border border-santerra-red text-santerra-red flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </span>
              <div>
                <div className="text-white/50 text-[11px] tracking-[0.2em] uppercase">Oficina</div>
                <span>Asunción, Paraguay</span>
              </div>
            </li>
          </motion.ul>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: EASE }}
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            setTimeout(() => setSent(false), 3500);
          }}
          className="bg-white/[0.03] border border-white/10 backdrop-blur-sm p-6 md:p-10 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="block">
              <span className="text-[11px] tracking-[0.2em] uppercase text-white/60">Nombre</span>
              <input required type="text" className="mt-1 w-full bg-transparent border-b border-white/20 focus:border-santerra-red outline-none py-2 text-white placeholder:text-white/30 transition-colors" placeholder="Tu nombre" />
            </label>
            <label className="block">
              <span className="text-[11px] tracking-[0.2em] uppercase text-white/60">Teléfono</span>
              <input required type="tel" className="mt-1 w-full bg-transparent border-b border-white/20 focus:border-santerra-red outline-none py-2 text-white placeholder:text-white/30 transition-colors" placeholder="0981 000 000" />
            </label>
          </div>
          <label className="block">
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/60">Email</span>
            <input required type="email" className="mt-1 w-full bg-transparent border-b border-white/20 focus:border-santerra-red outline-none py-2 text-white placeholder:text-white/30 transition-colors" placeholder="tu@email.com" />
          </label>
          <label className="block">
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/60">Mensaje</span>
            <textarea required rows={4} className="mt-1 w-full bg-transparent border-b border-white/20 focus:border-santerra-red outline-none py-2 text-white placeholder:text-white/30 resize-none transition-colors" placeholder="Contanos qué estás buscando" />
          </label>

          <motion.button
            whileHover={{ backgroundColor: "#9E1F33" }}
            transition={{ duration: 0.3 }}
            type="submit"
            className="w-full bg-santerra-red text-white py-4 text-[12px] tracking-[0.22em] uppercase"
          >
            {sent ? "¡Mensaje enviado!" : "Enviar mensaje"}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
