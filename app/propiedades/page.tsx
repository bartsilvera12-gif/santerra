import type { Metadata } from "next";
import PropertiesClient from "./PropertiesClient";

export const metadata: Metadata = {
  title: "Propiedades — Santerra",
  description: "Explorá casas, departamentos, terrenos y locales comerciales en todo Paraguay."
};

export default function PropiedadesPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tipo = typeof searchParams.tipo === "string" ? searchParams.tipo : "";
  const op = typeof searchParams.op === "string" ? searchParams.op : "";
  const ubi = typeof searchParams.ubi === "string" ? searchParams.ubi : "";
  return <PropertiesClient initialTipo={tipo} initialOp={op} initialUbi={ubi} />;
}
