/**
 * AdSlot — placeholder for AdSense (and other) ad units.
 *
 * Phase 1: renders a labelled placeholder so the page layout is final.
 * Phase 4: drop in real AdSense <ins class="adsbygoogle" ...> markup once
 *          the AdSense application is approved.
 *
 * AdSense is intentionally rendered only when NEXT_PUBLIC_ADSENSE_CLIENT is set
 * — that env var stays empty until the application is approved, so we don't
 * trigger "ad code present but no fill" penalties.
 */

interface AdSlotProps {
  slot: string; // logical name, e.g. "homepage-top-banner"
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
  height?: number;
}

export default function AdSlot({
  slot,
  format = "auto",
  className = "",
  height = 90,
}: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  // AdSense not yet approved — show a labelled placeholder so the layout is final.
  if (!client) {
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

  // AdSense approved — render the real unit.
  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block", minHeight: height }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
