import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Getrennt wird im Wie — Klimakommunikation RWE · VW · BASF",
    short_name: "Getrennt im Wie",
    description:
      "Interaktive Visualisierung der Bachelorarbeit-Befunde zu Short-Termism und Klimakommunikation (2010–2024).",
    start_url: "/",
    display: "standalone",
    background_color: "#080b11",
    theme_color: "#080b11",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
