"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PageHero from "@/components/PageHero";
import Categories from "@/components/Categories";
import { fadeUp, viewportOnce, EASE } from "@/lib/animations";

const beneficios = [
  {
    title: "Rentabilidad estable",
    text: "El mercado paraguayo ofrece retornos sostenidos con menor volatilidad que la región."
  },
  {
    title: "Diversificación real",
    text: "Combiná renta residencial, comercial y desarrollo de terrenos en un mismo portafolio."
  },
  {
    title: "Costos competitivos",
    text: "Impuestos bajos y una economía dolarizada de facto en las operaciones de compra-venta."
  },
  {
    title: "Acompañamiento integral",
    text: "Te ayudamos con estructura legal, financiera y de administración de la propiedad."
  }
];

export default function InversionesPage() {
  return (
    <main>
      <Header forceSolid />
      <PageHero
        eyebrow="Inversiones"
        title="Invertí en propiedades con criterio."
        subtitle="Curamos oportunidades por rentabilidad, ubicación y proyección para que tu capital trabaje mejor."
        image="/images/property-1.png"
      />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-santerra-red" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-santerra-gray-mid">Por qué Paraguay</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="section-title text-[32px] md:text-[46px] leading-[1.05] text-santerra-graphite">
              Un mercado sólido, en expansión.
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-santerra-gray-mid text-[15px] max-w-md">
              Paraguay combina estabilidad macroeconómica, crecimiento demográfico y demanda genuina
              de propiedades. Es un contexto ideal para inversores de largo plazo.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.9, ease: EASE }}
            className="relative aspect-[4/3] overflow-hidden"
          >
            <img src="/images/property-3.png" alt="Inversiones" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-santerra-black/40 to-transparent" />
          </motion.div>
        </div>
      </section>

      <section className="bg-santerra-gray py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10">
          <motion.div
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-santerra-red" />
              <span className="text-[11px] tracking-[0.28em] uppercase text-santerra-gray-mid">Beneficios</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="section-title text-[28px] md:text-[38px] leading-[1.05] text-santerra-graphite max-w-2xl">
              Por qué invertir con Santerra.
            </motion.h2>
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {beneficios.map((b) => (
                <motion.div key={b.title} variants={fadeUp} className="bg-white p-6 border-t-2 border-santerra-red">
                  <h3 className="section-title text-santerra-graphite text-xl">{b.title}</h3>
                  <p className="mt-3 text-santerra-gray-mid text-[14px] leading-relaxed">{b.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Categories />

      <section className="bg-santerra-graphite text-white py-16 md:py-20">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="section-title text-2xl md:text-3xl">¿Querés recibir oportunidades por email?</h3>
            <p className="mt-2 text-white/70 text-sm">Enviamos una selección mensual con las mejores propiedades de inversión.</p>
          </div>
          <Link
            href="/contacto"
            className="bg-santerra-red hover:bg-santerra-red-dark transition-colors px-8 py-4 text-[12px] tracking-[0.22em] uppercase"
          >
            Suscribirme
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
