"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const nav = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/propiedades", label: "Propiedades" },
  { href: "/admin/categorias", label: "Categorías" }
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // El login trae su propia pantalla completa, sin barra lateral.
  if (pathname === "/admin/login") return <>{children}</>;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-santerra-gray">
      <header className="border-b border-santerra-gray-line bg-white">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-10">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="shrink-0">
              <img src="/images/logo.png" alt="Santerra" className="h-9 w-auto" />
            </Link>
            <nav className="flex items-center gap-5">
              {nav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`border-b-2 pb-1 text-[12px] uppercase tracking-[0.16em] transition-colors ${
                    isActive(l.href)
                      ? "border-santerra-red text-santerra-graphite"
                      : "border-transparent text-santerra-gray-mid hover:text-santerra-graphite"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="/"
              target="_blank"
              className="text-[12px] uppercase tracking-[0.16em] text-santerra-gray-mid transition hover:text-santerra-red"
            >
              Ver sitio
            </Link>
            <button
              onClick={logout}
              className="text-[12px] uppercase tracking-[0.16em] text-santerra-gray-mid transition hover:text-santerra-red"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-5 py-10 md:px-10">{children}</main>
    </div>
  );
}
