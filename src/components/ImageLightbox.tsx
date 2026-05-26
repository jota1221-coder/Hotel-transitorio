"use client";

import { useEffect, useState, ReactNode } from "react";
import Image from "next/image";

export default function ImageLightbox({
  src,
  alt,
  children,
}: {
  src: string;
  alt: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full h-full cursor-zoom-in"
        aria-label={`Ver ${alt} en grande`}
      >
        {children}
      </button>

      {open && (
        <div
          className="lightbox-overlay"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setOpen(false); }}
            className="lightbox-close"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6L18 18M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>

          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={1200}
              className="lightbox-image"
              priority
            />
            <p className="lightbox-caption">{alt}</p>
          </div>
        </div>
      )}
    </>
  );
}
