import { NextResponse } from "next/server";
import { extraerCoordenadas, esUrlDeMapsPermitida } from "@/lib/maps";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail, isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

/**
 * Resuelve un link de Google Maps y devuelve sus coordenadas.
 *
 * Hace falta el servidor porque los links cortos (maps.app.goo.gl) responden
 * con una redireccion que el navegador no puede seguir por CORS.
 */
export async function POST(request: Request) {
  // Solo el panel puede usar esto: si no, seria un proxy de fetch abierto.
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!isAdminEmail(user?.email)) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }
  }

  let url: string;
  try {
    const body = await request.json();
    url = String(body?.url ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Pedido invalido." }, { status: 400 });
  }

  if (!url) {
    return NextResponse.json({ error: "Pegá el link de Google Maps." }, { status: 400 });
  }

  if (!esUrlDeMapsPermitida(url)) {
    return NextResponse.json(
      { error: "El link tiene que ser de Google Maps (google.com/maps o maps.app.goo.gl)." },
      { status: 400 }
    );
  }

  // Si el link ya trae las coordenadas, no hace falta salir a la red.
  const directo = extraerCoordenadas(url);
  if (directo) return NextResponse.json(directo);

  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        // Sin un user agent de navegador, Google devuelve una version reducida
        // que a veces no incluye las coordenadas.
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        "accept-language": "es"
      },
      signal: AbortSignal.timeout(10_000)
    });

    // La URL final de la redireccion es la fuente confiable: trae el punto del
    // lugar. No leemos el HTML a proposito, ver el comentario en lib/maps.ts.
    const desdeUrl = extraerCoordenadas(res.url);
    if (desdeUrl) return NextResponse.json(desdeUrl);

    return NextResponse.json(
      {
        error:
          "Ese link no trae coordenadas. Abrilo en Google Maps y copiá el link largo desde la barra de direcciones, o marcá el punto y usá “Compartir”."
      },
      { status: 422 }
    );
  } catch {
    return NextResponse.json(
      { error: "No se pudo resolver el link. Revisá que sea correcto y volvé a intentar." },
      { status: 502 }
    );
  }
}
