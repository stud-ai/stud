import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stud — AI Coding Assistant for Roblox",
    short_name: "Stud",
    description:
      "Open-source AI coding assistant with deep Roblox Studio integration.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1a1817",
    icons: [
      {
        src: "/assets/app_icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
