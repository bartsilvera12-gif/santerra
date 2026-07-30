export type Operation = "VENTA" | "ALQUILER";
export type PropertyType = "Casa" | "Departamento" | "Terreno" | "Comercial";

export type Property = {
  id: string;
  title: string;
  location: string;
  city: string;
  beds: number;
  baths: number;
  area: number;
  price: string;
  operation: Operation;
  type: PropertyType;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  lat: number;
  lng: number;
  /** Aparece en la seccion Propiedades Destacadas del inicio. */
  featured?: boolean;
};

export const properties: Property[] = [
  {
    id: "residencia-san-bernardino",
    title: "Residencia en San Bernardino",
    location: "San Bernardino, Cordillera",
    city: "San Bernardino",
    beds: 4,
    baths: 4,
    area: 420,
    price: "USD 690.000",
    operation: "VENTA",
    type: "Casa",
    image: "/images/property-1.png",
    gallery: ["/images/property-1.png", "/images/property-2.png", "/images/property-3.png"],
    description:
      "Residencia contemporánea con piscina, jardín amplio y vista al lago. Terminaciones premium, cocina integrada y suite principal con vestidor.",
    features: ["Piscina", "Jardín 800 m²", "Cochera x2", "Parrillero", "Suite principal", "Domótica"],
    lat: -25.2833,
    lng: -57.2989
  },
  {
    id: "departamento-lujo-asuncion",
    title: "Departamento de lujo en Asunción",
    location: "Villa Morra, Asunción",
    city: "Asunción",
    beds: 3,
    baths: 3,
    area: 180,
    price: "USD 2.400 / mes",
    operation: "ALQUILER",
    type: "Departamento",
    image: "/images/property-2.png",
    gallery: ["/images/property-2.png", "/images/property-3.png", "/images/property-1.png"],
    description:
      "Departamento en piso alto con vista panorámica, terraza privada y amenities completos: piscina, gimnasio y seguridad 24/7.",
    features: ["Vista panorámica", "Terraza", "Gimnasio", "Piscina", "2 cocheras", "Seguridad 24hs"],
    lat: -25.2989,
    lng: -57.5680
  },
  {
    id: "casa-contemporanea-luque",
    title: "Casa contemporánea con piscina",
    location: "Luque, Central",
    city: "Luque",
    beds: 5,
    baths: 4,
    area: 520,
    price: "USD 520.000",
    operation: "VENTA",
    type: "Casa",
    image: "/images/property-3.png",
    gallery: ["/images/property-3.png", "/images/property-1.png", "/images/property-2.png"],
    description:
      "Casa moderna en barrio cerrado, 5 dormitorios en suite, quincho, piscina climatizada y amplios espacios abiertos.",
    features: ["Barrio cerrado", "Piscina climatizada", "Quincho", "Cochera x3", "Estudio", "Panel solar"],
    lat: -25.2686,
    lng: -57.4869
  },
  {
    id: "loft-villa-morra",
    title: "Loft moderno en zona premium",
    location: "Villa Morra, Asunción",
    city: "Asunción",
    beds: 2,
    baths: 2,
    area: 140,
    price: "USD 1.600 / mes",
    operation: "ALQUILER",
    type: "Departamento",
    image: "/images/property-1.png",
    gallery: ["/images/property-1.png", "/images/property-2.png"],
    description:
      "Loft de doble altura con diseño de autor, terminaciones industriales y ubicación inmejorable a metros del corredor gastronómico.",
    features: ["Doble altura", "Amoblado", "Balcón", "1 cochera", "Amenities"],
    lat: -25.3010,
    lng: -57.5701
  },
  {
    id: "chalet-lago-san-bernardino",
    title: "Chalet frente al lago",
    location: "San Bernardino, Cordillera",
    city: "San Bernardino",
    beds: 4,
    baths: 3,
    area: 380,
    price: "USD 480.000",
    operation: "VENTA",
    type: "Casa",
    image: "/images/property-2.png",
    gallery: ["/images/property-2.png", "/images/property-3.png"],
    description:
      "Chalet a orillas del lago Ypacaraí, muelle privado, deck de madera y vistas al atardecer desde todos los ambientes.",
    features: ["Muelle privado", "Deck", "Chimenea", "Cochera x2", "Jardín 1.200 m²"],
    lat: -25.2760,
    lng: -57.3050
  },
  {
    id: "terreno-encarnacion",
    title: "Terreno costero en Encarnación",
    location: "Costanera, Encarnación",
    city: "Encarnación",
    beds: 0,
    baths: 0,
    area: 1250,
    price: "USD 320.000",
    operation: "VENTA",
    type: "Terreno",
    image: "/images/property-3.png",
    gallery: ["/images/property-3.png"],
    description:
      "Terreno con excelente exposición sobre la costanera, ideal para desarrollo residencial o comercial de alta categoría.",
    features: ["Frente 25 m", "Servicios completos", "Uso mixto", "Vista al río"],
    lat: -27.3363,
    lng: -55.8672
  },
  {
    id: "local-comercial-asuncion",
    title: "Local comercial en corredor gastronómico",
    location: "Villa Morra, Asunción",
    city: "Asunción",
    beds: 0,
    baths: 2,
    area: 320,
    price: "USD 4.800 / mes",
    operation: "ALQUILER",
    type: "Comercial",
    image: "/images/property-1.png",
    gallery: ["/images/property-1.png"],
    description:
      "Local en esquina, doble frente vidriado, salón amplio, depósito y sanitarios. Altísimo tránsito peatonal.",
    features: ["Doble frente", "320 m²", "Depósito", "Estacionamiento", "Aire acondicionado"],
    lat: -25.2960,
    lng: -57.5721
  },
  {
    id: "terreno-luque",
    title: "Terreno en barrio cerrado",
    location: "Luque, Central",
    city: "Luque",
    beds: 0,
    baths: 0,
    area: 850,
    price: "USD 180.000",
    operation: "VENTA",
    type: "Terreno",
    image: "/images/property-2.png",
    gallery: ["/images/property-2.png"],
    description:
      "Lote en barrio cerrado con seguridad 24hs, club house, canchas y áreas verdes. Listo para construir.",
    features: ["Barrio cerrado", "Club house", "Canchas", "Seguridad 24hs"],
    lat: -25.2701,
    lng: -57.4820
  }
];

export function getProperty(id: string): Property | undefined {
  return properties.find((p) => p.id === id);
}
