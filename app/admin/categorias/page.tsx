import { getCategories } from "@/lib/supabase/queries";
import CategoriesEditor from "./CategoriesEditor";

export const dynamic = "force-dynamic";

export default async function AdminCategorias() {
  const cats = await getCategories();

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-[2px] w-8 bg-santerra-red" />
        <span className="text-[11px] uppercase tracking-[0.28em] text-santerra-gray-mid">Home</span>
      </div>
      <h1 className="section-title text-[30px] leading-tight text-santerra-graphite md:text-[40px]">
        Categorías
      </h1>
      <p className="mb-8 mt-3 max-w-2xl text-[14px] leading-relaxed text-santerra-gray-mid">
        Son las tarjetas de la sección “Oportunidades” del inicio. El conteo de propiedades se
        calcula solo.
      </p>

      <CategoriesEditor initial={cats} />
    </div>
  );
}
