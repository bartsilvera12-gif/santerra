import Link from "next/link";
import PropertyForm from "../PropertyForm";

export default function NuevaPropiedad() {
  return (
    <div>
      <Link
        href="/admin/propiedades"
        className="text-[11px] uppercase tracking-[0.22em] text-santerra-gray-mid transition hover:text-santerra-red"
      >
        ← Propiedades
      </Link>
      <h1 className="section-title mb-8 mt-4 text-[30px] leading-tight text-santerra-graphite md:text-[40px]">
        Nueva propiedad
      </h1>
      <PropertyForm />
    </div>
  );
}
