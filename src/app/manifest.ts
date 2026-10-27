import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "edge",
    short_name: "edge",
    description: "Stay sharp as an engineer, one hard question at a time.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfbfc",
    theme_color: "#5e6ad2",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
