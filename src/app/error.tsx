"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="eyebrow mb-6">Error</p>
        <h1 className="font-display text-5xl text-ink-50">Algo salió <span className="italic text-gold-300">mal</span>.</h1>
        <div className="flex justify-center mt-6"><span className="rule" /></div>
        <p className="mt-8 text-ink-100/70 italic font-display">
          Estamos teniendo un inconveniente técnico. Probá nuevamente en unos minutos.
        </p>
        <div className="mt-12 flex gap-6 justify-center">
          <button onClick={reset} className="cta-solid">Reintentar</button>
          <Link href="/" className="cta-link">Volver al inicio</Link>
        </div>
      </div>
    </main>
  );
}
