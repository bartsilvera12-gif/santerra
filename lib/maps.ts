export type LatLng = { lat: number; lng: number };

/**
 * Dominios de Google que aceptamos resolver, para no convertir la ruta en un
 * proxy abierto.
 *
 * El sufijo se limita a uno o dos rotulos de 2 o 3 letras (com, com.py, co.uk).
 * Escribirlo como [a-z.]+ dejaria pasar google.com.dominio-ajeno.com, porque el
 * punto quedaria permitido dentro del sufijo.
 */
const SUFIJO = String.raw`(\.[a-z]{2,3}){1,2}`;

const DOMINIOS_PERMITIDOS = [
  /^maps\.app\.goo\.gl$/i,
  /^goo\.gl$/i,
  new RegExp(`^maps\\.google${SUFIJO}$`, "i"),
  new RegExp(`^(www\\.)?google${SUFIJO}$`, "i")
];

export function esUrlDeMapsPermitida(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    return DOMINIOS_PERMITIDOS.some((re) => re.test(url.hostname));
  } catch {
    return false;
  }
}

function valido(lat: number, lng: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

/**
 * Saca las coordenadas de una URL de Google Maps ya resuelta.
 *
 * Se prueban varios formatos en orden de precision: !3d!4d marca el punto
 * exacto del lugar, mientras que @ es el centro de la vista, que puede estar
 * corrido si el usuario movio el mapa antes de copiar.
 */
export function extraerCoordenadas(texto: string): LatLng | null {
  const patrones: { re: RegExp; invertido?: boolean }[] = [
    { re: /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/ }, // punto exacto del lugar
    { re: /@(-?\d+\.\d+),(-?\d+\.\d+)/ }, // centro de la vista
    { re: /[?&](?:q|query|ll|center|daddr)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/ },
    { re: /\/search\/(-?\d+\.\d+),\+?(-?\d+\.\d+)/ }
  ];

  // Nota: el HTML de Google trae coordenadas en APP_INITIALIZATION_STATE, pero
  // probado con dos lugares distintos devolvio el mismo punto: es el centro por
  // defecto del mapa, no el del lugar. Usarlo guardaria ubicaciones erroneas sin
  // avisar, asi que preferimos fallar y pedir el link largo.

  for (const { re, invertido } of patrones) {
    const m = texto.match(re);
    if (!m) continue;
    const a = Number(m[1]);
    const b = Number(m[2]);
    const lat = invertido ? b : a;
    const lng = invertido ? a : b;
    if (valido(lat, lng)) return { lat, lng };
  }

  return null;
}
