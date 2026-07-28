"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PageHero from "@/components/PageHero";
import { fadeUp, viewportOnce } from "@/lib/animations";

const secciones = [
  {
    title: "1. Responsable del tratamiento",
    body: [
      "Santerra Negocios Inmobiliarios, con domicilio en Asunción, Paraguay, es responsable del tratamiento de los datos personales que se recolectan a través de este sitio web.",
      "Para cualquier consulta sobre esta política podés escribirnos a hola@santerra.com.py o llamarnos al 0981 401 909."
    ]
  },
  {
    title: "2. Qué datos recolectamos",
    body: [
      "Recolectamos únicamente los datos que nos proporcionás de forma voluntaria a través de nuestros formularios de contacto, de tasación o de suscripción al newsletter: nombre y apellido, teléfono, correo electrónico y el mensaje o consulta que nos envíes.",
      "Adicionalmente, podemos registrar datos técnicos de navegación como dirección IP, tipo de dispositivo, navegador y páginas visitadas, con fines estadísticos."
    ]
  },
  {
    title: "3. Para qué usamos tus datos",
    body: [
      "Utilizamos tus datos para responder tus consultas, enviarte información sobre propiedades que puedan interesarte, coordinar visitas y tasaciones, y mejorar la experiencia de uso del sitio.",
      "Si te suscribiste a nuestro newsletter, los usamos también para enviarte novedades del mercado inmobiliario y nuevas propiedades. Podés darte de baja en cualquier momento."
    ]
  },
  {
    title: "4. Con quién los compartimos",
    body: [
      "No vendemos, alquilamos ni cedemos tus datos personales a terceros con fines comerciales.",
      "Solo compartimos información con proveedores que nos prestan servicios necesarios para operar el sitio (hosting, correo electrónico, herramientas de analítica), quienes están obligados a tratarla de forma confidencial."
    ]
  },
  {
    title: "5. Cookies",
    body: [
      "Este sitio utiliza cookies propias y de terceros para recordar tus preferencias y obtener métricas de uso agregadas.",
      "Podés bloquear o eliminar las cookies desde la configuración de tu navegador. Tené en cuenta que algunas funciones del sitio podrían no comportarse correctamente si las desactivás."
    ]
  },
  {
    title: "6. Conservación y seguridad",
    body: [
      "Conservamos tus datos mientras exista una relación comercial o hasta que solicites su eliminación.",
      "Aplicamos medidas técnicas y organizativas razonables para protegerlos frente a accesos no autorizados, pérdida o alteración."
    ]
  },
  {
    title: "7. Tus derechos",
    body: [
      "Podés solicitar en cualquier momento el acceso, la rectificación, la actualización o la eliminación de tus datos personales, así como oponerte a su tratamiento.",
      "Para ejercer estos derechos escribinos a hola@santerra.com.py indicando tu solicitud. Responderemos a la brevedad."
    ]
  },
  {
    title: "8. Cambios en esta política",
    body: [
      "Podemos actualizar esta política para reflejar cambios legales o en nuestros servicios. La versión vigente será siempre la publicada en esta página, con su fecha de última actualización."
    ]
  }
];

export default function PoliticaDePrivacidadPage() {
  return (
    <main>
      <Header forceSolid />
      <PageHero
        eyebrow="Legal"
        title="Política de privacidad"
        subtitle="Cómo recolectamos, usamos y protegemos tus datos personales en Santerra Negocios Inmobiliarios."
        image="/images/property-2.png"
      />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[820px] mx-auto px-5 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.p
              variants={fadeUp}
              className="text-[11px] tracking-[0.28em] uppercase text-santerra-gray-mid"
            >
              Última actualización: julio 2026
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-santerra-gray-mid text-[15px] leading-relaxed"
            >
              En Santerra valoramos tu confianza. Esta política explica de forma clara qué información
              recolectamos cuando navegás o nos contactás, con qué finalidad la usamos y qué derechos
              tenés sobre ella.
            </motion.p>

            <div className="mt-12 space-y-10">
              {secciones.map((s) => (
                <motion.div key={s.title} variants={fadeUp}>
                  <h2 className="section-title text-santerra-graphite text-xl md:text-2xl border-t-2 border-santerra-red pt-5">
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-3 text-santerra-gray-mid text-[15px] leading-relaxed">
                    {s.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeUp}
              className="mt-14 bg-santerra-gray p-6 md:p-8 border-l-2 border-santerra-red"
            >
              <p className="text-santerra-gray-mid text-[15px] leading-relaxed">
                ¿Tenés dudas sobre el tratamiento de tus datos? Escribinos a{" "}
                <a
                  href="mailto:hola@santerra.com.py"
                  className="text-santerra-red hover:underline"
                >
                  hola@santerra.com.py
                </a>{" "}
                o llamanos al{" "}
                <a href="tel:+595981401909" className="text-santerra-red hover:underline">
                  0981 401 909
                </a>
                .
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
