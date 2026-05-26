import Image from "next/image";

export function Logo({ size = 40, variant = "full" }: { size?: number; variant?: "full" | "mark" }) {
  if (variant === "mark") {
    return (
      <Image
        src="/logo.png"
        alt="Ruta Hotel"
        width={size}
        height={size}
        priority
        className="object-contain"
      />
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Image
        src="/logo.png"
        alt=""
        width={size}
        height={size}
        priority
        className="object-contain"
      />
      <div className="flex flex-col leading-none">
        <span className="font-script text-ink-50" style={{ fontSize: `${size * 0.9}px` }}>
          Ruta
        </span>
        <span
          className="font-sans text-ink-100 tracking-[0.32em] uppercase"
          style={{ fontSize: `${size * 0.22}px`, marginTop: `-${size * 0.05}px` }}
        >
          Hotel
        </span>
      </div>
    </div>
  );
}
