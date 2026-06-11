import type { MetadataRoute } from "next";
import { CATEGORIES, SITE } from "@/lib/types";
import { getLatestPosts } from "@/lib/wp";

// Regenerate every hour — sitemap is small.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;

  // Pull the most recent posts for the sitemap.
  // WP REST API caps per_page at 100, so we page through in 100-post chunks.
  // We only need the slugs, so 100 most recent is plenty for a sitemap.
  const { data: posts } = await getLatestPosts(1, 100);

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "hourly", priority: 1.0 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/post/${p.slug}`,
    lastModified: new Date(p.modified_gmt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}
