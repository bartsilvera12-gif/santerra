"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/animations";

const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    )
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.5 8.5V6.9c0-.8.2-1.2 1.3-1.2h1.5V3h-2.6c-2.6 0-3.6 1.4-3.6 3.6v1.9H9v2.8h2.1V21h3.4v-9.7h2.4l.4-2.8h-2.8z" />
      </svg>
    )
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.9 8.9v11.2H3.6V8.9h3.3zM5.2 3.4c1.1 0 1.9.8 1.9 1.8s-.8 1.8-1.9 1.8S3.3 6.2 3.3 5.2s.8-1.8 1.9-1.8zM20.7 13.6v6.5h-3.3v-6.1c0-1.5-.5-2.5-1.9-2.5-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9v6.3H10.2s.05-10.2 0-11.2h3.3v1.6c.45-.7 1.25-1.7 3.05-1.7 2.2 0 3.9 1.5 3.9 4.6z" />
      </svg>
    )
  }
];

export default function Footer() {
  return (
    <footer id="site-footer" className="bg-santerra-black text-white/80 pt-16 pb-10">
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

            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:border-santerra-red hover:text-santerra-red transition-colors duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
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
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center">
            <span>© {new Date().getFullYear()} Santerra Negocios Inmobiliarios</span>
            <a href="/politica-de-privacidad" className="hover:text-santerra-red transition">
              Política de privacidad
            </a>
          </div>

          <div className="text-white/30">
            Desarrollado por{" "}
            <a
              href="https://neura.com.py"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-santerra-red transition"
            >
              Neura
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
