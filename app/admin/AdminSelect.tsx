"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/animations";

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  /** Opcion vacia al principio, para los filtros. */
  placeholder?: string;
  className?: string;
};

/**
 * Reemplaza al <select> nativo, que en Windows se dibuja con los colores del
 * sistema (el celeste del resaltado) y no acompaña al resto del panel.
 */
export default function AdminSelect({
  value,
  onChange,
  options,
  placeholder,
  className = ""
}: Props) {
  const [open, setOpen] = useState(false);
  const [activo, setActivo] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const items = placeholder ? [{ value: "", label: placeholder }, ...options] : options;
  const actual = items.find((o) => o.value === value);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (open) setActivo(Math.max(0, items.findIndex((o) => o.value === value)));
  }, [open, value, items]);

  function onKey(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActivo((v) => Math.min(items.length - 1, v + 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActivo((v) => Math.max(0, v - 1));
    }
    if (e.key === "Enter" && activo >= 0) {
      e.preventDefault();
      onChange(items[activo].value);
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKey}
        className={`flex w-full items-center justify-between gap-3 border bg-white px-4 py-3 text-left text-[14px] outline-none transition-colors ${
          open ? "border-santerra-red" : "border-santerra-gray-line hover:border-santerra-gray-mid"
        } ${actual?.value ? "text-santerra-graphite" : "text-santerra-gray-mid"}`}
      >
        <span className="truncate">{actual?.label ?? placeholder ?? ""}</span>
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="shrink-0 text-santerra-gray-mid"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 origin-top overflow-y-auto border border-santerra-gray-line bg-white py-1.5 shadow-[0_18px_44px_-16px_rgba(10,14,18,0.35)]"
          >
            {items.map((o, i) => {
              const elegido = o.value === value;
              const resaltado = i === activo;
              return (
                <li key={o.value || "__vacio"}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={elegido}
                    onMouseEnter={() => setActivo(i)}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] transition-colors ${
                      resaltado ? "bg-santerra-gray" : ""
                    } ${elegido ? "font-medium text-santerra-red" : "text-santerra-graphite"}`}
                  >
                    <span
                      className={`h-4 w-1 transition-colors ${
                        elegido || resaltado ? "bg-santerra-red" : "bg-transparent"
                      }`}
                    />
                    <span className="flex-1">{o.label}</span>
                    {elegido && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="text-santerra-red"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
