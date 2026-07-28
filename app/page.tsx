import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutIntro from "@/components/AboutIntro";
import FeaturedProperties from "@/components/FeaturedProperties";
import Categories from "@/components/Categories";
import InstitutionalVideo from "@/components/InstitutionalVideo";
import SellProperty from "@/components/SellProperty";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <AboutIntro />
      <FeaturedProperties />
      <Categories />
      <InstitutionalVideo />
      <SellProperty />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
