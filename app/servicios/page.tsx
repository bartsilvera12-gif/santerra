"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PageHero from "@/components/PageHero";
import { fadeUp, viewportOnce, EASE, staggerCards } from "@/lib/animations";

const servicios = [
  {
    title: "Compra y venta",
    text: "Te ayudamos a encontrar la propiedad ideal o a vender la tuya al mejor precio.",
    features: ["Búsqueda personalizada", "Negociación", "Escritura y firma"]
  },
  {
    title: "Alquileres",
    text: "Gestión completa de alquileres residenciales y comerciales.",
    features: ["Screening de inquilinos", "Contratos y garantías", "Administración mensual"]
  },
  {
    title: "Tasaciones",
    text: "Valuaciones profesionales basadas en el mercado real.",
    features: ["Informe detallado", "Comparables", "Proyección de valor"]
  },
  {
    title: "Asesoramiento en inversiones",
    text: "Análisis de rentabilidad y curación de oportunidades de inversión.",
    features: ["ROI proyectado", "Diversificación", "Acompañamiento legal"]
  },
  {
    title: "Administración de propiedades",
    text: "Gestionamos tu propiedad para que no tengas que preocuparte por nada.",
    features: ["Cobranza", "Mantenimiento", "Reporte mensual"]
  },
  {
    title: "Marketing inmobiliario",
    text: "Fotografía profesional, tours virtuales y campañas digitales.",
    features: ["Foto y video profesional", "Portales premium", "Ads segmentadas"]
  }
];

export default function ServiciosPage() {
  return (
    <main>
      <Header forceSolid />
      <PageHero
        eyebrow="Servicios"
        title="Un servicio integral para cada necesidad."
        subtitle="Desde la búsqueda de la propiedad ideal hasta la administración a largo plazo, te acompañamos en todo el ciclo."
        image="/images/property-1.png"
      />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1320px] mx-auto px-5 md:px-10">
          <motion.div
            variants={staggerCards}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {servicios.map((s) => (
              <motion.article
                key={s.title}
                variants={fadeUp}
                className="group bg-white border border-santerra-gray-line p-8 hover:border-santerra-red transition-colors duration-500"
              >
                <div className="w-10 h-[2px] bg-santerra-red mb-5" />
                <h3 className="section-title text-santerra-graphite text-2xl">{s.title}</h3>
                <p className="mt-3 text-santerra-gray-mid text-[14px] leading-relaxed">{s.text}</p>
                <ul className="mt-6 space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-santerra-graphite text-[13px]">
                      <span className="w-1.5 h-1.5 bg-santerra-red" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-santerra-graphite text-white py-16 md:py-20">
        <div className="max-w-[1000px] mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <h2 className="section-title text-[28px] md:text-[38px] leading-[1.05]">
              ¿No sabés por dónde empezar?
            </h2>
            <p className="mt-4 text-white/70 max-w-lg mx-auto">
              Contanos qué necesitás y armamos juntos el plan que mejor se ajusta a tus objetivos.
            </p>
            <Link
              href="/contacto"
              className="mt-8 inline-flex bg-santerra-red hover:bg-santerra-red-dark transition-colors px-8 py-4 text-[12px] tracking-[0.22em] uppercase"
            >
              Hablemos
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
