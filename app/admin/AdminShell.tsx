"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const nav = [
  {
    href: "/admin",
    label: "Resumen",
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    )
  },
  {
    href: "/admin/propiedades",
    label: "Propiedades",
    icon: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M10 21v-6h4v6" />
      </>
    )
  },
  {
    href: "/admin/categorias",
    label: "Categorías",
    icon: (
      <>
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </>
    )
  },
  {
    href: "/admin/contacto",
    label: "Contacto",
    icon: (
      <>
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.1 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
      </>
    )
  }
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [plegada, setPlegada] = useState(false);

  // Al navegar se cierra el panel lateral en celular.
  useEffect(() => setOpen(false), [pathname]);

  // Se recuerda si la barra quedo plegada. Se lee despues del montaje para
  // que el HTML del servidor y el del cliente coincidan.
  useEffect(() => {
    setPlegada(localStorage.getItem("admin-barra-plegada") === "1");
  }, []);

  function alternarPlegada() {
    setPlegada((v) => {
      localStorage.setItem("admin-barra-plegada", v ? "0" : "1");
      return !v;
    });
  }

  // El login trae su propia pantalla completa, sin barra lateral.
  // El export estatico usa trailingSlash, asi que la ruta llega como
  // "/admin/login/". Se normaliza para que las comparaciones no dependan
  // de la barra final.
  const ruta = pathname.replace(/\/+$/, "") || "/";

  if (ruta === "/admin/login") return <>{children}</>;

  const isActive = (href: string) =>
    href === "/admin" ? ruta === "/admin" : ruta.startsWith(href);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  /** compacta = solo iconos, para la barra plegada en escritorio. */
  const barra = (compacta: boolean) => (
    <div className="flex h-full flex-col">
      <div
        className={`flex items-center border-b border-santerra-gray-line py-6 ${
          compacta ? "justify-center px-3" : "px-6"
        }`}
      >
        <Link href="/admin" className="block" title="Santerra">
          <img
            src={compacta ? "/favicon.png" : "/images/logo.png"}
            alt="Santerra"
            className={compacta ? "h-8 w-8 object-contain" : "h-9 w-auto"}
          />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-6">
        {nav.map((l) => {
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              title={compacta ? l.label : undefined}
              className={`mb-1 flex items-center gap-3 border-l-2 py-3 text-[12px] uppercase tracking-[0.16em] transition-colors ${
                compacta ? "justify-center px-0" : "px-4"
              } ${
                active
                  ? "border-santerra-red bg-santerra-gray text-santerra-graphite"
                  : "border-transparent text-santerra-gray-mid hover:bg-santerra-gray hover:text-santerra-graphite"
              }`}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`shrink-0 ${active ? "text-santerra-red" : ""}`}
                aria-hidden="true"
              >
                {l.icon}
              </svg>
              {!compacta && l.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-santerra-gray-line px-3 py-4">
        <Link
          href="/"
          target="_blank"
          title={compacta ? "Ver sitio" : undefined}
          className={`flex items-center gap-3 py-2.5 text-[12px] uppercase tracking-[0.16em] text-santerra-gray-mid transition hover:text-santerra-red ${
            compacta ? "justify-center px-0" : "px-4"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="shrink-0" aria-hidden="true">
            <path d="M14 4h6v6" />
            <path d="M20 4 10 14" />
            <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
          </svg>
          {!compacta && "Ver sitio"}
        </Link>
        <button
          onClick={logout}
          title={compacta ? "Salir" : undefined}
          className={`flex w-full items-center gap-3 py-2.5 text-[12px] uppercase tracking-[0.16em] text-santerra-gray-mid transition hover:text-santerra-red ${
            compacta ? "justify-center px-0" : "px-4"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="shrink-0" aria-hidden="true">
            <path d="M15 17l5-5-5-5" />
            <path d="M20 12H9" />
            <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />
          </svg>
          {!compacta && "Salir"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-santerra-gray">
      {/* Barra lateral fija en escritorio */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-santerra-gray-line bg-white transition-[width] duration-300 ease-santerra md:block ${
          plegada ? "w-[76px]" : "w-60"
        }`}
      >
        {barra(plegada)}

        <button
          onClick={alternarPlegada}
          aria-label={plegada ? "Mostrar la barra" : "Ocultar la barra"}
          aria-expanded={!plegada}
          title={plegada ? "Mostrar la barra" : "Ocultar la barra"}
          className="absolute -right-3 top-24 flex h-7 w-7 items-center justify-center rounded-full border border-santerra-gray-line bg-white text-santerra-gray-mid shadow-[0_2px_8px_-2px_rgba(10,14,18,0.25)] transition hover:border-santerra-red hover:text-santerra-red"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${plegada ? "rotate-180" : ""}`}
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </aside>

      {/* Barra superior con menu en celular */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-santerra-gray-line bg-white px-5 py-3 md:hidden">
        <Link href="/admin">
          <img src="/images/logo.png" alt="Santerra" className="h-8 w-auto" />
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Abrir menú" className="p-2">
          <span className="mb-1.5 block h-[2px] w-6 bg-santerra-graphite" />
          <span className="mb-1.5 block h-[2px] w-6 bg-santerra-graphite" />
          <span className="block h-[2px] w-6 bg-santerra-graphite" />
        </button>
      </header>

      {/* Panel lateral desplegable en celular */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-santerra-black/50"
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">{barra(false)}</aside>
        </div>
      )}

      <main
        className={`transition-[margin] duration-300 ease-santerra ${
          plegada ? "md:ml-[76px]" : "md:ml-60"
        }`}
      >
        <div className="max-w-[1240px] px-5 py-8 md:px-10 md:py-12">{children}</div>
      </main>
    </div>
  );
}
