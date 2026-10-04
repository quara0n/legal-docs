import { ImageResponse } from "next/og";
import { SITE } from "./site";

export const ogSize = { width: 1200, height: 630 };

// Shared social-share card: headline on the left, a sheet of paper on the right.
export function ogImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#fbfaf7", padding: 72, fontFamily: "serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontFamily: "sans-serif", fontWeight: 700, color: "#14171f" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "#0f6b5c", display: "flex" }} />
            {SITE.name}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, color: "#0f6b5c", fontFamily: "sans-serif", fontWeight: 600 }}>{eyebrow}</div>
            <div style={{ fontSize: 76, lineHeight: 1.05, color: "#14171f", marginTop: 12 }}>{title}</div>
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#3b414d", fontFamily: "sans-serif" }}>{footer}</div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            width: 300,
            height: 400,
            alignSelf: "center",
            background: "white",
            borderRadius: 6,
            boxShadow: "0 30px 60px -20px rgba(20,23,31,0.35)",
            display: "flex",
            flexDirection: "column",
            padding: 32,
            gap: 14,
          }}
        >
          <div style={{ height: 14, width: 180, background: "#14171f", borderRadius: 4, alignSelf: "center" }} />
          {[1, 0.9, 0.95, 0.7].map((w, i) => (
            <div key={i} style={{ height: 9, width: `${w * 100}%`, background: "#e6e2d9", borderRadius: 4 }} />
          ))}
          <div style={{ height: 22, width: 140, background: "#fdf3d3", border: "3px solid #f6d77a", borderRadius: 6 }} />
          {[0.85, 1, 0.6].map((w, i) => (
            <div key={i} style={{ height: 9, width: `${w * 100}%`, background: "#e6e2d9", borderRadius: 4 }} />
          ))}
          <div style={{ display: "flex", marginTop: "auto", gap: 20 }}>
            <div style={{ flex: 1, borderBottom: "2px solid #9ca3af", height: 30 }} />
            <div style={{ flex: 1, borderBottom: "2px solid #9ca3af", height: 30 }} />
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
