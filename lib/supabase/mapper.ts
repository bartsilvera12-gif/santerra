import type { Property } from "@/lib/properties";

/**
 * Normaliza una fila de la base al tipo Property que usa el sitio.
 * Vive aparte de queries.ts para poder usarse tambien desde el navegador.
 */
export function toProperty(row: Record<string, unknown>): Property {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    location: String(row.location ?? ""),
    city: String(row.city ?? ""),
    beds: Number(row.beds ?? 0),
    baths: Number(row.baths ?? 0),
    area: Number(row.area ?? 0),
    price: String(row.price ?? ""),
    operation: (row.operation as Property["operation"]) ?? "VENTA",
    type: (row.type as Property["type"]) ?? "Casa",
    image: String(row.image ?? "/images/property-1.png"),
    gallery: Array.isArray(row.gallery) ? (row.gallery as string[]) : [],
    description: String(row.description ?? ""),
    features: Array.isArray(row.features) ? (row.features as string[]) : [],
    lat: Number(row.lat ?? 0),
    lng: Number(row.lng ?? 0),
    featured: Boolean(row.featured)
  };
}
