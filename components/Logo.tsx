/**
 * Khabar Xpress logo — inline SVG so `currentColor` inherits from
 * the parent element, making the wordmark and newspaper outline
 * automatically adapt to light/dark themes.
 *
 * The globe + XPRESS tag stay brand red always.
 *
 * Used in:
 *  - Header (replaces the old "खबर एक्सपी" text block)
 *  - Footer (optional, can be used as a smaller mark)
 */
export interface LogoProps {
  className?: string;
  /** Force a specific height (Tailwind: h-10, h-12, etc.). Width auto. */
  height?: string;
  /** Decorative only — hide from screen readers */
  decorative?: boolean;
}

export default function Logo({ className = "", height = "h-16 sm:h-20", decorative = false }: LogoProps) {
  return (
    <svg
      /* Tight viewBox around actual content — no padding wasted.
         Aspect ratio 640:300 = 2.13:1 — wide enough for "Khabar" to fit
         without clipping at fontSize 120. */
      viewBox="0 0 640 300"
      role={decorative ? "presentation" : "img"}
      aria-label={decorative ? undefined : "Khabar Xpress"}
      className={`${height} w-auto shrink-0 ${className}`}
      style={{ overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Khabar Xpress</title>
      {/* Folded newspaper icon */}
      <g>
        {/* Back page (lower opacity for depth) */}
        <rect
          x="62"
          y="60"
          width="100"
          height="200"
          rx="10"
          ry="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          opacity="0.4"
        />
        {/* Front page */}
        <rect
          x="20"
          y="20"
          width="100"
          height="200"
          rx="10"
          ry="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
        />
        {/* Headline lines */}
        <line
          x1="35"
          y1="60"
          x2="105"
          y2="60"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="35"
          y1="78"
          x2="80"
          y2="78"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Globe on front page (always red — brand color) */}
        <g transform="translate(70, 140)">
          <circle r="32" fill="#dc2626" />
          <ellipse rx="32" ry="12" fill="none" stroke="#ffffff" strokeWidth="2.5" />
          <ellipse rx="12" ry="32" fill="none" stroke="#ffffff" strokeWidth="2.5" />
          <line x1="-32" y1="0" x2="32" y2="0" stroke="#ffffff" strokeWidth="2.5" />
        </g>
      </g>

      {/* Wordmark */}
      <g fontFamily="Noto Sans, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif">
        <text
          x="190"
          y="190"
          fontSize="120"
          fontWeight="900"
          fill="currentColor"
          letterSpacing="-2"
        >
          Khabar
        </text>
        <g fontSize="48" fontWeight="900" fill="#dc2626" letterSpacing="10">
          <text x="192" y="245">XPRESS</text>
        </g>
      </g>
    </svg>
  );
}
