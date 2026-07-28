"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { fadeUp, viewportOnce, EASE } from "@/lib/animations";

export default function InstitutionalVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative h-[70vh] md:h-[90vh] overflow-hidden bg-santerra-black">
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        <video
          className="w-full h-full object-cover"
          src="https://cdn.coverr.co/videos/coverr-a-modern-house-8562/1080p.mp4"
          poster="/images/property-3.png"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/50" />
      </motion.div>

      <div className="relative z-10 h-full max-w-[1320px] mx-auto px-5 md:px-10 flex items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="max-w-2xl text-white"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-5">
            <div className="w-10 h-[2px] bg-santerra-red" />
            <span className="text-[11px] tracking-[0.28em] uppercase text-white/80">Santerra Experience</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="section-title text-[36px] md:text-[64px] leading-[1.02]">
            Espacios que hablan por sí solos.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-5 text-white/80 text-lg max-w-lg">
            Diseñamos experiencias de compra e inversión que están a la altura de las propiedades que representamos.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
