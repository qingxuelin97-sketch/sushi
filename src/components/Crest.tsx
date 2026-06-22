export default function Crest({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 140"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="议会徽章"
    >
      {/* Crown base */}
      <path
        d="M20 80 L60 110 L100 80 L100 50 L60 70 L20 50 Z"
        fill="#C8A13A"
        stroke="#9A7B28"
        strokeWidth="1.5"
      />
      {/* Crown top band */}
      <path
        d="M15 50 L60 75 L105 50 L105 38 L60 58 L15 38 Z"
        fill="#E6C86E"
        stroke="#9A7B28"
        strokeWidth="1.5"
      />
      {/* Crown peaks */}
      <path
        d="M15 38 L25 15 L35 38 L45 12 L60 38 L75 12 L85 38 L95 15 L105 38"
        fill="none"
        stroke="#C8A13A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Jewels */}
      <circle cx="25" cy="30" r="3" fill="#6B1C23" />
      <circle cx="45" cy="26" r="3" fill="#2D3E2F" />
      <circle cx="60" cy="32" r="4" fill="#6B1C23" />
      <circle cx="75" cy="26" r="3" fill="#2D3E2F" />
      <circle cx="95" cy="30" r="3" fill="#6B1C23" />
      {/* Portcullis center */}
      <path
        d="M50 115 L50 130 L70 130 L70 115"
        fill="none"
        stroke="#9A7B28"
        strokeWidth="2"
      />
      <path
        d="M45 130 L75 130 L75 135 L45 135 Z"
        fill="#C8A13A"
        stroke="#9A7B28"
      />
      {/* Laurel branches */}
      <path
        d="M30 120 Q15 115 10 100 Q8 90 15 85"
        fill="none"
        stroke="#2D3E2F"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M90 120 Q105 115 110 100 Q112 90 105 85"
        fill="none"
        stroke="#2D3E2F"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Motto scroll */}
      <path
        d="M25 138 Q60 145 95 138"
        fill="none"
        stroke="#9A7B28"
        strokeWidth="1.5"
      />
      <text
        x="60"
        y="144"
        textAnchor="middle"
        className="font-inscription"
        fill="#9A7B28"
        fontSize="5"
        letterSpacing="0.5"
      >
        ORDER · ORDER
      </text>
    </svg>
  );
}
