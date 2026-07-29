import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ruta Hotel · Albergue Transitorio en Munro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020201",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, #1F1B17 0%, #020201 65%)",
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#D5AC5E",
            fontFamily: "serif",
            marginBottom: 28,
          }}
        >
          Ruta Hotel
        </div>
        <div
          style={{
            fontSize: 74,
            color: "#F2EDE5",
            fontFamily: "serif",
            textAlign: "center",
            padding: "0 80px",
            lineHeight: 1.15,
          }}
        >
          Albergue transitorio en Munro
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 28,
            color: "#D6CFC4",
            fontFamily: "serif",
            fontStyle: "italic",
          }}
        >
          Cochera privada · Hidromasaje · Abierto 24 hs
        </div>
      </div>
    ),
    { ...size }
  );
}
