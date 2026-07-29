"use client";

/**
 * Boton de carga de archivos.
 *
 * El input nativo dibuja su propio boton con un texto que pone el navegador
 * ("Seleccionar archivo"), largo y no traducible, que se recorta en columnas
 * angostas. Aca el input queda oculto y el disparador es una etiqueta propia.
 */
export default function FileButton({
  onFiles,
  children = "Subir imagen",
  multiple = false,
  disabled = false,
  className = ""
}: {
  onFiles: (files: FileList | null) => void;
  children?: React.ReactNode;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <label
      className={`flex w-full cursor-pointer items-center justify-center gap-2 bg-santerra-graphite px-3 py-2.5 text-center text-[11px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-santerra-red ${
        disabled ? "pointer-events-none opacity-60" : ""
      } ${className}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
        aria-hidden="true"
      >
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
      </svg>
      <span className="truncate">{children}</span>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          onFiles(e.target.files);
          // Se limpia para poder volver a elegir el mismo archivo.
          e.target.value = "";
        }}
        className="hidden"
      />
    </label>
  );
}
