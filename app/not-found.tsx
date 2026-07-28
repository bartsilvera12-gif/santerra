import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <main>
      <Header forceSolid />
      <section className="min-h-[80vh] flex items-center bg-santerra-black text-white pt-32 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, #C52A42 0 1px, transparent 1px 26px)" }}
        />
        <div className="relative max-w-[1320px] mx-auto px-5 md:px-10 text-center">
          <div className="text-santerra-red text-[11px] tracking-[0.28em] uppercase">Error 404</div>
          <h1 className="section-title text-[64px] md:text-[120px] leading-none mt-4">404</h1>
          <p className="mt-6 text-white/70 text-lg max-w-md mx-auto">
            La página que buscás no existe o fue movida. Volvé al inicio o explorá nuestras propiedades.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="bg-santerra-red hover:bg-santerra-red-dark transition-colors px-8 py-4 text-[12px] tracking-[0.22em] uppercase"
            >
              Ir al inicio
            </Link>
            <Link
              href="/propiedades"
              className="border border-white/25 hover:border-white transition-colors px-8 py-4 text-[12px] tracking-[0.22em] uppercase"
            >
              Ver propiedades
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
