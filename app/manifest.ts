import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dharohar — Heritage Kitchen",
    short_name: "Dharohar",
    description: "Handcrafted copper, peetal and kansa objects for the modern Indian kitchen.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f7",
    theme_color: "#512c36",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
