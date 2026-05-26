import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="eyebrow mb-6">404</p>
        <h1 className="font-display text-6xl text-ink-50 leading-none">
          Página no <span className="italic text-gold-300">encontrada</span>.
        </h1>
        <div className="flex justify-center mt-6"><span className="rule" /></div>
        <p className="mt-8 text-ink-100/70 italic font-display">El enlace que seguiste no existe o fue movido.</p>
        <Link href="/" className="cta-solid mt-12 inline-flex">Volver al inicio</Link>
      </div>
    </main>
  );
}
