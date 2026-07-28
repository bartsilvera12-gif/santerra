"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { EASE } from "@/lib/animations";

type Props = {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  variant?: "light" | "dark";
};

export default function Select({
  label,
  placeholder,
  options,
  value,
  onChange,
  variant = "light"
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((v) => Math.min(options.length - 1, v + 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((v) => Math.max(0, v - 1));
      }
      if (e.key === "Enter" && active >= 0) {
        e.preventDefault();
        onChange(options[active]);
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, active, options, onChange]);

  useEffect(() => {
    if (open) setActive(Math.max(0, options.indexOf(value)));
  }, [open, options, value]);

  const isDark = variant === "dark";
  const labelColor = isDark ? "text-white/70" : "text-santerra-graphite";
  const triggerText = value ? (isDark ? "text-white" : "text-santerra-graphite") : (isDark ? "text-white/50" : "text-santerra-gray-mid");

  return (
    <div ref={wrapRef} className="flex-1 min-w-[160px] relative">
      <span className={`block text-[11px] font-semibold ${labelColor} tracking-wide mb-1`}>{label}</span>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`group w-full flex items-center justify-between gap-2 text-[14px] ${triggerText} bg-transparent border-b transition-colors duration-300 py-1.5 pr-1 text-left outline-none ${
          open
            ? "border-santerra-red"
            : isDark
              ? "border-white/20 hover:border-white/50"
              : "border-transparent hover:border-santerra-gray-line"
        }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <motion.svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={isDark ? "text-white/60" : "text-santerra-gray-mid"}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
            className={`absolute z-50 left-0 right-0 top-full mt-2 origin-top overflow-hidden py-2 max-h-64 overflow-y-auto shadow-[0_18px_44px_-16px_rgba(10,14,18,0.35)] border ${
              isDark
                ? "bg-santerra-graphite border-white/10 text-white"
                : "bg-white border-santerra-gray-line text-santerra-graphite"
            }`}
          >
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-3 transition-colors ${
                  isDark ? "text-white/50 hover:text-white hover:bg-white/5" : "text-santerra-gray-mid hover:text-santerra-graphite hover:bg-santerra-gray"
                }`}
              >
                {placeholder}
              </button>
            </li>
            {options.map((o, i) => {
              const selected = o === value;
              const isActive = i === active;
              return (
                <li key={o}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => {
                      onChange(o);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-3 transition-colors relative ${
                      isActive
                        ? isDark
                          ? "bg-white/5"
                          : "bg-santerra-gray"
                        : ""
                    } ${selected ? "text-santerra-red font-medium" : ""}`}
                  >
                    <span
                      className={`w-1 h-4 transition-all duration-300 ${
                        selected || isActive ? "bg-santerra-red" : "bg-transparent"
                      }`}
                    />
                    <span className="flex-1">{o}</span>
                    {selected && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-santerra-red">
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
