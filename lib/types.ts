/**
 * Type definitions for WordPress REST API responses.
 * Subset of fields we actually use — keeps the client code clean.
 *
 * @see https://developer.wordpress.org/rest-api/reference/posts/
 */

export interface WPAuthor {
  id: number;
  name: string;
  slug: string;
  description?: string;
  link?: string;
  avatar_urls?: Record<string, string>;
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<
      string,
      { source_url: string; width: number; height: number }
    >;
  };
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: "category" | "post_tag";
  link?: string;
  count?: number;
  description?: string;
}

export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: WPAuthor[];
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
  };
}

export interface WPCategory extends WPTerm {
  taxonomy: "category";
  parent: number;
}

export interface WPComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  author_avatar_urls?: Record<string, string>;
  date: string;
  content: { rendered: string };
  status: string;
}

export interface CategoryConfig {
  id: number;
  name: string;
  slug: string;
  hindi: string; // Devanagari label
  emoji: string; // small visual marker
}

/**
 * Hardcoded category list pulled from khabarxp.in.
 * Update this when new categories are added in WP admin.
 * Order = display order in the navigation.
 */
export const CATEGORIES: CategoryConfig[] = [
  { id: 1, name: "Trending", slug: "trending", hindi: "ट्रेंडिंग", emoji: "🔥" },
  { id: 8, name: "Entertainment", slug: "entertainment", hindi: "मनोरंजन", emoji: "🎬" },
  { id: 7, name: "Sports", slug: "sports", hindi: "खेल", emoji: "⚽" },
  { id: 4, name: "Finance", slug: "finance", hindi: "वित्त", emoji: "💰" },
  { id: 6, name: "World", slug: "world", hindi: "विश्व", emoji: "🌍" },
  { id: 5, name: "Tech - Auto", slug: "tech-auto", hindi: "टेक-ऑटो", emoji: "🚗" },
];

export const SITE = {
  name: "खबर एक्सपी",
  nameEn: "Khabar Xpress",
  tagline: "ताज़ा खबरें, तेज़ी से",
  description:
    "खबर एक्सपी पर पाएं भारत और दुनिया की ताज़ा खबरें — राजनीति, मनोरंजन, खेल, वित्त, टेक्नोलॉजी और ऑटो।",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://khabarxp.in",
  wpApiBase:
    process.env.WP_API_BASE || "https://khabarxp.in/wp-json/wp/v2",
  defaultOgImage: "/og-default.png",
  twitter: "@khabarxp",
};
