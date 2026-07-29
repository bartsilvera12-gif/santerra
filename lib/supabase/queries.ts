import { properties as staticProperties, type Property } from "@/lib/properties";
import { isSupabaseConfigured } from "./config";
import { createClient } from "./server";

export type Category = {
  id: string;
  slug: string;
  title: string;
  image: string | null;
  sort_order: number;
};

const STATIC_CATEGORIES: Category[] = [
  { id: "casas", slug: "casas", title: "Casas", image: "/images/property-1.png", sort_order: 1 },
  { id: "departamentos", slug: "departamentos", title: "Departamentos", image: "/images/property-2.png", sort_order: 2 },
  { id: "terrenos", slug: "terrenos", title: "Terrenos", image: "/images/property-3.png", sort_order: 3 },
  { id: "comerciales", slug: "comerciales", title: "Comerciales", image: "/images/property-1.png", sort_order: 4 }
];

/** Normaliza una fila de la base al tipo Property que ya usa el sitio. */
function toProperty(row: Record<string, unknown>): Property {
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
    lng: Number(row.lng ?? 0)
  };
}

/**
 * Propiedades publicadas. Si todavia no hay credenciales de Supabase,
 * devuelve el listado estatico para que el sitio no quede vacio.
 */
export async function getProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured) return staticProperties;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return staticProperties;
  return data.map(toProperty);
}

/** Todas las propiedades, publicadas o no. Solo para el panel. */
export async function getAllProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured) return staticProperties;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(toProperty);
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  if (!isSupabaseConfigured) return staticProperties.find((p) => p.id === id);

  const supabase = createClient();
  const { data, error } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();

  if (error || !data) return staticProperties.find((p) => p.id === id);
  return toProperty(data);
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return STATIC_CATEGORIES;

  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return STATIC_CATEGORIES;
  return data as Category[];
}

/** Cuenta cuantas propiedades publicadas hay por tipo, para las tarjetas del home. */
export function countByType(items: Property[]) {
  const map: Record<string, number> = {};
  for (const p of items) map[p.type] = (map[p.type] ?? 0) + 1;
  return map;
}

/** Relacion entre el slug de categoria y el tipo de propiedad. */
export const CATEGORY_TYPE: Record<string, Property["type"]> = {
  casas: "Casa",
  departamentos: "Departamento",
  terrenos: "Terreno",
  comerciales: "Comercial"
};

export type CategoryCard = {
  slug: string;
  title: string;
  image: string;
  count: number;
  type: string;
};

/**
 * Arma las tarjetas de categoria del home: imagen, tipo que filtran y
 * cuantas propiedades publicadas hay de ese tipo.
 */
export async function getCategoryCards(): Promise<CategoryCard[]> {
  const [items, cats] = await Promise.all([getProperties(), getCategories()]);
  const porTipo = countByType(items);

  return cats.map((c) => {
    // Si el slug no esta mapeado (categoria nueva), se cae al titulo tal cual.
    const type = CATEGORY_TYPE[c.slug] ?? c.title;
    return {
      slug: c.slug,
      title: c.title,
      image: c.image || "/images/property-1.png",
      count: porTipo[type] ?? 0,
      type
    };
  });
}
