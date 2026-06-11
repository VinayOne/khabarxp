import Image from "next/image";
import Link from "next/link";
import { formatHindiDate, getFeaturedImageUrl } from "@/lib/wp";
import type { WPPost } from "@/lib/types";

type Size = "small" | "medium" | "large" | "hero";

interface PostCardProps {
  post: WPPost;
  size?: Size;
  showExcerpt?: boolean;
  showCategory?: boolean;
  priority?: boolean;
}

const sizeMap: Record<Size, { img: "thumbnail" | "medium" | "medium_large" | "large"; aspect: string; title: string }> = {
  hero: { img: "large", aspect: "aspect-[16/9]", title: "text-2xl sm:text-3xl font-bold leading-tight" },
  large: { img: "medium_large", aspect: "aspect-[16/9]", title: "text-xl sm:text-2xl font-bold leading-snug" },
  medium: { img: "medium_large", aspect: "aspect-[16/9]", title: "text-base font-semibold leading-snug" },
  small: { img: "medium", aspect: "aspect-[16/9]", title: "text-sm font-medium leading-snug" },
};

export default function PostCard({
  post,
  size = "medium",
  showExcerpt = false,
  showCategory = true,
  priority = false,
}: PostCardProps) {
  const cfg = sizeMap[size];
  const imgUrl = getFeaturedImageUrl(post, cfg.img);
  const href = `/post/${post.slug}`;
  const category = post._embedded?.["wp:term"]?.[0]?.[0];

  return (
    <article className="group flex flex-col h-full">
      <Link href={href} className="block overflow-hidden rounded-lg bg-zinc-100">
        {imgUrl ? (
          <div className={`relative ${cfg.aspect} overflow-hidden`}>
            <Image
              src={imgUrl}
              alt={post.title.rendered}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className={`${cfg.aspect} bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center`}>
            <span className="text-3xl opacity-30">📰</span>
          </div>
        )}
      </Link>

      <div className="mt-3 flex-1 flex flex-col">
        {showCategory && category && (
          <Link
            href={`/category/${category.slug}`}
            className="text-[11px] font-semibold uppercase tracking-wider text-red-600 hover:text-red-700 mb-1"
          >
            {category.name}
          </Link>
        )}

        <h2 className={`${cfg.title} text-zinc-900 group-hover:text-red-600 transition-colors`}>
          <Link
            href={href}
            className="line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </h2>

        {showExcerpt && post.excerpt?.rendered && (
          <div
            className="mt-2 text-sm text-zinc-600 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />
        )}

        <div className="mt-auto pt-2 text-xs text-zinc-500">
          <time dateTime={post.date}>{formatHindiDate(post.date)}</time>
        </div>
      </div>
    </article>
  );
}
