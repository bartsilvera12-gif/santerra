"use client";

import { Suspense, useEffect, useState } from "react";
import PropertyDetail from "../PropertyDetail";

/**
 * Detalle para propiedades que no existian al compilar.
 *
 * El .htaccess deriva /propiedades/<id>/ hasta aca cuando esa carpeta no
 * existe. Esa reescritura es interna: el navegador sigue mostrando la URL
 * original, asi que el ?id= que agrega Apache no llega al JavaScript. Por eso
 * el id se saca del propio camino de la URL, y el parametro queda solo como
 * respaldo para cuando se entra directo a /propiedades/detalle/?id=...
 */
function idDesdeUrl(): string {
  if (typeof window === "undefined") return "";

  const porParametro = new URLSearchParams(window.location.search).get("id");
  if (porParametro) return porParametro;

  const partes = window.location.pathname.split("/").filter(Boolean);
  const ultima = partes[partes.length - 1] ?? "";

  // Si se entro directo a /propiedades/detalle/ no hay id que valga.
  if (ultima === "detalle" || ultima === "propiedades") return "";
  return decodeURIComponent(ultima);
}

function Contenido() {
  const [id, setId] = useState<string | null>(null);

  // Se resuelve despues del montaje porque depende de window.
  useEffect(() => setId(idDesdeUrl()), []);

  if (id === null) return null;
  return <PropertyDetail id={id} />;
}

export default function DetallePorId() {
  return (
    <Suspense fallback={null}>
      <Contenido />
    </Suspense>
  );
}
