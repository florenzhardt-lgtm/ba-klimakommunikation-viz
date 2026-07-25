import type { MetadataRoute } from "next";

const BASE = "https://ba-klimakommunikation-viz.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/zeitstrahl", "/trajektorien", "/spektrum"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "yearly",
    priority: p === "" ? 1 : 0.8,
  }));
}
