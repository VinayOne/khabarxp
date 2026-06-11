/**
 * Sidebar — used on post + category pages.
 *
 * Sections:
 *   1. ताज़ा खबरें — top 6 latest posts (compact list)
 *   2. ट्रेंडिंग श्रेणियाँ — category nav (all 6)
 *   3. Related — only passed in from post page
 *
 * Renders as a right rail on lg+, stacks below main content on smaller screens.
 */

import Link from "next/link";
import Image from "next/image";
import { CATEGORIES } from "@/lib/types";
import type { WPPost } from "@/lib/types";
import { getFeaturedImageUrl, formatHindiDate } from "@/lib/wp";

interface SidebarProps {
  latestPosts: WPPost[];
  relatedPosts?: WPPost[];
  showRelated?: boolean;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold border-l-4 border-[var(--brand)] pl-2.5 mb-4 text-[var(--foreground)]">
      {children}
    </h2>
  );
}

function PostListItem({ post, rank }: { post: WPPost; rank?: number }) {
  const imgUrl = getFeaturedImageUrl(post, "thumbnail");
  const category = post._embedded?.["wp:term"]?.[0]?.[0];

  return (
    <li className="group flex gap-3 py-3 border-b border-[var(--border)] last:border-b-0">
      {rank !== undefined && (
        <span
          className="shrink-0 w-7 h-7 rounded-full bg-[var(--brand)] text-[var(--brand-fg)] flex items-center justify-center text-sm font-black leading-none"
          aria-hidden="true"
        >
          {rank}
        </span>
      )}
      <div className="flex-1 min-w-0">
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className="text-[10px] font-semibold uppercase tracking-wider text-[var(--brand)] hover:text-[var(--brand-hover)]"
          >
            {category.name}
          </Link>
        )}
        <h3 className="text-sm font-semibold leading-snug text-[var(--foreground)] group-hover:text-[var(--brand)] transition-colors line-clamp-2">
          <Link href={`/post/${post.slug}`}>{post.title.rendered.replace(/<[^>]+>/g, "")}</Link>
        </h3>
        <time
          dateTime={post.date}
          className="text-[11px] text-[var(--muted)] mt-0.5 block"
        >
          {formatHindiDate(post.date)}
        </time>
      </div>
      {imgUrl && (
        <Link
          href={`/post/${post.slug}`}
          className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 relative overflow-hidden rounded-md bg-[var(--surface-2)]"
        >
          <Image
            src={imgUrl}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
          />
        </Link>
      )}
    </li>
  );
}

export default function Sidebar({
  latestPosts,
  relatedPosts = [],
  showRelated = false,
}: SidebarProps) {
  return (
    <aside className="space-y-8 lg:sticky lg:top-28">
      {/* ताज़ा खबरें — top 6 */}
      {latestPosts.length > 0 && (
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 sm:p-5 shadow-sm">
          <SectionHeading>ताज़ा खबरें</SectionHeading>
          <ul className="-mt-2">
            {latestPosts.slice(0, 6).map((p, i) => (
              <PostListItem key={p.id} post={p} rank={i + 1} />
            ))}
          </ul>
        </section>
      )}

      {/* Related — only on post page */}
      {showRelated && relatedPosts.length > 0 && (
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 sm:p-5 shadow-sm">
          <SectionHeading>संबंधित खबरें</SectionHeading>
          <ul className="-mt-2">
            {relatedPosts.slice(0, 4).map((p) => (
              <PostListItem key={p.id} post={p} />
            ))}
          </ul>
        </section>
      )}

      {/* ट्रेंडिंग श्रेणियाँ — always shown */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-4 sm:p-5 shadow-sm">
        <SectionHeading>ट्रेंडिंग श्रेणियाँ</SectionHeading>
        <ul className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <Link
                href={`/category/${c.slug}`}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-[var(--surface-2)] hover:bg-[var(--brand)] hover:text-[var(--brand-fg)] text-[var(--foreground)] transition-colors"
              >
                <span className="text-base" aria-hidden="true">
                  {c.emoji}
                </span>
                <span className="font-medium">{c.hindi}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Newsletter placeholder — small CTA */}
      <section className="bg-gradient-to-br from-[var(--brand)] to-red-800 text-[var(--brand-fg)] rounded-lg p-4 sm:p-5 shadow-sm">
        <h2 className="font-bold text-base mb-1">📬 दैनिक ब्रीफिंग</h2>
        <p className="text-sm text-red-50 leading-relaxed mb-3">
          हर सुबह ताज़ा खबरें सीधे अपने इनबॉक्स में पाएं।
        </p>
        <p className="text-[11px] text-red-100 opacity-80">
          जल्द आ रहा है — कृपया प्रतीक्षा करें।
        </p>
      </section>
    </aside>
  );
}
