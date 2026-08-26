import type { MetadataRoute } from "next";

const BASE_URL = "https://u-pioneers-accelerator.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE_URL}/register`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${BASE_URL}/leaderboard`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.6 },
    { url: `${BASE_URL}/b2b`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  return publicPages;
}
