export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { formatARS } from "@/lib/format";
import { Logo } from "@/components/Logo";
import Reveal from "@/components/Reveal";
import BookingBar from "@/components/BookingBar";
import ImageLightbox from "@/components/ImageLightbox";

export default async function HomePage() {
  const rooms = await prisma.room.findMany({ orderBy: { pricePerNight: "asc" } });
  const featured = rooms.filter(r => r.type.toLowerCase().includes("hidromasaje")).slice(0, 2);
  const minPrice = rooms[0]?.pricePerNight ?? 38000;

  return (
    <main className="pb-32">
      {/* NAV */}
      <nav className="fixed top-7 inset-x-0 z-50 backdrop-blur-md bg-ink-900/40 border-b hairline">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo size={42} />
          </Link>
          <div className="hidden md:flex items-center gap-12">
            <a href="#habitaciones" className="cta-link !border-b-0 !pb-0">Habitaciones</a>
            <a href="#tarifas" className="cta-link !border-b-0 !pb-0">Tarifas</a>
            <a href="#ubicacion" className="cta-link !border-b-0 !pb-0">Ubicación</a>
          </div>
          <Link href="/reservar" className="cta-link">Reservar</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-40">
        <div className="absolute inset-0 mood-hero">
          <Image
            src="/hotel/hab23-1.jpg"
            alt="Habitación con hidromasaje"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="relative text-center px-6 max-w-5xl mx-auto z-10">
          <p className="eyebrow text-gold-300 mb-8">Albergue transitorio · Munro · Abierto 24 hs</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl text-ink-50 leading-[1.05] font-light">
            La ruta hacia<br />
            <span className="font-script text-gold-300 text-6xl sm:text-7xl lg:text-9xl block py-2 leading-[0.9]">el placer</span>
            de tus momentos íntimos.
          </h1>
          <div className="flex justify-center mt-10">
            <span className="rule rule-gold" />
          </div>
          <p className="mt-10 text-ink-100/80 max-w-md mx-auto leading-relaxed italic">
            Cuarenta habitaciones con jacuzzi, cochera privada y room service. Discreción absoluta.
          </p>
          <div className="mt-12 flex items-center justify-center gap-10">
            <Link href="/reservar" className="cta-solid">Reservar ahora</Link>
            <a href="#habitaciones" className="cta-link">Ver habitaciones</a>
          </div>

          <p className="mt-16 eyebrow text-gold-300">
            Desde <span className="font-display text-3xl text-ink-50 normal-case tracking-normal not-italic mx-2">{formatARS(minPrice)}</span> <span className="text-ink-50/70">/ turno</span>
          </p>
        </div>
      </section>

      {/* BIENVENIDA */}
      <section className="py-32 border-t hairline">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-16 items-center">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow mb-6">01 — La casa</p>
            <h2 className="font-display text-3xl lg:text-5xl text-ink-50 leading-tight font-light">
              Una <span className="italic text-gold-300">pausa</span> en el camino,<br/>
              un secreto que se guarda.
            </h2>
            <span className="rule mt-8" />
            <div className="mt-10 space-y-5 text-ink-100/80 text-lg leading-relaxed font-display">
              <p>
                <em>Ruta Hotel</em> nació para quienes buscan un encuentro sin protocolos.
                Cuarenta habitaciones pensadas para el deseo: hidromasajes, iluminación
                tenue, sábanas frescas, silencio.
              </p>
              <p>
                Llegás por la cochera. Nadie te ve entrar, nadie te ve salir.
                El tiempo, por una vez, es solo tuyo.
              </p>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5" delay={200}>
            <ImageLightbox src="/hotel/hab15-2.jpg" alt="Interior Ruta Hotel">
              <div className="mood aspect-[3/4]">
                <Image src="/hotel/hab15-2.jpg" alt="Interior Ruta Hotel" fill className="object-cover" />
              </div>
            </ImageLightbox>
          </Reveal>
        </div>
      </section>

      {/* DESTACADAS — editorial alternado */}
      <section id="habitaciones" className="py-32 border-t hairline">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <Reveal className="text-center max-w-2xl mx-auto mb-24">
            <p className="eyebrow mb-6">02 — Habitaciones</p>
            <h2 className="font-display text-3xl lg:text-5xl text-ink-50 leading-tight font-light">
              Cada habitación, un <span className="italic text-gold-300">escenario</span>.
            </h2>
            <div className="flex justify-center"><span className="rule" /></div>
            <p className="mt-8 text-ink-100/70 italic">
              Seis categorías. Distintas atmósferas. La misma promesa de privacidad.
            </p>
          </Reveal>

          {featured.map((room, i) => (
            <Reveal key={room.id} className="mb-32 last:mb-0">
              <div className={`grid lg:grid-cols-12 gap-12 items-center ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}>
                <div className="lg:col-span-7 [direction:ltr]">
                  <ImageLightbox src={room.imageUrl} alt={room.name}>
                    <div className="mood aspect-[4/3]">
                      <Image src={room.imageUrl} alt={room.name} fill className="object-cover" />
                    </div>
                  </ImageLightbox>
                </div>
                <div className="lg:col-span-5 [direction:ltr]">
                  <p className="eyebrow mb-4">{room.type}</p>
                  <h3 className="font-display text-3xl lg:text-4xl text-ink-50 leading-tight font-light">
                    {room.name}
                  </h3>
                  <span className="rule mt-6" />
                  <p className="mt-8 text-ink-100/70 text-lg leading-relaxed font-display italic">
                    {room.description}
                  </p>
                  <div className="mt-10 flex items-baseline gap-4">
                    <span className="font-display text-3xl text-gold-300">{formatARS(room.pricePerNight)}</span>
                    <span className="eyebrow text-ink-100/50">/ turno</span>
                  </div>
                  <Link href={`/reservar?room=${room.id}`} className="cta-link mt-10">
                    Reservar esta habitación
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}

          {/* Grid de todas las demás */}
          <Reveal className="border-t hairline pt-20 mt-20">
            <h3 className="font-display text-3xl text-ink-50 text-center mb-16">
              Las <span className="italic text-gold-300">seis</span> categorías
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
              {rooms.map(room => (
                <Link key={room.id} href={`/reservar?room=${room.id}`} className="group block">
                  <div className="mood aspect-[4/5] mb-5">
                    <Image src={room.imageUrl} alt={room.name} fill className="object-cover" />
                  </div>
                  <p className="eyebrow mb-2">{room.type}</p>
                  <h4 className="font-display text-2xl text-ink-50 group-hover:text-gold-300 transition-colors">
                    {room.name}
                  </h4>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="font-display text-lg text-ink-100/70">{formatARS(room.pricePerNight)} <span className="text-xs text-ink-100/40">/turno</span></span>
                    <span className="cta-link !text-[10px]">Reservar</span>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TARIFAS */}
      <section id="tarifas" className="py-32 border-t hairline bg-ink-900/40">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <Reveal className="text-center max-w-2xl mx-auto mb-20">
            <p className="eyebrow mb-6">03 — Tarifas</p>
            <h2 className="font-display text-3xl lg:text-5xl text-ink-50 leading-tight font-light">
              <span className="italic text-gold-300">Transparencia</span> total.
            </h2>
            <div className="flex justify-center"><span className="rule" /></div>
            <p className="mt-8 text-ink-100/70 italic">
              El precio que ves es el precio final. Aceptamos efectivo, débito, crédito y Mercado Pago.
            </p>
          </Reveal>

          <Reveal>
            <div className="border-t hairline">
              <Tarifa nombre="Habitación Simple"          precio={38000} turno="Turnos de 2 hs" />
              <Tarifa nombre="Con cochera"                precio={43000} turno="3 hs (12-20hs) · 2 hs fuera de horario" />
              <Tarifa nombre="Con cochera e hidromasaje"  precio={48000} turno="3 hs (12-20hs) · 2 hs fuera de horario" />
              <Tarifa nombre="Premier con hidromasaje"    precio={55000} turno="3 hs (12-20hs)" destacado />
            </div>

            <div className="mt-12 border-t border-b hairline py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="eyebrow text-gold-300 mb-3">Pernocte</p>
                <p className="font-display text-2xl text-ink-50">
                  + {formatARS(5000)} <span className="text-ink-100/50 text-lg italic">sobre el precio de la habitación</span>
                </p>
              </div>
              <ul className="space-y-2 text-sm text-ink-100/70 italic font-display">
                <li>Dom–jue · 22 hs a 10 hs</li>
                <li>Vie–sáb · 02 hs a 12 hs</li>
                <li className="text-gold-300 not-italic eyebrow !text-[10px] pt-2">Incluye desayuno</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* UBICACIÓN */}
      <section id="ubicacion" className="py-32 border-t hairline">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-16 items-center">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-6">04 — Ubicación</p>
            <h2 className="font-display text-3xl lg:text-5xl text-ink-50 leading-tight font-light">
              Munro,<br />
              <span className="italic text-gold-300">Zona Norte</span>.
            </h2>
            <span className="rule mt-6" />
            <ul className="mt-10 space-y-6">
              {[
                ["Esteban Echeverría 3040", "Munro, Vicente López"],
                ["Abierto las 24 horas", "Todos los días del año"],
                ["Entrada por cochera privada", "Acceso 100% discreto"],
                ["Estacionamiento incluido", "Sin cargo extra"]
              ].map(([t, d]) => (
                <li key={t} className="flex gap-5 pb-5 border-b hairline">
                  <span className="font-script text-2xl text-gold-300 w-6 leading-none">·</span>
                  <div>
                    <p className="font-display text-xl text-ink-50">{t}</p>
                    <p className="text-sm text-ink-100/60 italic mt-1 font-display">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex gap-6">
              <a href="https://wa.me/541147624892" target="_blank" rel="noopener" className="cta-link">WhatsApp</a>
              <a href="tel:+541147624892" className="cta-link">11 4762-4892</a>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={200}>
            <div className="aspect-[5/4] overflow-hidden border hairline">
              <iframe
                src="https://www.google.com/maps?q=Esteban+Echeverria+3040+Munro&output=embed"
                className="w-full h-full grayscale contrast-110 brightness-75"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CIERRE */}
      <section className="py-40 border-t hairline relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-wine-500/10 rounded-full blur-3xl" />
        </div>
        <Reveal className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="eyebrow mb-6">05 — Reservá</p>
          <h2 className="font-display text-4xl lg:text-6xl text-ink-50 leading-tight font-light">
            ¿Te <span className="italic text-gold-300">esperamos</span>?
          </h2>
          <div className="flex justify-center mt-8"><span className="rule rule-gold" /></div>
          <p className="mt-10 text-ink-100/70 italic max-w-md mx-auto font-display text-lg">
            Elegí habitación, fecha y horario. Pagás la seña por Mercado Pago y el resto al llegar.
          </p>
          <Link href="/reservar" className="cta-solid mt-12 !px-12 !py-5">
            Reservar mi habitación
          </Link>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t hairline pt-20 pb-10 bg-ink-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-3 gap-12">
          <div>
            <Logo size={48} />
            <p className="mt-6 text-ink-100/60 italic font-display leading-relaxed">
              "La ruta hacia el placer<br />de tus momentos íntimos."
            </p>
          </div>
          <div>
            <p className="eyebrow mb-5">Contacto</p>
            <p className="text-ink-100 font-display text-lg">11 4762-4892</p>
            <a href="https://instagram.com/ruta.hotel" className="block text-ink-100/70 hover:text-gold-300 transition-colors mt-2 font-display italic">Instagram</a>
            <a href="https://facebook.com/hotelruta" className="block text-ink-100/70 hover:text-gold-300 transition-colors font-display italic">Facebook</a>
          </div>
          <div>
            <p className="eyebrow mb-5">Ubicación</p>
            <p className="text-ink-100 font-display text-lg">Esteban Echeverría 3040</p>
            <p className="text-ink-100/70 font-display italic">Munro · Vicente López</p>
            <p className="text-ink-100/50 mt-3 eyebrow !text-[10px]">Abierto las 24 hs</p>
          </div>
        </div>
        <div className="mt-16 pt-10 border-t hairline">
          <p className="text-center text-[11px] text-ink-100/40 italic font-display max-w-2xl mx-auto leading-relaxed px-6">
            Este sitio es un proyecto de demostración técnica desarrollado de forma independiente.
            No es el sitio oficial de Ruta Hotel ni mantiene relación comercial con el establecimiento.
          </p>
          <p className="text-center text-[10px] text-ink-100/30 mt-5 eyebrow">
            Demo desarrollada por Joaquin Rao · 2026
          </p>
        </div>
      </footer>

      <BookingBar />
    </main>
  );
}

function Tarifa({ nombre, precio, turno, destacado }: { nombre: string; precio: number; turno: string; destacado?: boolean }) {
  return (
    <div className={`grid grid-cols-12 gap-4 py-7 border-b hairline ${destacado ? "bg-wine-900/15" : ""}`}>
      <div className="col-span-12 sm:col-span-7">
        <p className={`font-display text-2xl ${destacado ? "text-gold-300" : "text-ink-50"}`}>{nombre}</p>
        <p className="text-xs text-ink-100/50 mt-2 eyebrow !text-[10px]">{turno}</p>
      </div>
      <div className="col-span-12 sm:col-span-5 sm:text-right">
        <p className={`font-display text-3xl ${destacado ? "text-gold-300" : "text-ink-50"}`}>
          {formatARS(precio)}
        </p>
      </div>
    </div>
  );
}
