"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/animations";

export default function PropertyGallery({
  images,
  title,
  operation
}: {
  images: string[];
  title: string;
  operation: "VENTA" | "ALQUILER";
}) {
  const [i, setI] = useState(0);

  return (
    <section className="bg-white">
      <div className="max-w-[1320px] mx-auto px-5 md:px-10">
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-santerra-graphite">
          <AnimatePresence mode="wait">
            <motion.img
              key={images[i]}
              src={images[i]}
              alt={title}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <span
            className={`absolute top-4 left-4 px-3 py-1 text-[10px] tracking-[0.22em] font-bold text-white ${
              operation === "VENTA" ? "bg-santerra-red" : "bg-santerra-graphite"
            }`}
          >
            {operation}
          </span>

          {images.length > 1 && (
            <>
              <button
                onClick={() => setI((v) => (v - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-santerra-graphite flex items-center justify-center transition"
                aria-label="Anterior"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button
                onClick={() => setI((v) => (v + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-santerra-graphite flex items-center justify-center transition"
                aria-label="Siguiente"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={img + idx}
                onClick={() => setI(idx)}
                className={`relative w-28 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors ${
                  idx === i ? "border-santerra-red" : "border-transparent hover:border-santerra-gray-mid"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
