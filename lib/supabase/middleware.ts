import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isAdminEmail,
  isSupabaseConfigured
} from "./config";

/**
 * Refresca la sesion en cada request y bloquea /admin para quien no inicio
 * sesion. /admin/login queda siempre accesible.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!isSupabaseConfigured) {
    // Sin credenciales no hay forma de autenticar: se deja pasar solo el login,
    // que muestra el aviso de configuracion pendiente.
    if (isLogin) return response;
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Sesion valida pero de un correo que no esta habilitado.
  if (user && !isAdminEmail(user.email) && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    url.searchParams.set("error", "no-autorizado");
    return NextResponse.redirect(url);
  }

  if (user && isAdminEmail(user.email) && isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
