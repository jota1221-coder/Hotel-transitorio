import Image from "next/image";

/**
 * Foto de una habitación, con estado explícito para las categorías de las que
 * todavía no hay foto propia.
 *
 * Por qué existe: antes, las dos categorías Simple mostraban la foto de una
 * suite con hidromasaje que sale $10.000 más. Repetir la foto de OTRA
 * habitación le promete al huésped algo que no va a recibir, así que las
 * categorías sin material propio muestran este panel en vez de una foto ajena.
 */
export function RoomPhoto({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes?: string;
}) {
  if (src) {
    return <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />;
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink-800 px-4 text-center">
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="1" stroke="#6E665C" strokeWidth="1.2" />
        <circle cx="8.5" cy="10" r="1.5" stroke="#6E665C" strokeWidth="1.2" />
        <path d="M3.5 16.5L8 12.5l3.5 3 4-4.5 5 5.5" stroke="#6E665C" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <p className="mt-3 font-display italic text-ink-200 text-sm">Sin foto disponible</p>
    </div>
  );
}
