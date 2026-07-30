"use client";

import { useRef } from "react";

/**
 * Agrupa de a tres los numeros largos, con punto como separador de miles.
 *
 * Se toma cada tirada de digitos y puntos, se le sacan los puntos y se vuelve
 * a agrupar. Reagrupar desde cero es necesario porque si no, al escribir el
 * quinto digito sobre "1.000" el punto ya puesto parte la secuencia y queda
 * "1.0.000".
 *
 * Las tiradas de menos de 4 digitos quedan intactas, para no tocar cosas como
 * "x3" o "1.5".
 */
export function formatearMiles(texto: string): string {
  return texto.replace(/[\d.]*\d[\d.]*/g, (tirada) => {
    const digitos = tirada.replace(/\./g, "");
    if (digitos.length < 4) return tirada;
    return digitos.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  });
}

/** Cuantos digitos hay antes de una posicion del texto. */
function digitosAntes(texto: string, pos: number): number {
  let n = 0;
  for (let i = 0; i < pos && i < texto.length; i++) {
    if (texto[i] >= "0" && texto[i] <= "9") n++;
  }
  return n;
}

/** Posicion que deja el cursor despues de una cantidad de digitos. */
function posicionTrasDigitos(texto: string, digitos: number): number {
  if (digitos === 0) return 0;
  let n = 0;
  for (let i = 0; i < texto.length; i++) {
    if (texto[i] >= "0" && texto[i] <= "9") {
      n++;
      if (n === digitos) return i + 1;
    }
  }
  return texto.length;
}

export default function PriceField({
  value,
  onChange,
  className = "",
  placeholder,
  required = false
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <input
      ref={ref}
      value={value}
      placeholder={placeholder}
      required={required}
      className={className}
      onChange={(e) => {
        const crudo = e.target.value;
        const caret = e.target.selectionStart ?? crudo.length;
        const digitos = digitosAntes(crudo, caret);

        const formateado = formatearMiles(crudo);
        onChange(formateado);

        // Al insertar puntos el texto se alarga y el cursor se iria al final,
        // asi que se reubica contando digitos en vez de caracteres.
        if (formateado !== crudo) {
          const nueva = posicionTrasDigitos(formateado, digitos);
          requestAnimationFrame(() => {
            ref.current?.setSelectionRange(nueva, nueva);
          });
        }
      }}
    />
  );
}
