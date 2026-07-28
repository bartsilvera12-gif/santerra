"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/animations";

export default function WhatsAppFloat() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const update = () => {
      const footer = document.getElementById("site-footer");
      if (!footer) return;
      // se oculta apenas el footer entra en pantalla
      setHidden(footer.getBoundingClientRect().top < window.innerHeight - 40);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.a
          href="https://wa.me/595981401909"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribinos por WhatsApp"
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.85 }}
          transition={{ duration: 0.4, ease: EASE }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="group fixed bottom-6 right-5 md:bottom-8 md:right-8 z-50 flex items-center gap-0 rounded-full bg-[#1FAF52] text-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.45)] ring-1 ring-black/5 hover:bg-[#189245] transition-colors duration-300"
        >
          <span className="w-[52px] h-[52px] md:w-14 md:h-14 flex items-center justify-center shrink-0">
            <svg width="26" height="26" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
              <path d="M19.11 17.35c-.29-.14-1.72-.85-1.99-.94-.27-.1-.46-.15-.66.15-.19.29-.75.94-.92 1.14-.17.19-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.19.05-.36-.02-.51-.07-.14-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5l-.56-.01c-.19 0-.51.07-.78.36-.27.29-1.02.99-1.02 2.42s1.05 2.81 1.2 3c.15.19 2.06 3.14 4.98 4.4.7.3 1.24.48 1.66.62.7.22 1.34.19 1.85.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34zM16.02 5C9.94 5 5 9.93 5 15.99c0 1.94.51 3.83 1.47 5.5L5 27l5.72-1.44a10.94 10.94 0 0 0 5.3 1.35h.01c6.07 0 11.02-4.93 11.02-11S22.09 5 16.02 5zm0 20.16c-1.7 0-3.36-.46-4.8-1.32l-.35-.21-3.4.86.9-3.3-.23-.36a8.9 8.9 0 0 1-1.38-4.83c0-4.94 4.02-8.95 8.97-8.95a8.9 8.9 0 0 1 6.35 2.63 8.9 8.9 0 0 1 2.62 6.32c0 4.94-4.02 8.95-8.97 8.95z" />
            </svg>
          </span>

          <span className="hidden md:block max-w-0 overflow-hidden whitespace-nowrap text-[13px] font-medium group-hover:max-w-[140px] group-hover:pr-5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
            Escribinos
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
