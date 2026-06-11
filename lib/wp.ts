/**
 * WordPress REST API client for khabarxp.in
 *
 * - Uses native fetch with Next.js ISR caching
 * - Auto-embeds author, featured media, and terms (categories + tags)
 * - Hindi-friendly URL slugs preserved
 *
 * Set WP_API_BASE in .env.local — defaults to the live khabarxp.in API.
 */

import type {
  WPCategory,
  WPComment,
  WPPost,
} from "./types";
import { CATEGORIES } from "./types";

const API_BASE = process.env.WP_API_BASE || "https://khabarxp.in/wp-json/wp/v2";

// Per Next.js App Router conventions, fetch is cached by default.
// We set `next: { revalidate }` for ISR-style revalidation.
const DEFAULT_REVALIDATE = 60; // seconds — pages stay fresh without hammering WP

async function wpFetch<T>(
  path: string,
  params: Record<string, string | number> = {},
  revalidate = DEFAULT_REVALIDATE,
): Promise<T> {
  const url = new URL(API_BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "khabarxp-frontend/0.1 (+https://khabarxp.in)" },
    next: { revalidate, tags: ["wp"] },
  });

  if (!res.ok) {
    throw new Error(
      `WP API error: ${res.status} ${res.statusText} on ${path}`,
    );
  }
  return res.json() as Promise<T>;
}

async function wpFetchList<T>(
  path: string,
  params: Record<string, string | number> = {},
  revalidate = DEFAULT_REVALIDATE,
): Promise<{ data: T[]; total: number; totalPages: number }> {
  const url = new URL(API_BASE + path);
  Object.entries(params).forEach(([k, v]) => {
    url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "khabarxp-frontend/0.1 (+https://khabarxp.in)" },
    next: { revalidate, tags: ["wp"] },
  });

  if (!res.ok) {
    throw new Error(
      `WP API error: ${res.status} ${res.statusText} on ${path}`,
    );
  }
  const data = (await res.json()) as T[];
  const total = Number(res.headers.get("X-WP-Total") || data.length);
  const totalPages = Number(
    res.headers.get("X-WP-TotalPages") || Math.ceil(total / 10),
  );
  return { data, total, totalPages };
}

// -------- Posts --------

export async function getLatestPosts(
  page = 1,
  perPage = 12,
): Promise<{ data: WPPost[]; total: number; totalPages: number }> {
  return wpFetchList<WPPost>("/posts", {
    page,
    per_page: perPage,
    _embed: 1,
    orderby: "date",
    order: "desc",
  });
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const { data } = await wpFetchList<WPPost>(
    "/posts",
    { slug, _embed: 1 },
    60,
  );
  return data[0] ?? null;
}

export async function getPostsByCategory(
  categoryId: number,
  page = 1,
  perPage = 12,
): Promise<{ data: WPPost[]; total: number; totalPages: number }> {
  return wpFetchList<WPPost>("/posts", {
    categories: categoryId,
    page,
    per_page: perPage,
    _embed: 1,
    orderby: "date",
    order: "desc",
  });
}

export async function getRelatedPosts(
  postId: number,
  categoryIds: number[],
  perPage = 4,
): Promise<WPPost[]> {
  if (categoryIds.length === 0) return [];
  const { data } = await wpFetchList<WPPost>(
    "/posts",
    {
      // WP API doesn't have an "exclude" with multiple, so we filter client-side.
      categories: categoryIds.join(","),
      per_page: perPage + 1,
      _embed: 1,
      orderby: "date",
      order: "desc",
    },
    300,
  );
  return data.filter((p) => p.id !== postId).slice(0, perPage);
}

export async function searchPosts(
  query: string,
  page = 1,
  perPage = 12,
): Promise<{ data: WPPost[]; total: number; totalPages: number }> {
  return wpFetchList<WPPost>("/posts", {
    search: query,
    page,
    per_page: perPage,
    _embed: 1,
  });
}

// -------- Categories --------

export async function getAllCategories(): Promise<WPCategory[]> {
  return wpFetch<WPCategory[]>(
    "/categories",
    { per_page: 100, orderby: "count", order: "desc" },
    600,
  );
}

/** Return our hardcoded nav list, with live counts from WP. */
export async function getNavCategories(): Promise<
  Array<{
    id: number;
    name: string;
    slug: string;
    hindi: string;
    emoji: string;
    count: number;
  }>
> {
  const live = await getAllCategories();
  return CATEGORIES.map((c) => ({
    ...c,
    count: live.find((l) => l.id === c.id)?.count ?? 0,
  })).filter((c) => c.count > 0);
}

// -------- Comments --------

export async function getCommentsForPost(
  postId: number,
): Promise<WPComment[]> {
  return wpFetch<WPComment[]>(
    "/comments",
    { post: postId, per_page: 100, orderby: "date", order: "asc" },
    30,
  );
}

export async function postComment(input: {
  post: number;
  author_name: string;
  author_email: string;
  content: string;
  parent?: number;
}): Promise<WPComment> {
  const res = await fetch(`${API_BASE}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      `Failed to post comment: ${res.status} ${err?.message || res.statusText}`,
    );
  }
  return res.json() as Promise<WPComment>;
}

// -------- Helpers --------

export function getFeaturedImageUrl(
  post: WPPost,
  size: "thumbnail" | "medium" | "medium_large" | "large" | "full" = "medium_large",
): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;
  if (media.media_details?.sizes?.[size]?.source_url) {
    return media.media_details.sizes[size].source_url;
  }
  return media.source_url;
}

export function getAuthorName(post: WPPost): string {
  return post._embedded?.author?.[0]?.name ?? "खबर एक्सपी";
}

export function getPostCategories(post: WPPost): WPCategory[] {
  return (post._embedded?.["wp:term"]?.[0] ?? []).filter(
    (t) => t.taxonomy === "category",
  ) as WPCategory[];
}

export function getPostTags(post: WPPost): WPCategory[] {
  return (post._embedded?.["wp:term"]?.[1] ?? []).filter(
    (t) => t.taxonomy === "post_tag",
  ) as WPCategory[];
}

/** Strip HTML and trim to N words for excerpts. */
export function cleanExcerpt(html: string, maxWords = 30): string {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "…";
}

/** Format a date in Hindi locale (Asia/Kolkata). */
export function formatHindiDate(iso: string): string {
  return new Intl.DateTimeFormat("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Read-time estimate for a post (very rough). */
export function estimateReadTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).length;
  return Math.max(1, Math.round(words / 180));
}
