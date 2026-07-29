"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Supabase devuelve los errores en ingles; los mas comunes al configurar. */
function traducirError(message: string) {
  const map: Record<string, string> = {
    "Invalid login credentials": "Usuario o contraseña incorrectos.",
    "Email not confirmed":
      "El usuario existe pero el correo no está confirmado. En Supabase, Authentication → Users, abrí el usuario y confirmalo.",
    "Email logins are disabled":
      "El ingreso por correo está desactivado. Activalo en Supabase, Authentication → Providers → Email."
  };
  if (map[message]) return map[message];
  if (message.includes("Failed to fetch")) {
    return "No se pudo conectar con Supabase. Revisá que NEXT_PUBLIC_SUPABASE_URL sea correcta.";
  }
  return message;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(traducirError(error.message));
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="border-l-2 border-santerra-red bg-white p-6 text-sm leading-relaxed text-santerra-gray-mid">
        <p className="section-title mb-3 text-lg text-santerra-graphite">Falta configurar Supabase</p>
        <p>
          Creá el archivo <code className="text-santerra-red">.env.local</code> en la raíz del
          proyecto con <code className="text-santerra-red">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
          <code className="text-santerra-red">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, y reiniciá el
          servidor.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="bg-white p-8 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
      <label className="mb-5 block">
        <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-santerra-gray-mid">
          Correo
        </span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          className="w-full border border-santerra-gray-line px-4 py-3 text-[15px] text-santerra-graphite outline-none transition focus:border-santerra-red"
        />
      </label>

      <label className="mb-6 block">
        <span className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-santerra-gray-mid">
          Contraseña
        </span>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full border border-santerra-gray-line px-4 py-3 text-[15px] text-santerra-graphite outline-none transition focus:border-santerra-red"
        />
      </label>

      {error && (
        <p className="mb-5 border-l-2 border-santerra-red bg-santerra-gray px-4 py-3 text-[13px] text-santerra-graphite">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-santerra-red px-6 py-3.5 text-[12px] uppercase tracking-[0.22em] text-white transition hover:bg-santerra-red-dark disabled:opacity-60"
      >
        {loading ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-santerra-gray px-5 py-16">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <img
            src="/images/logo.png"
            alt="Santerra Negocios Inmobiliarios"
            className="mx-auto h-14 w-auto"
          />
          <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-santerra-gray-mid">
            Panel de administración
          </p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
