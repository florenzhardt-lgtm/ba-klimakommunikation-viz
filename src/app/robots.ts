import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://ba-klimakommunikation-viz.vercel.app/sitemap.xml",
  };
}
