// Simplified decorative silhouette of Algeria's outline - not survey-accurate,
// used only as a low-opacity background watermark.
export function AlgeriaMap({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M60 40 L140 25 L230 20 L300 35 L345 55 L330 90 L345 130 L370 180 L365 230 L340 270 L300 320 L230 360 L150 375 L90 360 L55 300 L40 220 L35 150 L45 90 Z"
        fill="currentColor"
      />
    </svg>
  );
}
