"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PageHero from "@/components/PageHero";
import Select from "@/components/Select";
import { fadeUp, viewportOnce, EASE } from "@/lib/animations";

const pasos = [
  { n: "01", title: "Tasación profesional", text: "Analizamos tu propiedad y el mercado para definir el mejor precio." },
  { n: "02", title: "Marketing y difusión", text: "Fotografía profesional, publicación en portales y campañas digitales." },
  { n: "03", title: "Visitas calificadas", text: "Solo compradores serios, con seguimiento de cada interacción." },
  { n: "04", title: "Cierre y escritura", text: "Acompañamos la negociación, el contrato y la firma final." }
];

export default function VenderPage() {
  const [sent, setSent] = useState(false);
  const [tipo, setTipo] = useState("");
  const [operacion, setOperacion] = useState("");

  return (
    <main>
      <Header forceSolid />
      <PageHero
        eyebrow="Vendé o alquilá"
        title="Publicá tu propiedad con Santerra."
        subtitle="Un proceso profesional, marketing serio y compradores calificados. Sin sorpresas."
        image="/images/property-1.png"
      />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10">
          <motion.div
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-santerra-red" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-santerra-gray-mid">Proceso</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="section-title text-[32px] md:text-[46px] leading-[1.05] text-santerra-graphite max-w-2xl">
              Así trabajamos tu propiedad.
            </motion.h2>

            <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
              {pasos.map((s, i) => (
                <motion.div key={s.n} variants={fadeUp} className="relative pt-8">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-santerra-gray-line">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "40%" }}
                      viewport={viewportOnce}
                      transition={{ duration: 1, delay: 0.2 + i * 0.15 }}
                      className="h-full bg-santerra-red"
                    />
                  </div>
                  <span className="text-santerra-red text-[12px] tracking-[0.28em] font-bold">{s.n}</span>
                  <h3 className="section-title text-santerra-graphite text-xl mt-3">{s.title}</h3>
                  <p className="mt-3 text-santerra-gray-mid text-[14px] leading-relaxed">{s.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-santerra-graphite text-white py-20 md:py-28">
        <div className="max-w-[900px] mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-santerra-red" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-white/60">Tasación gratuita</span>
            </div>
            <h2 className="section-title text-[28px] md:text-[38px] leading-[1.05]">
              Contanos sobre tu propiedad.
            </h2>
            <p className="mt-4 text-white/70 max-w-lg">
              Completá el formulario y un asesor te contacta en menos de 24hs con una tasación
              orientativa sin costo.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setTimeout(() => setSent(false), 3500);
            }}
            className="mt-10 grid gap-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              <label className="block">
                <span className="text-[11px] tracking-[0.2em] uppercase text-white/60">Nombre</span>
                <input required className="mt-1 w-full bg-transparent border-b border-white/20 focus:border-santerra-red outline-none py-2 text-white placeholder:text-white/30 transition-colors" placeholder="Tu nombre" />
              </label>
              <label className="block">
                <span className="text-[11px] tracking-[0.2em] uppercase text-white/60">Teléfono</span>
                <input required type="tel" className="mt-1 w-full bg-transparent border-b border-white/20 focus:border-santerra-red outline-none py-2 text-white placeholder:text-white/30 transition-colors" placeholder="0981 000 000" />
              </label>
              <div className="flex">
                <Select
                  label="TIPO DE PROPIEDAD"
                  placeholder="Seleccioná"
                  options={["Casa", "Departamento", "Terreno", "Comercial"]}
                  value={tipo}
                  onChange={setTipo}
                  variant="dark"
                />
              </div>
              <div className="flex">
                <Select
                  label="OPERACIÓN"
                  placeholder="Seleccioná"
                  options={["Venta", "Alquiler"]}
                  value={operacion}
                  onChange={setOperacion}
                  variant="dark"
                />
              </div>
            </div>
            <label className="block">
              <span className="text-[11px] tracking-[0.2em] uppercase text-white/60">Ubicación</span>
              <input required className="mt-1 w-full bg-transparent border-b border-white/20 focus:border-santerra-red outline-none py-2 text-white placeholder:text-white/30 transition-colors" placeholder="Barrio, ciudad" />
            </label>
            <label className="block">
              <span className="text-[11px] tracking-[0.2em] uppercase text-white/60">Comentarios</span>
              <textarea rows={4} className="mt-1 w-full bg-transparent border-b border-white/20 focus:border-santerra-red outline-none py-2 text-white placeholder:text-white/30 resize-none transition-colors" placeholder="Superficie, dormitorios, características destacadas" />
            </label>

            <motion.button
              whileHover={{ backgroundColor: "#9E1F33" }}
              transition={{ duration: 0.3 }}
              type="submit"
              className="mt-2 bg-santerra-red text-white py-4 text-[12px] tracking-[0.22em] uppercase self-start px-10"
            >
              {sent ? "¡Gracias! Te contactamos" : "Solicitar tasación"}
            </motion.button>
          </motion.form>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
