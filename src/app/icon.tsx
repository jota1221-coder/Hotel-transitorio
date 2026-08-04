import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon: "R" de Ruta en dorado sobre el negro del sitio. A 32px el
// logotipo completo es ilegible, así que se reduce a la inicial.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020201",
          color: "#D5AC5E",
          fontSize: 24,
          fontFamily: "serif",
        }}
      >
        R
      </div>
    ),
    { ...size }
  );
}
