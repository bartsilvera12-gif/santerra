// Supabase Edge Function — resolve-maps
//
// Recibe un link de Google Maps (corto o largo), sigue las redirecciones y
// devuelve las coordenadas. El navegador no puede hacer esto por CORS,
// pero acá corre en Deno de Supabase asi que no hay problema.
//
// Deploy con:  supabase functions deploy resolve-maps --no-verify-jwt
// (o `--verify-jwt` si querés exigir sesion; el panel siempre logea antes).

// deno-lint-ignore-file no-explicit-any

const SUFIJO = String.raw`(\.[a-z]{2,3}){1,2}`;
const DOMINIOS = [
  /^maps\.app\.goo\.gl$/i,
  /^goo\.gl$/i,
  new RegExp(`^maps\\.google${SUFIJO}$`, "i"),
  new RegExp(`^(www\\.)?google${SUFIJO}$`, "i")
];

function esUrlDeMapsPermitida(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    return DOMINIOS.some((re) => re.test(url.hostname));
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

function extraerCoordenadas(texto: string): { lat: number; lng: number } | null {
  const patrones: RegExp[] = [
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /[?&](?:q|query|ll|center|daddr)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/,
    /\/search\/(-?\d+\.\d+),\+?(-?\d+\.\d+)/
  ];
  for (const re of patrones) {
    const m = texto.match(re);
    if (!m) continue;
    const lat = Number(m[1]);
    const lng = Number(m[2]);
    if (valido(lat, lng)) return { lat, lng };
  }
  return null;
}

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "authorization, content-type, apikey, x-client-info"
};

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...CORS }
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Metodo no permitido." }, 405);

  let url = "";
  try {
    const body = await req.json();
    url = String(body?.url ?? "").trim();
  } catch {
    return json({ error: "Pedido invalido." }, 400);
  }

  if (!url) return json({ error: "Pegá el link de Google Maps." }, 400);
  if (!esUrlDeMapsPermitida(url)) {
    return json(
      { error: "El link tiene que ser de Google Maps (google.com/maps o maps.app.goo.gl)." },
      400
    );
  }

  // Si el link ya trae coordenadas, no hace falta salir a la red.
  const directo = extraerCoordenadas(url);
  if (directo) return json(directo);

  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        "accept-language": "es"
      },
      signal: AbortSignal.timeout(10_000)
    });

    // La URL final de la redireccion suele traer el punto del lugar.
    const desdeUrl = extraerCoordenadas(res.url);
    if (desdeUrl) return json(desdeUrl);

    return json(
      {
        error:
          "Ese link no trae coordenadas. Abrilo en Google Maps y copiá el link largo desde la barra de direcciones, o marcá el punto y usá “Compartir”."
      },
      422
    );
  } catch (_e) {
    return json(
      { error: "No se pudo resolver el link. Revisá que sea correcto y volvé a intentar." },
      502
    );
  }
});
