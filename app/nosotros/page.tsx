"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PageHero from "@/components/PageHero";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import { fadeUp, viewportOnce, EASE, staggerCards } from "@/lib/animations";

const valores = [
  { title: "Compromiso", text: "Trabajamos con dedicación real por cada cliente, sin atajos." },
  { title: "Transparencia", text: "Información clara y decisiones informadas en cada etapa." },
  { title: "Experiencia", text: "Años operando el mercado inmobiliario paraguayo." },
  { title: "Cercanía", text: "Un asesor dedicado, disponible cuando lo necesites." }
];

export default function NosotrosPage() {
  return (
    <main>
      <Header forceSolid />
      <PageHero
        eyebrow="Nosotros"
        title="Somos Santerra."
        subtitle="Una inmobiliaria pensada para acompañarte con criterio, honestidad y una mirada estratégica del mercado."
        image="/images/property-3.png"
      />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1100px] mx-auto px-5 md:px-10 grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-santerra-red" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-santerra-gray-mid">Nuestra historia</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="section-title text-[28px] md:text-[38px] leading-[1.1] text-santerra-graphite">
              Un equipo que hace lo que dice.
            </motion.h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE }}
            className="space-y-4 text-santerra-gray-mid text-[15px] leading-relaxed"
          >
            <p>
              Nacimos con la convicción de que comprar, alquilar o invertir en inmuebles no debería ser
              un proceso confuso. Diseñamos una experiencia donde el cliente entiende cada paso y toma
              decisiones con toda la información sobre la mesa.
            </p>
            <p>
              Combinamos análisis de mercado, marketing profesional y un servicio personal cercano.
              Cada propiedad que representamos, cada visita y cada firma reciben la misma atención.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10">
          <motion.div
            variants={staggerCards}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-santerra-red" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-santerra-gray-mid">Nuestros valores</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="section-title text-[32px] md:text-[44px] leading-[1.05] text-santerra-graphite max-w-2xl">
              Cómo trabajamos.
            </motion.h2>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {valores.map((v) => (
                <motion.div
                  key={v.title}
                  variants={fadeUp}
                  className="border-t-2 border-santerra-red pt-5 pr-4"
                >
                  <h3 className="section-title text-santerra-graphite text-xl">{v.title}</h3>
                  <p className="mt-3 text-santerra-gray-mid text-[14px] leading-relaxed">{v.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Process />
      <Testimonials />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
