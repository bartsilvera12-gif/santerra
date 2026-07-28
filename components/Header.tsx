"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/propiedades", label: "Propiedades" },
  { href: "/servicios", label: "Servicios" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/inversiones", label: "Inversiones" },
  { href: "/contacto", label: "Contacto" }
];

export default function Header({ forceSolid = false }: { forceSolid?: boolean }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(forceSolid);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(forceSolid || v > 60));

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-santerra ${
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-santerra-gray-line shadow-[0_1px_0_rgba(0,0,0,0.02)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-5 md:px-10 py-4 flex items-center justify-between gap-6">
        <Link href="/" className={`block leading-none ${scrolled ? "text-santerra-graphite" : "text-white"}`}>
          <div className="text-[22px] md:text-[26px] font-bold tracking-wide">SANTERRA</div>
          <div className={`text-[9px] md:text-[9.5px] tracking-[0.42em] mt-1 ${scrolled ? "text-santerra-gray-mid" : "text-white/70"}`}>
            NEGOCIOS INMOBILIARIOS
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-9">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[13px] tracking-[0.14em] uppercase pb-1 border-b-2 transition-colors duration-300 ${
                isActive(l.href) ? "border-santerra-red" : "border-transparent hover:border-santerra-red"
              } ${scrolled ? "text-santerra-graphite" : "text-white"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden text-inherit p-2"
          aria-label="Menú"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block w-6 h-[2px] mb-1.5 transition-colors ${scrolled ? "bg-santerra-graphite" : "bg-white"}`} />
          <span className={`block w-6 h-[2px] mb-1.5 transition-colors ${scrolled ? "bg-santerra-graphite" : "bg-white"}`} />
          <span className={`block w-6 h-[2px] transition-colors ${scrolled ? "bg-santerra-graphite" : "bg-white"}`} />
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-white border-t border-santerra-gray-line"
        >
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-[13px] tracking-[0.14em] uppercase text-santerra-graphite py-2"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
