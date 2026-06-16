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

export default function Logo({ className = "", height = "h-20 sm:h-24", decorative = false }: LogoProps) {
  return (
    <svg
      /* Tight viewBox around actual content — no padding wasted.
         Aspect ratio 620:300 = 2.07:1 */
      viewBox="0 0 620 300"
      role={decorative ? "presentation" : "img"}
      aria-label={decorative ? undefined : "Khabar Xpress"}
      className={`${height} w-auto ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Khabar Xpress</title>
      {/* Folded newspaper icon */}
      <g>
        {/* Back page (lower opacity for depth) */}
        <rect
          x="62"
          y="50"
          width="110"
          height="220"
          rx="12"
          ry="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          opacity="0.4"
        />
        {/* Front page */}
        <rect
          x="20"
          y="10"
          width="110"
          height="220"
          rx="12"
          ry="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
        />
        {/* Headline lines */}
        <line
          x1="35"
          y1="55"
          x2="115"
          y2="55"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="35"
          y1="78"
          x2="90"
          y2="78"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Globe on front page (always red — brand color) */}
        <g transform="translate(75, 155)">
          <circle r="35" fill="#dc2626" />
          <ellipse rx="35" ry="13" fill="none" stroke="#ffffff" strokeWidth="2.5" />
          <ellipse rx="13" ry="35" fill="none" stroke="#ffffff" strokeWidth="2.5" />
          <line x1="-35" y1="0" x2="35" y2="0" stroke="#ffffff" strokeWidth="2.5" />
        </g>
      </g>

      {/* Wordmark */}
      <g fontFamily="Noto Sans, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif">
        <text
          x="200"
          y="180"
          fontSize="150"
          fontWeight="900"
          fill="currentColor"
          letterSpacing="-3"
        >
          Khabar
        </text>
        <g fontSize="56" fontWeight="900" fill="#dc2626" letterSpacing="10">
          <text x="202" y="240">XPRESS</text>
        </g>
      </g>
    </svg>
  );
}
