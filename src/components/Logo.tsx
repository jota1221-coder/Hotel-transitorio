// Logo Ruta Hotel — versión tipográfica.
// TODO: Cuando tengamos el logo real en alta calidad, guardarlo en /public/logo-ruta.png
// y reemplazar el bloque <Logo> por <img src="/logo-ruta.png" />.

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-baseline leading-none">
      <span
        className="logo-script text-night-50"
        style={{ fontSize: `${size * 1.4}px` }}
      >
        Ruta
      </span>
      <span
        className="logo-hotel"
        style={{ fontSize: `${size * 0.32}px` }}
      >
        Hotel
      </span>
    </div>
  );
}
