import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PageHero from "@/components/PageHero";
import Contact from "@/components/Contact";

export const metadata = {
  title: "Contacto — Santerra",
  description: "Escribinos y un asesor de Santerra te responde en menos de 24 horas hábiles."
};

export default function ContactoPage() {
  return (
    <main>
      <Header forceSolid />
      <PageHero
        eyebrow="Contacto"
        title="Hablemos."
        subtitle="Contanos qué necesitás y un asesor te responde en menos de 24 horas hábiles."
        image="/images/property-2.png"
      />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
