"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Select from "./Select";

const UBICACIONES = ["Asunción", "San Bernardino", "Luque", "Cordillera", "Encarnación"];
const TIPOS = ["Casa", "Departamento", "Terreno", "Comercial"];
const OPERACIONES = ["Venta", "Alquiler"];

export default function PropertySearch() {
  const [ubi, setUbi] = useState("");
  const [tipo, setTipo] = useState("");
  const [op, setOp] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (ubi) params.set("ubi", ubi);
        if (tipo) params.set("tipo", tipo);
        if (op) params.set("op", op.toUpperCase());
        window.location.href = `/propiedades${params.toString() ? `?${params.toString()}` : ""}`;
      }}
      className="bg-white shadow-[0_20px_60px_-20px_rgba(10,14,18,0.4)] rounded-sm px-5 md:px-8 py-4 md:py-5 flex flex-wrap items-end gap-4 md:gap-8 max-w-[1120px]"
    >
      <Select label="Ubicación" placeholder="Seleccioná una ubicación" options={UBICACIONES} value={ubi} onChange={setUbi} />
      <div className="hidden md:block w-px h-10 bg-santerra-gray-line" />
      <Select label="Tipo de propiedad" placeholder="Seleccioná un tipo" options={TIPOS} value={tipo} onChange={setTipo} />
      <div className="hidden md:block w-px h-10 bg-santerra-gray-line" />
      <Select label="Operación" placeholder="Seleccioná una operación" options={OPERACIONES} value={op} onChange={setOp} />

      <motion.button
        type="submit"
        whileHover={{ backgroundColor: "#9E1F33" }}
        transition={{ duration: 0.3 }}
        className="bg-santerra-red text-white text-[14px] font-medium tracking-wide px-6 md:px-8 py-3 md:py-4 rounded-sm"
      >
        Buscar propiedades
      </motion.button>
    </form>
  );
}
