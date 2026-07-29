import Link from "next/link";
import { getAllProperties } from "@/lib/supabase/queries";
import PropertiesTable from "./PropertiesTable";

export const dynamic = "force-dynamic";

export default async function AdminPropiedades() {
  const items = await getAllProperties();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="h-[2px] w-8 bg-santerra-red" />
            <span className="text-[11px] uppercase tracking-[0.28em] text-santerra-gray-mid">
              Catálogo
            </span>
          </div>
          <h1 className="section-title text-[30px] leading-tight text-santerra-graphite md:text-[40px]">
            Propiedades
          </h1>
        </div>
        <Link
          href="/admin/propiedades/nueva"
          className="bg-santerra-red px-6 py-3.5 text-[12px] uppercase tracking-[0.22em] text-white transition hover:bg-santerra-red-dark"
        >
          Cargar propiedad
        </Link>
      </div>

      <PropertiesTable items={items} />
    </div>
  );
}
