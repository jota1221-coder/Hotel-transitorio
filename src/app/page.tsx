import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatARS } from "@/lib/format";
import { Logo } from "@/components/Logo";

export default async function HomePage() {
  const rooms = await prisma.room.findMany({ orderBy: { pricePerNight: "asc" } });
  const minPrice = rooms[0]?.pricePerNight ?? 38000;

  return (
    <main>
      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-night-900/70 border-b hairline">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo size={38} />
          </Link>
          <div className="hidden md:flex items-center gap-10 eyebrow !text-night-100">
            <a href="#habitaciones" className="hover:text-rose-400 transition-colors">Habitaciones</a>
            <a href="#tarifas" className="hover:text-rose-400 transition-colors">Tarifas</a>
            <a href="#ubicacion" className="hover:text-rose-400 transition-colors">Ubicación</a>
          </div>
          <Link href="/reservar" className="btn-primary !py-2 !px-4 text-xs">Reservar</Link>
        </div>
      </nav>

      {/* HERO con imagen de fondo full */}
      <section className="relative min-h-[100vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <div className="mood-image mood-image-hero w-full h-full">
            <img
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=2000&q=85"
              alt="Habitación con hidromasaje"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Glow ambient */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 -left-40 w-[500px] h-[500px] bg-night-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 pb-32 lg:pb-40">
          <p className="eyebrow mb-6">Albergue transitorio · Munro · Abierto 24 hs</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl leading-[0.95] text-night-50 max-w-4xl">
            La ruta hacia<br/>
            <span className="italic text-rose-400">el placer</span><br/>
            de tus momentos íntimos.
          </h1>
          <p className="mt-10 max-w-md text-night-100 leading-relaxed">
            40 habitaciones con jacuzzi, cochera privada y room service. Reservá online en 60 segundos,
            pagás una seña y abonás el resto al llegar.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/reservar" className="btn-primary">Reservar ahora →</Link>
            <a href="#habitaciones" className="btn-ghost">Ver habitaciones</a>
          </div>

          {/* precio chip */}
          <div className="mt-12 inline-flex items-baseline gap-3 border-l-2 border-rose-500 pl-5">
            <p className="eyebrow">Desde</p>
            <p className="font-display text-3xl text-night-50">{formatARS(minPrice)}<span className="text-base text-night-300"> / turno</span></p>
          </div>
        </div>
      </section>

      {/* HABITACIONES */}
      <section id="habitaciones" className="py-24 border-t hairline">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="eyebrow mb-4">01 — Habitaciones</p>
              <h2 className="font-display text-4xl lg:text-5xl text-night-50">Elegí la tuya.</h2>
            </div>
            <p className="hidden md:block max-w-xs text-sm text-night-200">
              40 habitaciones distribuidas en 4 categorías. Cada una pensada para una experiencia distinta.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <article key={room.id} className="group">
                <div className="mood-image aspect-[4/5] mb-5">
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="font-display italic text-sm text-night-50 bg-night-900/70 backdrop-blur px-3 py-1.5 border border-rose-500/30">{room.type}</span>
                  </div>
                </div>
                <h3 className="font-display text-2xl text-night-50">{room.name}</h3>
                <p className="mt-2 text-sm text-night-200 leading-relaxed">{room.description}</p>
                <div className="mt-5 flex items-center justify-between pt-5 border-t hairline">
                  <span className="font-display text-xl text-night-50">{formatARS(room.pricePerNight)}<span className="text-xs text-night-300"> /turno</span></span>
                  <Link href={`/reservar?room=${room.id}`} className="font-display italic text-lg text-rose-400 border-b border-rose-500/50 pb-0.5 hover:text-rose-300 hover:border-rose-300 transition-colors">Reservar →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TARIFAS */}
      <section id="tarifas" className="py-24 border-t hairline bg-night-800/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-4">02 — Tarifas</p>
              <h2 className="font-display text-4xl lg:text-5xl leading-tight text-night-50">Transparencia <span className="italic text-rose-400">total</span>.</h2>
              <p className="mt-6 text-night-200 max-w-md leading-relaxed">
                Sin cargos sorpresa. El precio que ves es el precio final. Aceptamos efectivo, débito, crédito y Mercado Pago.
              </p>
              <div className="mt-10 space-y-2">
                <p className="text-sm text-night-200"><span className="text-night-50 font-medium">Turnos de 2 horas</span> en horario habitual.</p>
                <p className="text-sm text-night-200"><span className="text-night-50 font-medium">Turnos de 3 horas</span> entre las 12 y las 20 hs (para habitaciones con cochera).</p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="border hairline">
                <Tarifa nombre="Habitación Simple"        precio={38000} turno="Turnos de 2 hs" />
                <Tarifa nombre="Con cochera"               precio={43000} turno="3 hs (12-20hs) / 2 hs fuera de horario" />
                <Tarifa nombre="Con cochera e hidromasaje" precio={48000} turno="3 hs (12-20hs) / 2 hs fuera de horario" />
                <Tarifa nombre="Premier con hidromasaje"   precio={55000} turno="3 hs (12-20hs)" destacado />
              </div>

              {/* Pernocte */}
              <div className="mt-8 border border-rose-500/30 bg-rose-500/5 p-6">
                <p className="eyebrow !text-rose-400 mb-3">Pernocte</p>
                <p className="font-display text-2xl text-night-50">
                  <span className="text-rose-400">+ {formatARS(5000)}</span> sobre el precio de la habitación
                </p>
                <ul className="mt-4 space-y-2 text-sm text-night-200">
                  <li><span className="text-night-50 font-medium">Domingos a jueves:</span> desde las 22 hs hasta las 10 hs</li>
                  <li><span className="text-night-50 font-medium">Viernes y sábados:</span> desde las 2 hs hasta las 12 hs</li>
                  <li className="text-rose-300 pt-2 border-t border-rose-500/20 mt-3"><span className="font-medium">Incluye desayuno</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UBICACIÓN */}
      <section id="ubicacion" className="py-24 border-t hairline">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="eyebrow mb-4">03 — Ubicación</p>
            <h2 className="font-display text-4xl lg:text-5xl leading-tight text-night-50">Munro, <span className="italic text-rose-400">Zona Norte</span>.</h2>
            <ul className="mt-10 space-y-5">
              {[
                ["Esteban Echeverría 3040", "Munro, Vicente López"],
                ["Abierto las 24 horas", "Todos los días del año"],
                ["Entrada por cochera privada", "Acceso 100% discreto"],
                ["Estacionamiento incluido", "Sin cargo extra"]
              ].map(([t, d]) => (
                <li key={t} className="flex gap-6 pb-5 border-b hairline">
                  <span className="font-display text-2xl text-rose-400 w-8">·</span>
                  <div>
                    <h4 className="font-medium text-night-50">{t}</h4>
                    <p className="text-sm text-night-200 mt-1">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="https://wa.me/541147624892" target="_blank" rel="noopener" className="btn-ghost text-xs">WhatsApp →</a>
              <a href="tel:+541147624892" className="btn-ghost text-xs">11 4762-4892</a>
            </div>
          </div>
          <div className="aspect-[4/5] bg-night-700 overflow-hidden border border-rose-500/10">
            <iframe
              src="https://www.google.com/maps?q=Esteban+Echeverria+3040+Munro&output=embed"
              className="w-full h-full grayscale-[60%] contrast-110 brightness-90"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* RESERVAR CTA */}
      <section id="reservar" className="py-32 border-t hairline relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-900/10 to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="eyebrow mb-6">04 — Reservar</p>
          <h2 className="font-display text-5xl lg:text-7xl leading-none text-night-50">¿Te <span className="italic text-rose-400">esperamos</span>?</h2>
          <p className="mt-8 text-night-200 max-w-md mx-auto">
            Elegí habitación, fecha y horario. Pagás la seña por Mercado Pago y el resto al llegar.
          </p>
          <Link href="/reservar" className="btn-primary mt-10 !px-10 !py-4">Reservar mi habitación →</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t hairline py-12 bg-night-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <Logo size={48} />
            <p className="mt-5 text-night-300 italic">"La ruta hacia el placer de tus momentos íntimos."</p>
          </div>
          <div>
            <p className="eyebrow mb-3">Contacto</p>
            <p className="text-night-100">11 4762-4892</p>
            <a href="https://instagram.com/ruta.hotel" className="block text-night-100 hover:text-rose-400 transition-colors mt-1">Instagram @ruta.hotel</a>
            <a href="https://facebook.com/hotelruta" className="block text-night-100 hover:text-rose-400 transition-colors">Facebook /hotelruta</a>
          </div>
          <div>
            <p className="eyebrow mb-3">Ubicación</p>
            <p className="text-night-100">Esteban Echeverría 3040</p>
            <p className="text-night-100">Munro, Vicente López</p>
            <p className="text-night-300 mt-2 text-xs">Abierto las 24 hs · Todos los días</p>
          </div>
        </div>
        <p className="text-center text-xs text-night-400 mt-12">© 2026 Ruta Hotel. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}

function Tarifa({ nombre, precio, turno, destacado }: { nombre: string; precio: number; turno: string; destacado?: boolean }) {
  return (
    <div className={`grid grid-cols-12 gap-4 px-6 py-5 border-b hairline last:border-0 ${destacado ? "bg-rose-500/5" : ""}`}>
      <div className="col-span-12 sm:col-span-6">
        <p className="font-medium text-night-50">{nombre}</p>
        <p className="text-xs text-night-300 mt-1">{turno}</p>
      </div>
      <div className="col-span-12 sm:col-span-6 sm:text-right">
        <p className={`font-display text-2xl ${destacado ? "text-rose-400" : "text-night-50"}`}>{formatARS(precio)}</p>
      </div>
    </div>
  );
}
