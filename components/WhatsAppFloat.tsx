"use client";

import { motion } from "framer-motion";

export default function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/595981401909"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_10px_30px_-8px_rgba(37,211,102,0.6)]"
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M19.11 17.35c-.29-.14-1.72-.85-1.99-.94-.27-.1-.46-.15-.66.15-.19.29-.75.94-.92 1.14-.17.19-.34.22-.63.07-.29-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.19-.29.29-.49.1-.19.05-.36-.02-.51-.07-.14-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5l-.56-.01c-.19 0-.51.07-.78.36-.27.29-1.02.99-1.02 2.42s1.05 2.81 1.2 3c.15.19 2.06 3.14 4.98 4.4.7.3 1.24.48 1.66.62.7.22 1.34.19 1.85.12.56-.08 1.72-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34zM16.02 5C9.94 5 5 9.93 5 15.99c0 1.94.51 3.83 1.47 5.5L5 27l5.72-1.44a10.94 10.94 0 0 0 5.3 1.35h.01c6.07 0 11.02-4.93 11.02-11S22.09 5 16.02 5zm0 20.16c-1.7 0-3.36-.46-4.8-1.32l-.35-.21-3.4.86.9-3.3-.23-.36a8.9 8.9 0 0 1-1.38-4.83c0-4.94 4.02-8.95 8.97-8.95a8.9 8.9 0 0 1 6.35 2.63 8.9 8.9 0 0 1 2.62 6.32c0 4.94-4.02 8.95-8.97 8.95z" />
      </svg>
    </motion.a>
  );
}
