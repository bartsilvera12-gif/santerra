import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/supabase/queries";
import PropertyForm from "../PropertyForm";

export const dynamic = "force-dynamic";

export default async function EditarPropiedad({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id);
  if (!property) notFound();

  return (
    <div>
      <Link
        href="/admin/propiedades"
        className="text-[11px] uppercase tracking-[0.22em] text-santerra-gray-mid transition hover:text-santerra-red"
      >
        ← Propiedades
      </Link>
      <h1 className="section-title mb-2 mt-4 text-[30px] leading-tight text-santerra-graphite md:text-[40px]">
        {property.title}
      </h1>
      <p className="mb-8 text-[13px] text-santerra-gray-mid">
        /propiedades/<span className="text-santerra-red">{property.id}</span>
      </p>
      <PropertyForm initial={property} />
    </div>
  );
}
