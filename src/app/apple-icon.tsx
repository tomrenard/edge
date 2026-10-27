import { ImageResponse } from "next/og";

// iOS ignores SVG home-screen icons; this draws the same mark as icon.svg to a PNG (full bleed:
// iOS rounds the corners itself).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "linear-gradient(135deg, #7782e6, #3f48a8)",
      }}
    >
      <svg viewBox="0 0 64 64" width="180" height="180" role="img" aria-label="edge">
        <path
          d="M14 46 30 18l20 28"
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 46h36"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>,
    size,
  );
}
