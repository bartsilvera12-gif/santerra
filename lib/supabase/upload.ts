import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/** Lo unico que se necesita del cliente: el token de la sesion. */
type ConSesion = {
  auth: {
    getSession: () => Promise<{ data: { session: { access_token: string } | null } }>;
  };
};

/**
 * Sube un archivo al storage sin usar supabase.storage.upload().
 *
 * Por que a mano: el cliente de Supabase manda la cabecera `x-upsert`, y el
 * gateway de esta instancia no la incluye en access-control-allow-headers.
 * El navegador entonces cancela la peticion en el preflight y el error que
 * llega es un "Failed to fetch" que no dice nada.
 *
 * Aca se usan solo cabeceras que el gateway ya autoriza: Authorization,
 * apikey y Content-Type.
 */
export async function subirArchivo(
  supabase: ConSesion,
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string } | { error: string }> {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) return { error: "Se cerró la sesión. Volvé a entrar." };

  const destino = `${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;

  let res: Response;
  try {
    res = await fetch(destino, {
      method: "POST",
      headers: {
        authorization: `Bearer ${session.access_token}`,
        apikey: SUPABASE_ANON_KEY,
        "content-type": file.type || "application/octet-stream"
      },
      body: file
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to fetch" };
  }

  if (!res.ok) {
    let detalle = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detalle = String(body?.message ?? body?.error ?? detalle);
    } catch {
      /* la respuesta puede no ser JSON */
    }
    return { error: detalle };
  }

  return { url: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}` };
}
