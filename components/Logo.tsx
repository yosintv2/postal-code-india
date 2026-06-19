export default function Logo({ size = 40 }: { size?: number }) {
  const id = `pcf-grad-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="9" fill={`url(#${id})`} />
      {/* Location pin shape */}
      <path
        d="M20 6C14.477 6 10 10.477 10 16c0 3.6 1.8 6.77 4.55 8.72L20 34l5.45-9.28C28.2 22.77 30 19.6 30 16c0-5.523-4.477-10-10-10z"
        fill="white"
        opacity="0.95"
      />
      {/* Inner circle cutout */}
      <circle cx="20" cy="16" r="4.2" fill={`url(#${id})`} />
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
  );
}
