/**
 * AdSlot — placeholder for AdSense (and other) ad units.
 *
 * Default: HIDDEN. The homepage looks cleaner without ad placeholders.
 *
 * Opt-in via env vars:
 *   NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS=true  → render labelled dashed boxes (layout preview)
 *   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-...  → render real AdSense unit (post-approval)
 *
 * Both env vars OFF (default) → renders nothing (no empty boxes, no penalty).
 *
 * `forceHidden` lets individual callers opt out even when env is on
 * (e.g. "above the fold" pre-roll where a placeholder would hurt LCP).
 */

interface AdSlotProps {
  slot: string; // logical name, e.g. "homepage-top-banner"
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  height?: number;
  forceHidden?: boolean;
}

export default function AdSlot({
  slot,
  format = "auto",
  className = "",
  height = 90,
  forceHidden = false,
}: AdSlotProps) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const showPlaceholders =
    process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS === "true";

  if (forceHidden) return null;

  // Real AdSense — only after application is approved.
  if (adsenseClient) {
    return (
      <ins
        className={`adsbygoogle ${className}`}
        style={{ display: "block", minHeight: height }}
        data-ad-client={adsenseClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    );
  }

  // Layout-preview placeholder.
  if (showPlaceholders) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-zinc-300 bg-zinc-50 text-zinc-400 text-xs uppercase tracking-wider ${className}`}
        style={{ minHeight: height }}
        data-ad-slot={slot}
        role="complementary"
        aria-label="विज्ञापन स्थान"
      >
        विज्ञापन — {slot}
      </div>
    );
  }

  // Default: nothing renders. Keep the page clean.
  return null;
}
