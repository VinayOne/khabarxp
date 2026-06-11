"use client";

/**
 * Comments — fetches + renders WP comments for a post, plus an inline
 * anonymous comment form using the WP REST API + Application Password.
 *
 * Theme-aware: all colors come from CSS variables defined in globals.css.
 */

import { useEffect, useState, type FormEvent } from "react";

interface WPAuthor {
  name: string;
  avatar_urls?: Record<string, string>;
}

interface WPComment {
  id: number;
  author_name: string;
  author_avatar_urls?: Record<string, string>;
  content: { rendered: string };
  date: string;
  author?: WPAuthor;
}

interface CommentsProps {
  postId: number;
  apiBase: string;
}

export default function Comments({ postId, apiBase }: CommentsProps) {
  const [comments, setComments] = useState<WPComment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchComments() {
      try {
        const res = await fetch(
          `${apiBase}/comments?post=${postId}&per_page=50&orderby=date&order=asc`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: WPComment[] = await res.json();
        if (!cancelled) {
          setComments(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
          setLoading(false);
        }
      }
    }
    fetchComments();
    return () => {
      cancelled = true;
    };
  }, [postId, apiBase]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      setFormError("कृपया नाम और टिप्पणी भरें।");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post: postId,
          author_name: author.trim(),
          author_email: email.trim() || "anon@example.invalid",
          content: content.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }
      setSuccess(true);
      setAuthor("");
      setEmail("");
      setContent("");
      // Optimistic prepend — but it may be "hold for moderation".
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? `टिप्पणी भेजने में असफल: ${err.message}`
          : "टिप्पणी भेजने में असफल।"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-10 border-t border-[var(--border)] pt-8">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-4">
        💬 टिप्पणियाँ ({comments?.length ?? 0})
      </h3>

      {loading && (
        <p className="text-sm text-[var(--muted)]">टिप्पणियाँ लोड हो रही हैं…</p>
      )}

      {error && (
        <p className="text-sm text-[var(--brand)]">
          टिप्पणियाँ लोड नहीं हो सकीं ({error})
        </p>
      )}

      {!loading && !error && comments?.length === 0 && (
        <p className="text-sm text-[var(--muted)] mb-6">
          अभी तक कोई टिप्पणी नहीं। पहली टिप्पणी करें!
        </p>
      )}

      <ul className="space-y-4 mb-8">
        {comments?.map((c) => (
          <li
            key={c.id}
            className="border border-[var(--border)] rounded-lg p-4 bg-[var(--surface)]"
          >
            <div className="flex items-baseline justify-between mb-1">
              <strong className="text-sm font-semibold text-[var(--foreground)]">
                {c.author_name}
              </strong>
              <span className="text-xs text-[var(--muted)]">
                {new Date(c.date).toLocaleDateString("hi-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div
              className="text-sm text-[var(--muted-fg)] prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: c.content.rendered }}
            />
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="space-y-3">
        <h4 className="text-base font-semibold text-[var(--foreground)]">
          अपनी टिप्पणी लिखें
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="आपका नाम *"
            required
            className="px-3 py-2 text-sm border border-[var(--border-strong)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] placeholder:text-[var(--muted)]"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ईमेल (वैकल्पिक, प्रकाशित नहीं होगा)"
            className="px-3 py-2 text-sm border border-[var(--border-strong)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] placeholder:text-[var(--muted)]"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="आपकी टिप्पणी… *"
          required
          rows={4}
          className="w-full px-3 py-2 text-sm border border-[var(--border-strong)] rounded-md bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] placeholder:text-[var(--muted)]"
        />
        {formError && (
          <p className="text-sm text-[var(--brand)]">{formError}</p>
        )}
        {success && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">
            ✅ टिप्पणी सबमिट हो गई! मॉडरेशन के बाद प्रकाशित होगी।
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 text-sm font-medium text-[var(--brand-fg)] bg-[var(--brand)] rounded-md hover:bg-[var(--brand-hover)] disabled:opacity-50 transition-colors"
        >
          {submitting ? "भेज रहे हैं…" : "टिप्पणी भेजें"}
        </button>
        <p className="text-xs text-[var(--muted)]">
          टिप्पणी मॉडरेशन के बाद प्रकाशित होगी।
        </p>
      </form>
    </section>
  );
}
