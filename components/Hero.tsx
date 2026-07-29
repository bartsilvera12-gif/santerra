"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE, stagger, fadeUp } from "@/lib/animations";
import HeroActions from "./HeroActions";

const HERO_VIDEO =
  "https://cdn.coverr.co/videos/coverr-luxury-modern-house-1583/1080p.mp4";

export default function Hero() {
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setVideoReady(true);
    v.addEventListener("canplay", onCanPlay);
    v.play().catch(() => {});
    return () => v.removeEventListener("canplay", onCanPlay);
  }, []);

  return (
    <section id="inicio" className="relative min-h-screen w-full overflow-hidden bg-santerra-black text-white">
      {/* Poster fallback */}
      <motion.img
        src="/images/hero.png"
        alt="Santerra Hero"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: videoReady ? 0 : 1, scale: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      />

      {/* Background video */}
      <motion.video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={HERO_VIDEO}
        poster="/images/hero.png"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: videoReady ? 1 : 0, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-santerra-black/85 via-santerra-black/55 to-santerra-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-santerra-black/30 via-transparent to-santerra-black/40" />

      {/* Content */}
      <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-10 pt-40 md:pt-44 pb-32 md:pb-40 min-h-screen flex flex-col justify-center">
        <motion.div
          variants={stagger(0.15, 0.35)}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          <motion.h1
            variants={fadeUp}
            className="section-title text-white text-[30px] sm:text-[42px] leading-[1.06] md:text-[72px] md:leading-[1.0] tracking-[-0.01em] font-bold"
          >
            ENCONTRÁ EL LUGAR
            <br />
            IDEAL PARA VIVIR
            <br />
            O INVERTIR
          </motion.h1>

          <motion.div variants={fadeUp} className="flex items-center gap-3 mt-8">
            <div className="w-10 h-[2px] bg-santerra-red" />
          </motion.div>
        </motion.div>

        {/* Acciones principales */}
        <div className="mt-10 md:mt-14">
          <HeroActions />
        </div>
      </div>
    </section>
  );
}
