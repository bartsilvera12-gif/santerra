"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { EASE } from "@/lib/animations";

/**
 * Dialogo de confirmacion propio.
 *
 * Reemplaza a window.confirm, que el navegador dibuja con su estilo y
 * anunciando el dominio, algo que desentona con el panel.
 */
export default function Confirmar({
  abierto,
  titulo,
  detalle,
  confirmar = "Borrar",
  onConfirmar,
  onCancelar,
  trabajando = false
}: {
  abierto: boolean;
  titulo: string;
  detalle?: string;
  confirmar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
  trabajando?: boolean;
}) {
  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancelar();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abierto, onCancelar]);

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
        >
          <button
            aria-label="Cancelar"
            onClick={onCancelar}
            className="absolute inset-0 bg-santerra-black/60 backdrop-blur-[2px]"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="relative w-full max-w-[440px] border-t-2 border-santerra-red bg-white p-7 shadow-[0_30px_70px_-30px_rgba(10,14,18,0.6)]"
          >
            <h2 className="section-title text-xl text-santerra-graphite">{titulo}</h2>
            {detalle && (
              <p className="mt-3 text-[14px] leading-relaxed text-santerra-gray-mid">{detalle}</p>
            )}

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={onCancelar}
                disabled={trabajando}
                className="border border-santerra-gray-line px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-santerra-graphite transition hover:border-santerra-graphite disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirmar}
                disabled={trabajando}
                autoFocus
                className="bg-santerra-red px-6 py-3 text-[12px] uppercase tracking-[0.18em] text-white transition hover:bg-santerra-red-dark disabled:opacity-60"
              >
                {trabajando ? "Borrando…" : confirmar}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
