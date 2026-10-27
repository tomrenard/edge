import { ImageResponse } from "next/og";
import { SPLASH_SIZES } from "@/lib/iphones";

// Built once at build time; any other size is a 404, so nobody can make the server render.
export const dynamicParams = false;
export const generateStaticParams = () => SPLASH_SIZES.map((size) => ({ size }));

/** Launch screen for one iPhone size ("1179x2556"): the icon's indigo, its mark on a glass tile. */
export async function GET(_: Request, { params }: { params: Promise<{ size: string }> }) {
  const [w = 0, h = 0] = (await params).size.split("x").map(Number);
  const mark = Math.round(w * 0.3);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #7782e6, #5e6ad2 55%, #333b8f)",
      }}
    >
      <div
        style={{
          width: mark,
          height: mark,
          borderRadius: Math.round(mark * 0.28),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, rgba(255,255,255,.36), rgba(255,255,255,.08))",
          border: "3px solid rgba(255,255,255,.5)",
        }}
      >
        <svg
          viewBox="0 0 64 64"
          width={mark * 0.8}
          height={mark * 0.8}
          role="img"
          aria-label="edge"
        >
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
      </div>
    </div>,
    { width: w, height: h, headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  );
}
