import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Comments from "@/components/Comments";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import {
  estimateReadTime,
  formatHindiDate,
  getAuthorName,
  getFeaturedImageUrl,
  getLatestPosts,
  getNavCategories,
  getPostBySlug,
  getPostCategories,
  getRelatedPosts,
} from "@/lib/wp";
import { SITE } from "@/lib/types";

export const revalidate = 60;

const WP_API_BASE = process.env.WP_API_BASE || "https://khabarxp.in/wp-json/wp/v2";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "खबर नहीं मिली" };
  const img = getFeaturedImageUrl(post, "large");
  const desc = post.excerpt?.rendered
    ?.replace(/<[^>]+>/g, "")
    .trim()
    .slice(0, 160);
  return {
    title: post.title.rendered.replace(/<[^>]+>/g, ""),
    description: desc,
    alternates: { canonical: post.link || `${SITE.url}/post/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title.rendered.replace(/<[^>]+>/g, ""),
      description: desc,
      url: post.link,
      images: img ? [{ url: img }] : undefined,
      publishedTime: post.date_gmt,
      modifiedTime: post.modified_gmt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.rendered.replace(/<[^>]+>/g, ""),
      description: desc,
      images: img ? [img] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const img = getFeaturedImageUrl(post, "large");
  const cats = getPostCategories(post);
  const primaryCat = cats[0];
  const readTime = estimateReadTime(post.content.rendered);
  const [navCategories, related, { data: latest }] = await Promise.all([
    getNavCategories(),
    getRelatedPosts(post.id, post.categories, 4),
    getLatestPosts(1, 6),
  ]);

  return (
    <>
      <Header categories={navCategories} activeSlug={primaryCat?.slug} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <nav className="text-sm text-[var(--muted)] mb-4">
          <Link href="/" className="hover:text-[var(--brand)]">होम</Link>
          {primaryCat && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/category/${primaryCat.slug}`}
                className="hover:text-[var(--brand)]"
              >
                {primaryCat.name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Article column */}
          <article className="lg:col-span-2">
            <header className="mb-6">
              {primaryCat && (
                <Link
                  href={`/category/${primaryCat.slug}`}
                  className="text-xs font-bold uppercase tracking-wider text-[var(--brand)] hover:text-[var(--brand-hover)]"
                >
                  {primaryCat.name}
                </Link>
              )}
              <h1
                className="text-3xl sm:text-4xl font-black text-[var(--foreground)] mt-2 leading-tight"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[var(--muted-fg)]">
                <span>👤 {getAuthorName(post)}</span>
                <span>•</span>
                <time dateTime={post.date}>{formatHindiDate(post.date)}</time>
                <span>•</span>
                <span>⏱️ {readTime} मिनट पढ़ने का समय</span>
              </div>
            </header>

            {img && (
              <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-lg bg-[var(--surface-2)]">
                <Image
                  src={img}
                  alt={post.title.rendered.replace(/<[^>]+>/g, "")}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="article-content text-lg prose-hindi"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />

            {/* Source attribution — important for aggregated news sites. */}
            <div className="mt-8 p-4 bg-[var(--amber-bg)] border border-[var(--amber-border)] rounded-lg text-sm text-[var(--amber-fg)]">
              <p>
                <strong>📰 स्रोत:</strong> यह खबर स्वचालित RSS फीड से एकत्र की गई है।
                किसी भी सुधार या शिकायत के लिए कृपया{" "}
                <Link href="/contact" className="underline">
                  संपर्क करें
                </Link>
                ।
              </p>
            </div>

            <Comments postId={post.id} apiBase={WP_API_BASE} />
          </article>

          {/* Sidebar — visible from lg up */}
          <div className="lg:col-span-1">
            <Sidebar
              latestPosts={latest}
              relatedPosts={related}
              showRelated
            />
          </div>
        </div>

        {/* Bottom — wider related strip across the full width */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)] border-l-4 border-[var(--brand)] pl-3 mb-5">
              और पढ़ें
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  size="medium"
                  showCategory={false}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
