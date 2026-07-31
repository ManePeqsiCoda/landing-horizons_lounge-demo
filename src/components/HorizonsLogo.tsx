interface HorizonsLogoProps {
  /** Color of the main wordmark and horizon line. Defaults to cream for dark backgrounds. */
  foreground?: string;
  /** Color of the water reflection. Defaults to the original cyan accent. */
  reflection?: string;
  /** Optional className for sizing. */
  className?: string;
}

/**
 * Inline SVG logo inspired by a sunset horizon.
 * - The wordmark is clipped by a curved horizon line.
 * - The lower half is a mirrored reflection in cyan.
 * - Designed to sit over dark photography.
 */
export default function HorizonsLogo({
  foreground = '#fdf8f1',
  reflection = '#00B4D8',
  className = '',
}: HorizonsLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 160"
      width="100%"
      height="auto"
      className={className}
      aria-label="Horizons Lounge"
    >
      <defs>
        <radialGradient id="horizons-sun-gradient" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFF000" />
          <stop offset="60%" stopColor="#FFCC00" />
          <stop offset="100%" stopColor="#FFA500" />
        </radialGradient>

        <mask id="horizons-top-mask">
          <rect width="500" height="160" fill="white" />
          <path d="M 20,88 Q 250,70 480,98 L 480,160 L 20,160 Z" fill="black" />
        </mask>

        <mask id="horizons-bottom-mask">
          <rect width="500" height="160" fill="black" />
          <path d="M 20,88 Q 250,70 480,98 L 480,160 L 20,160 Z" fill="white" />
        </mask>
      </defs>

      <circle cx="395" cy="75" r="42" fill="url(#horizons-sun-gradient)" />

      <g mask="url(#horizons-top-mask)">
        <text
          x="250"
          y="85"
          fontFamily="'Outfit', ui-sans-serif, system-ui, sans-serif"
          fontSize="46"
          fontWeight="300"
          letterSpacing="9"
          fill={foreground}
          textAnchor="middle"
        >
          HORIZONS
        </text>
      </g>

      <path
        d="M 30,88 Q 250,70 470,98"
        stroke={foreground}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      <g mask="url(#horizons-bottom-mask)" transform="translate(0, 168) scale(1, -1)">
        <text
          x="250"
          y="85"
          fontFamily="'Outfit', ui-sans-serif, system-ui, sans-serif"
          fontSize="46"
          fontWeight="300"
          letterSpacing="9"
          fill={reflection}
          textAnchor="middle"
        >
          HORIZONS
        </text>
      </g>
    </svg>
  );
}
