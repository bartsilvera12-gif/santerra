import type { MetadataRoute } from "next";
import { properties } from "@/lib/properties";

const BASE = "https://santerra.com.py";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/propiedades",
    "/nosotros",
    "/inversiones",
    "/servicios",
    "/vender",
    "/contacto"
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
