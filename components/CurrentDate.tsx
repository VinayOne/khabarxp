"use client";

import { useEffect, useState } from "react";

/**
 * Displays today's date in Hindi Devanagari.
 * Client component because:
 * 1. The date needs to update if the page stays open across midnight.
 * 2. Server-rendered dates would differ from the user's local date
 *    (the server is in CEST, but the user is in IST or elsewhere).
 * 3. Avoids hydration mismatches by rendering an empty span first, then
 *    the real date on mount.
 */
export default function CurrentDate() {
  const [dateText, setDateText] = useState<string>("");
  const [weekday, setWeekday] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDateText(
        now.toLocaleDateString("hi-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
      setWeekday(
        now.toLocaleDateString("hi-IN", { weekday: "long" })
      );
    };
    update();
    // Refresh at midnight so a long-lived tab shows the new day.
    const msToMidnight =
      new Date().setHours(24, 0, 0, 0) - Date.now();
    const t = setTimeout(() => {
      update();
      const interval = setInterval(update, 24 * 60 * 60 * 1000);
      // Stash so the next timeout can clear it on unmount.
      (t as unknown as { _interval: NodeJS.Timeout })._interval = interval;
    }, msToMidnight);
    return () => clearTimeout(t);
  }, []);

  if (!dateText) {
    return (
      <span
        className="hidden md:flex flex-col items-end leading-tight min-w-[8ch]"
        suppressHydrationWarning
        aria-label="आज की तिथि"
      >
        <span className="text-[11px] text-[var(--muted)]">&nbsp;</span>
        <span className="text-[10px] text-[var(--muted)] opacity-70">&nbsp;</span>
      </span>
    );
  }

  return (
    <span
      className="hidden md:flex flex-col items-end leading-tight min-w-[8ch]"
      suppressHydrationWarning
      aria-label="आज की तिथि"
    >
      <span className="text-[11px] font-semibold text-[var(--foreground)]">
        {dateText}
      </span>
      <span className="text-[10px] text-[var(--muted)] opacity-80">
        {weekday}
      </span>
    </span>
  );
}
