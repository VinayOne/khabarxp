/**
 * Khabar Xpress logo — inline SVG so `currentColor` inherits from
 * the parent element, making the wordmark and newspaper outline
 * automatically adapt to light/dark themes.
 *
 * The globe stays brand red always.
 *
 * Used in:
 *  - Header (replaces the old "खबर एक्सपी" text block)
 *  - Footer (optional, can be used as a smaller mark)
 */
export interface LogoProps {
  className?: string;
  /** Force a specific height (Tailwind: h-9, h-10, etc.). Width auto. */
  height?: string;
  /** Decorative only — hide from screen readers */
  decorative?: boolean;
}

export default function Logo({ className = "", height = "h-9 sm:h-10", decorative = false }: LogoProps) {
  return (
    <svg
      viewBox="0 0 1000 300"
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
          x="122"
          y="70"
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
          x="80"
          y="30"
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
          x1="95"
          y1="70"
          x2="165"
          y2="70"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="95"
          y1="88"
          x2="140"
          y2="88"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* Globe on front page (always red — brand color) */}
        <g transform="translate(130, 150)">
          <circle r="30" fill="#dc2626" />
          <ellipse rx="30" ry="11" fill="none" stroke="#ffffff" strokeWidth="2" />
          <ellipse rx="11" ry="30" fill="none" stroke="#ffffff" strokeWidth="2" />
          <line x1="-30" y1="0" x2="30" y2="0" stroke="#ffffff" strokeWidth="2" />
        </g>
      </g>

      {/* Wordmark */}
      <g fontFamily="Noto Sans, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif">
        <text
          x="250"
          y="200"
          fontSize="110"
          fontWeight="900"
          fill="currentColor"
          letterSpacing="-2"
        >
          Khabar
        </text>
        <g fontSize="30" fontWeight="700" fill="#dc2626" letterSpacing="14">
          <text x="250" y="245">XPRESS</text>
        </g>
      </g>
    </svg>
  );
}
