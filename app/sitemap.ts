import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/supabase/queries";

const BASE = "https://santerra.com.py";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const properties = await getProperties();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/propiedades",
    "/nosotros",
    "/inversiones",
    "/servicios",
    "/vender",
    "/contacto",
    "/politica-de-privacidad"
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7
  }));

  const propertyRoutes: MetadataRoute.Sitemap = properties.map((p) => ({
    url: `${BASE}/propiedades/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  return [...staticRoutes, ...propertyRoutes];
}
