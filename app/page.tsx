import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutIntro from "@/components/AboutIntro";
import FeaturedProperties from "@/components/FeaturedProperties";
import Categories from "@/components/Categories";
import InstitutionalVideo from "@/components/InstitutionalVideo";
import BrandQuote from "@/components/BrandQuote";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getCategoryCards, getProperties } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [properties, cards] = await Promise.all([getProperties(), getCategoryCards()]);

  return (
    <main>
      <Header />
      <Hero />
      <AboutIntro />
      <FeaturedProperties properties={properties} />
      <Categories categories={cards} />
      <InstitutionalVideo />
      <BrandQuote />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
