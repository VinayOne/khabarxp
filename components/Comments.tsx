"use client";

/**
 * Comments — fetches + posts WordPress comments via the REST API.
 *
 * Uses native fetch from the browser to:
 *   GET  /wp/v2/comments?post=<id>          — list comments
 *   POST /wp/v2/comments                    — submit a new comment
 *
 * No third-party dependency, no ads, full control.
 */

import { useEffect, useState } from "react";
import { formatHindiDate } from "@/lib/wp";
import type { WPComment } from "@/lib/types";

interface CommentsProps {
  postId: number;
  apiBase: string;
}

const WP_BASE = (apiBase: string) => apiBase.replace(/\/wp\/v2\/?$/, "");

export default function Comments({ postId, apiBase }: CommentsProps) {
  const [comments, setComments] = useState<WPComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${apiBase}/comments?post=${postId}&per_page=100&orderby=date&order=asc`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setComments(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [postId, apiBase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) {
      setError("कृपया सभी फ़ील्ड भरें।");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post: postId,
          author_name: name,
          author_email: email,
          content,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || `HTTP ${res.status}`);
      }
      const newComment: WPComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setName("");
      setEmail("");
      setContent("");
    } catch (e) {
      setError(`टिप्पणी पोस्ट नहीं हो सकी: ${(e as Error).message}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-10 border-t border-zinc-200 pt-8">
      <h3 className="text-xl font-bold text-zinc-900 mb-4">
        टिप्पणियाँ ({comments.length})
      </h3>

      {loading ? (
        <p className="text-sm text-zinc-500">टिप्पणियाँ लोड हो रही हैं…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-zinc-500 mb-6">पहली टिप्पणी करें।</p>
      ) : (
        <ul className="space-y-4 mb-8">
          {comments.map((c) => (
            <li
              key={c.id}
              className="border border-zinc-200 rounded-lg p-4 bg-white"
            >
              <div className="flex items-baseline gap-2 mb-1">
                <strong className="text-sm font-semibold text-zinc-900">
                  {c.author_name}
                </strong>
                <span className="text-xs text-zinc-500">
                  {formatHindiDate(c.date)}
                </span>
              </div>
              <div
                className="text-sm text-zinc-700"
                dangerouslySetInnerHTML={{ __html: c.content.rendered }}
              />
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl">
        <h4 className="text-base font-semibold text-zinc-900">
          अपनी टिप्पणी लिखें
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="आपका नाम"
            required
            className="px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ईमेल (प्रकाशित नहीं होगा)"
            required
            className="px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="अपनी बात लिखें…"
          required
          rows={4}
          className="w-full px-3 py-2 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {submitting ? "भेजा जा रहा है…" : "टिप्पणी भेजें"}
        </button>
        <p className="text-xs text-zinc-500">
          टिप्पणी करने से पहले WP एडमिन में "अनाम टिप्पणियाँ अनुमति दें" चालू
          होना चाहिए। मॉडरेशन लागू हो सकता है।
        </p>
        <p className="text-xs text-zinc-400">
          Powered by{" "}
          <a
            href={`${WP_BASE(apiBase)}/wp-admin`}
            className="hover:text-red-600"
            target="_blank"
            rel="nofollow"
          >
            WordPress comments
          </a>
        </p>
      </form>
    </section>
  );
}
