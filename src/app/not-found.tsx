import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="eyebrow mb-4">404</p>
        <h1 className="font-display text-5xl text-night-50">Página no encontrada.</h1>
        <p className="mt-6 text-night-200">El enlace que seguiste no existe o fue movido.</p>
        <Link href="/" className="btn-primary mt-10 inline-flex">Volver al inicio</Link>
      </div>
    </main>
  );
}
