"use client";

/**
 * ThemeToggle — cycles light → dark → auto on click, persists to localStorage.
 * - Renders as a small icon button in the header.
 * - Uses CSS-only icon swap (sun / moon / auto-circle) to avoid hydration mismatch.
 */

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "auto";

const STORAGE_KEY = "khabarxp-theme";

function getInitial(): Theme {
  if (typeof window === "undefined") return "auto";
  return (localStorage.getItem(STORAGE_KEY) as Theme) || "auto";
}

function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "auto" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export default function ThemeToggle() {
  // Start as null to avoid hydration mismatch, then sync on mount.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const t = getInitial();
    setTheme(t);
    applyTheme(t);

    // Listen for system color-scheme changes when in auto mode.
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (getInitial() === "auto") applyTheme("auto");
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  function cycle() {
    if (!theme) return;
    const next: Theme =
      theme === "light" ? "dark" : theme === "dark" ? "auto" : "light";
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  const label =
    theme === "light"
      ? "लाइट थीम"
      : theme === "dark"
        ? "डार्क थीम"
        : "ऑटो (सिस्टम के अनुसार)";

  return (
    <button
      type="button"
      onClick={cycle}
      title={`थीम: ${label} — क्लिक करके बदलें`}
      aria-label={`थीम बदलें (वर्तमान: ${label})`}
      className="relative w-9 h-9 inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-2)] hover:border-[var(--border-strong)] transition-colors"
    >
      {/* Sun — light mode */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`theme-icon w-5 h-5 ${theme === "light" ? "" : "hidden-icon"}`}
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Moon — dark mode */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`theme-icon w-5 h-5 ${theme === "dark" ? "" : "hidden-icon"}`}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      {/* Auto — system follows */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`theme-icon w-5 h-5 ${theme === "auto" || !theme ? "" : "hidden-icon"}`}
      >
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 21h8M12 18v3" />
        <circle cx="12" cy="11" r="2.5" />
      </svg>
    </button>
  );
}
