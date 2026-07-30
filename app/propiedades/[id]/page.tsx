import type { Metadata } from "next";
import { getProperties, getPropertyById } from "@/lib/supabase/queries";
import PropertyDetail from "../PropertyDetail";

/**
 * Se prerenderiza una pagina por cada propiedad que exista al compilar, para
 * que tengan URL propia y metadatos indexables. Las creadas despues no pasan
 * por aca: el .htaccess las manda a /propiedades/detalle/, que resuelve por id.
 */
export async function generateStaticParams() {
  const items = await getProperties();
  return items.map((p) => ({ id: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params
}: {
  params: { id: string };
}): Promise<Metadata> {
  const p = await getPropertyById(params.id);
  if (!p) return { title: "Propiedad no encontrada" };
  return {
    title: `${p.title} — Santerra`,
    description: p.description
  };
}

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const inicial = await getPropertyById(params.id);
  return <PropertyDetail id={params.id} initial={inicial} />;
}
