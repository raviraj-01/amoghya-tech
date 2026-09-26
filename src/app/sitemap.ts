import type { MetadataRoute } from "next";
import { serviceRailData } from "@/components/services/service-rail-data";

const siteUrl = "https://amoghya.netlify.app";
const publicRoutes = [
  "",
  "/services",
  "/work",
  "/studio",
  "/about",
  "/contact",
  "/studio/book",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...publicRoutes,
    ...serviceRailData.map((service) => `/services/${service.slug}`),
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/services" ? 0.9 : 0.7,
  }));
}
