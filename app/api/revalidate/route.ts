/**
 * On-demand revalidation endpoint.
 *
 * Hit with: POST /api/revalidate
 * Body: { "slug": "/post/article-slug", "secret": "..." }
 *
 * When WP Automatic (or a custom WP plugin) saves a post, it can call this
 * endpoint to invalidate the cached Next.js page immediately — instead of
 * waiting up to 60s for ISR to kick in.
 *
 * Secures the endpoint with REVALIDATE_SECRET — return 401 otherwise.
 */

import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { slug, secret, tag } = body as { slug?: string; secret?: string; tag?: string };

  if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const revalidated: string[] = [];
  if (slug) {
    revalidatePath(slug);
    revalidated.push(`path:${slug}`);
  }
  if (tag) {
    // Next.js 16: revalidateTag requires a cache-life profile.
    // "max" = use the longest available cache duration.
    revalidateTag(tag, "max");
    revalidated.push(`tag:${tag}`);
  }
  // Always revalidate the homepage and category index on any post change.
  revalidatePath("/");
  revalidateTag("wp", "max");
  revalidated.push("path:/", "tag:wp");

  return NextResponse.json({ ok: true, revalidated, at: new Date().toISOString() });
}
