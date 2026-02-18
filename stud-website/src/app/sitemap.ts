import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://trystud.me"

  return [
    {
      url: baseUrl,
      lastModified: "2026-02-18",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: "2026-02-18",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs/getting-started`,
      lastModified: "2026-02-18",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/docs/tools`,
      lastModified: "2026-02-18",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/docs/permissions`,
      lastModified: "2026-02-18",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/docs/roblox`,
      lastModified: "2026-02-18",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]
}
