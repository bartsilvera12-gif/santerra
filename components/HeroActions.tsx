"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASE } from "@/lib/animations";

const base =
  "group flex items-center justify-center gap-3 w-full sm:w-auto px-7 md:px-9 py-4 md:py-[18px] rounded-sm text-[12px] md:text-[13px] uppercase tracking-[0.2em] transition-colors duration-300";

export default function HeroActions() {
  return (
    <motion.div
      initial={{ y: 32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
      className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
    >
      <Link
        href="/propiedades"
        className={`${base} bg-santerra-red text-white shadow-[0_14px_34px_-14px_rgba(197,42,66,0.75)] hover:bg-santerra-red-dark`}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Ver propiedades
      </Link>

      <Link
        href="/contacto"
        className={`${base} border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/20`}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11Z"
            stroke="#C52A42"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="10" r="2.4" stroke="#C52A42" strokeWidth="1.8" />
        </svg>
        Contactar
      </Link>
    </motion.div>
  );
}
