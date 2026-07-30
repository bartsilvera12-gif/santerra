"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PropertyDetail from "../PropertyDetail";

/**
 * Detalle para propiedades que no existian al compilar.
 *
 * En un export estatico no hay pagina generada para ellas, asi que el
 * .htaccess deriva /propiedades/<id>/ hasta aca cuando esa carpeta no existe,
 * y el id se resuelve en el navegador.
 */
function Contenido() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  return <PropertyDetail id={id} />;
}

export default function DetallePorId() {
  return (
    <Suspense fallback={null}>
      <Contenido />
    </Suspense>
  );
}
