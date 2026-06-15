"use client";

import { useState, useTransition } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "success" };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ kind: "idle" });

    // Client-side validation (server validates again).
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({
        kind: "error",
        message: "कृपया नाम, ईमेल, और संदेश भरें।",
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus({
        kind: "error",
        message: "कृपया एक मान्य ईमेल पता दर्ज करें।",
      });
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          error?: string;
        };
        if (!res.ok || !data.ok) {
          setStatus({
            kind: "error",
            message:
              data.error ||
              "माफ़ कीजिए, कुछ गलत हो गया। कृपया बाद में पुनः प्रयास करें।",
          });
          return;
        }
        setStatus({ kind: "success" });
        setForm({ name: "", email: "", subject: "", message: "" });
      } catch {
        setStatus({
          kind: "error",
          message: "नेटवर्क त्रुटि — कृपया अपना कनेक्शन जाँचें।",
        });
      }
    });
  };

  const inputBase =
    "w-full px-4 py-2.5 text-sm border border-[var(--border-strong)] rounded-lg bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent transition-shadow";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-[var(--foreground)] mb-1.5"
          >
            नाम <span className="text-[var(--brand)]">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            value={form.name}
            onChange={update("name")}
            placeholder="आपका पूरा नाम"
            className={inputBase}
            disabled={isPending}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-[var(--foreground)] mb-1.5"
          >
            ईमेल <span className="text-[var(--brand)]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            value={form.email}
            onChange={update("email")}
            placeholder="name@example.com"
            className={inputBase}
            disabled={isPending}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-semibold text-[var(--foreground)] mb-1.5"
        >
          विषय
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          maxLength={200}
          value={form.subject}
          onChange={update("subject")}
          placeholder="जैसे: सहयोग, सुझाव, शिकायत…"
          className={inputBase}
          disabled={isPending}
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-sm font-semibold text-[var(--foreground)] mb-1.5"
        >
          संदेश <span className="text-[var(--brand)]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={4000}
          value={form.message}
          onChange={update("message")}
          placeholder="अपना संदेश यहाँ लिखें…"
          className={`${inputBase} resize-y min-h-[140px]`}
          disabled={isPending}
        />
        <p className="mt-1 text-xs text-[var(--muted)] text-right">
          {form.message.length} / 4000
        </p>
      </div>

      {status.kind === "error" && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300"
        >
          ⚠️ {status.message}
        </div>
      )}

      {status.kind === "success" && (
        <div
          role="status"
          className="rounded-lg border border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-300"
        >
          ✅ आपका संदेश सफलतापूर्वक भेज दिया गया है। हम जल्द ही आपसे संपर्क
          करेंगे।
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <p className="text-xs text-[var(--muted)]">
          * आवश्यक फ़ील्ड। हम आपकी जानकारी गोपनीय रखते हैं।
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg bg-[var(--brand)] text-[var(--brand-fg)] hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              भेजा जा रहा है…
            </>
          ) : (
            <>📩 संदेश भेजें</>
          )}
        </button>
      </div>
    </form>
  );
}
