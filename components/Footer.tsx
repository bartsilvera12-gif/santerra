"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/animations";

export default function Footer() {
  return (
    <footer className="bg-santerra-black text-white/80 pt-16 pb-10">
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="grid md:grid-cols-4 gap-10 pb-12 border-b border-white/10"
        >
          <motion.div variants={fadeUp}>
            <img
              src="/images/logo.png"
              alt="Santerra Negocios Inmobiliarios"
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="mt-6 text-sm text-white/60 max-w-xs">
              Tu inversión, nuestro compromiso. Asesoramiento inmobiliario en todo Paraguay.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="text-[11px] tracking-[0.28em] uppercase text-white/50 mb-4">Explorar</div>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-santerra-red transition">Inicio</a></li>
              <li><a href="/propiedades" className="hover:text-santerra-red transition">Propiedades</a></li>
              <li><a href="/nosotros" className="hover:text-santerra-red transition">Nosotros</a></li>
              <li><a href="/inversiones" className="hover:text-santerra-red transition">Inversiones</a></li>
              <li><a href="/vender" className="hover:text-santerra-red transition">Vender / Alquilar</a></li>
              <li><a href="/contacto" className="hover:text-santerra-red transition">Contacto</a></li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="text-[11px] tracking-[0.28em] uppercase text-white/50 mb-4">Servicios</div>
            <ul className="space-y-2 text-sm">
              <li><a href="/servicios" className="hover:text-santerra-red transition">Compra y venta</a></li>
              <li><a href="/servicios" className="hover:text-santerra-red transition">Alquileres</a></li>
              <li><a href="/servicios" className="hover:text-santerra-red transition">Tasaciones</a></li>
              <li><a href="/inversiones" className="hover:text-santerra-red transition">Asesoramiento de inversión</a></li>
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="text-[11px] tracking-[0.28em] uppercase text-white/50 mb-4">Contacto</div>
            <ul className="space-y-2 text-sm">
              <li><a href="tel:+595981401909" className="hover:text-santerra-red transition">0981 401 909</a></li>
              <li><a href="mailto:hola@santerra.com.py" className="hover:text-santerra-red transition">hola@santerra.com.py</a></li>
              <li>Asunción, Paraguay</li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] tracking-[0.18em] uppercase text-white/40">
          <div>© {new Date().getFullYear()} Santerra Negocios Inmobiliarios</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-santerra-red transition">Instagram</a>
            <a href="#" className="hover:text-santerra-red transition">Facebook</a>
            <a href="#" className="hover:text-santerra-red transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
