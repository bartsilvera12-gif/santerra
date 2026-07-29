"use client";

import { useEffect, useState } from "react";

/**
 * Campo numerico que se puede dejar vacio mientras se escribe.
 *
 * Con un input controlado por un number, al borrar el contenido llega "" y
 * Number("") devuelve 0, asi que el cero reaparece de inmediato y no hay forma
 * de vaciar el campo para tipear otro valor. Aca el texto se guarda aparte y el
 * vacio se informa como 0 hacia afuera.
 */
export default function NumberField({
  value,
  onChange,
  className = "",
  min = 0
}: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
  min?: number;
}) {
  const [texto, setTexto] = useState(String(value));

  // Si el valor cambia desde afuera (por ejemplo al cargar otra propiedad),
  // se refleja, pero sin pisar lo que el usuario esta tipeando.
  useEffect(() => {
    setTexto((actual) => (Number(actual) === value ? actual : String(value)));
  }, [value]);

  return (
    <input
      type="text"
      inputMode="numeric"
      value={texto}
      onChange={(e) => {
        const t = e.target.value;
        if (t !== "" && !/^\d+$/.test(t)) return; // solo enteros
        setTexto(t);
        onChange(t === "" ? min : Number(t));
      }}
      onBlur={() => {
        if (texto === "") setTexto(String(min));
      }}
      className={className}
    />
  );
}
