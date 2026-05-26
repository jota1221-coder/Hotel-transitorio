"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="eyebrow mb-4">Error</p>
        <h1 className="font-display text-4xl text-night-50">Algo salió mal.</h1>
        <p className="mt-6 text-night-200">
          Estamos teniendo un inconveniente técnico. Probá nuevamente en unos minutos.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <button onClick={reset} className="btn-primary">Reintentar</button>
          <Link href="/" className="btn-ghost">Volver al inicio</Link>
        </div>
      </div>
    </main>
  );
}
