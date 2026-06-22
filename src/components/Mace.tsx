export default function Mace({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="议会权杖"
    >
      {/* Shaft */}
      <rect x="26" y="60" width="8" height="110" fill="#C8A13A" stroke="#9A7B28" />
      {/* Decorative rings */}
      <rect x="24" y="70" width="12" height="4" fill="#E6C86E" stroke="#9A7B28" />
      <rect x="24" y="100" width="12" height="4" fill="#E6C86E" stroke="#9A7B28" />
      <rect x="24" y="130" width="12" height="4" fill="#E6C86E" stroke="#9A7B28" />
      {/* Base */}
      <path
        d="M20 170 L40 170 L38 190 L22 190 Z"
        fill="#4A332A"
        stroke="#2E201A"
      />
      <rect x="18" y="190" width="24" height="8" fill="#C8A13A" stroke="#9A7B28" />
      {/* Crown head */}
      <path
        d="M15 60 L45 60 L45 45 L30 30 L15 45 Z"
        fill="#C8A13A"
        stroke="#9A7B28"
      />
      {/* Crown jewels */}
      <circle cx="30" cy="38" r="3" fill="#6B1C23" />
      <circle cx="22" cy="48" r="2" fill="#2D3E2F" />
      <circle cx="38" cy="48" r="2" fill="#2D3E2F" />
      {/* Orb on top */}
      <circle cx="30" cy="22" r="6" fill="#E6C86E" stroke="#9A7B28" />
      {/* Cross */}
      <path
        d="M30 12 L30 32 M22 22 L38 22"
        stroke="#9A7B28"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
