import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/api/",
      },
    ],
    host: "trystud.me",
    sitemap: "https://trystud.me/sitemap.xml",
  }
}
