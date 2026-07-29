"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isAdminEmail, isSupabaseConfigured } from "@/lib/supabase/config";

type Estado = "checking" | "ok" | "forbidden";

/**
 * Guarda todas las paginas de /admin (menos /admin/login).
 *
 * En el sitio estatico no hay middleware, asi que la verificacion pasa a ser
 * en el cliente. Igual la unica proteccion real es RLS del schema de Supabase:
 * este guard solo evita mostrar el panel a alguien sin sesion, pero no cuida
 * los datos por si mismo.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>("checking");

  useEffect(() => {
    let vivo = true;
    (async () => {
      if (!isSupabaseConfigured) {
        // Sin credenciales dejamos entrar para poder ver la maqueta.
        if (vivo) setEstado("ok");
        return;
      }
      const supabase = createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!vivo) return;

      if (!user || !isAdminEmail(user.email)) {
        setEstado("forbidden");
        router.replace("/admin/login/");
        return;
      }
      setEstado("ok");
    })();
    return () => {
      vivo = false;
    };
  }, [router]);

  if (estado === "checking") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[11px] uppercase tracking-[0.28em] text-santerra-gray-mid">
        Cargando…
      </div>
    );
  }

  if (estado === "forbidden") return null;

  return <>{children}</>;
}
