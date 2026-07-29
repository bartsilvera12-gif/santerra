import type { Metadata } from "next";
import PropertiesClient from "./PropertiesClient";
import { getProperties } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Propiedades — Santerra",
  description: "Explorá casas, departamentos, terrenos y locales comerciales en todo Paraguay."
};

export default async function PropiedadesPage() {
  // Los filtros (?tipo=&op=&ubi=) los lee el cliente con useSearchParams,
  // porque en export estatico esta pagina se prerenderiza sin request.
  const properties = await getProperties();
  return <PropertiesClient properties={properties} />;
}
