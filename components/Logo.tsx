export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="8" fill="url(#pin-grad)" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
        fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="16" fill="#fff" letterSpacing="-0.5">
        PIN
      </text>
      <defs>
        <linearGradient id="pin-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
    </svg>
  );
}
