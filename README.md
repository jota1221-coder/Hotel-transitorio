# Ruta Hotel — Sistema de reservas online

> Sitio web completo con sistema de reservas para un hotel transitorio. Incluye landing pública, sistema de turnos y pernoctes, panel administrativo y API REST con validaciones, rate limiting y antispam.

**🌐 Demo en vivo:** [hotel-transitorio.vercel.app](https://hotel-transitorio.vercel.app)

**📦 Stack:** Next.js 14 · TypeScript · Prisma · PostgreSQL · Tailwind · Zod

---

## ✨ Features

- **Landing editorial** con catálogo de habitaciones, tarifas detalladas y mapa
- **Sistema de turnos** con duración variable según habitación y horario:
  - Habitación Simple: turnos de 2 horas
  - Habitaciones con cochera/hidromasaje: 3 horas (12–20hs) o 2 horas (fuera)
- **Sistema de pernocte** con horarios variables según día de la semana
- **Cálculo automático** de disponibilidad con buffer de limpieza entre turnos
- **Lightbox** de imágenes con animaciones
- **Sticky booking bar** persistente en todas las páginas
- **Panel administrativo** protegido con autenticación (HTTP Basic Auth)
- **Stats en vivo** del admin: reservas totales, próximas, facturación, señas
- **Rate limiting** por IP (5 reservas / 15 min) contra spam
- **Honeypot antispam** invisible para usuarios reales
- **Validaciones**: fechas en el pasado, overlap de reservas, tipos con Zod

---

## 🛠️ Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS + diseño editorial propio |
| Base de datos | Prisma ORM + PostgreSQL (Neon serverless) |
| Validación | Zod |
| Autenticación | HTTP Basic Auth (middleware Next.js) |
| Tipografías | Cormorant Garamond, Pinyon Script, Inter (next/font) |
| Hosting | Vercel |

---

## 🚀 Setup local

Requisitos: Node.js 18+

```bash
git clone https://github.com/jota1221-coder/hotel-transitorio.git
cd hotel-transitorio
npm install
cp .env.example .env
# Editar .env con tu DATABASE_URL (PostgreSQL) y credenciales del admin
npx prisma db push
npm run db:seed
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

El panel admin está en `/admin` (auth con las credenciales del `.env`).

---

## 📂 Estructura

```
src/
├── app/
│   ├── page.tsx               # Landing pública
│   ├── reservar/page.tsx      # Flujo de reserva (día → tipo → slot)
│   ├── confirmacion/[id]/     # Confirmación post-reserva
│   ├── admin/page.tsx         # Panel admin (protegido)
│   ├── api/
│   │   ├── rooms/route.ts     # GET habitaciones
│   │   ├── availability/      # GET slots disponibles por día
│   │   └── bookings/          # POST reserva / GET listado (admin)
│   ├── error.tsx              # Error boundary
│   └── not-found.tsx          # 404
├── components/
│   ├── ReservationForm.tsx    # Formulario con honeypot
│   ├── BookingBar.tsx         # Sticky bar
│   ├── ImageLightbox.tsx      # Lightbox de imágenes
│   ├── Reveal.tsx             # Animaciones on-scroll
│   └── Logo.tsx
├── lib/
│   ├── db.ts                  # Cliente Prisma singleton
│   ├── format.ts              # Helpers ARS, fechas
│   ├── rate-limit.ts          # Rate limiting in-memory
│   └── turnos.ts              # Lógica de turnos/pernocte/disponibilidad
└── middleware.ts              # Auth Basic para /admin
```

---

## 🔐 Seguridad implementada

- **Autenticación** en `/admin` y `GET /api/bookings`
- **Rate limiting** por IP en `POST /api/bookings`
- **Honeypot** invisible en formulario público
- **Validación estricta** con Zod en todos los inputs
- **Verificación de disponibilidad** atómica antes de crear reserva
- **Manejo de errores** sin filtrar stack traces al cliente
- **Variables sensibles** fuera del repo (`.env` en `.gitignore`)

---

## 📋 Roadmap

- [x] Migrar a PostgreSQL (Neon)
- [x] Deploy a Vercel con HTTPS
- [x] Sistema de turnos + pernocte con cleanup buffer
- [x] Lightbox de imágenes
- [ ] Integración con Mercado Pago para cobro real de seña
- [ ] Emails transaccionales con Resend
- [ ] Cancelación de reservas (huésped + admin)
- [ ] Notificaciones por WhatsApp al hotel
- [ ] Exportación de reservas a CSV/Excel

---

## ⚠️ Aviso

Este es un **proyecto de demostración técnica** desarrollado de forma independiente con fines de portfolio. No es el sitio oficial de ningún establecimiento y no mantiene relación comercial con el mismo.

---

## 👤 Autor

**Joaquin Rao** — Estudiante de Ciencia de Datos, desarrollador web freelance.

[GitHub](https://github.com/jota1221-coder) · Martínez, Buenos Aires
