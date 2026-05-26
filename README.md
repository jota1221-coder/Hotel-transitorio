# Ruta Hotel — Sistema de reservas online

> Sitio web completo con sistema de reservas para un hotel transitorio en Munro, Buenos Aires. Incluye landing pública, flujo de reserva, panel administrativo y API REST con validaciones, rate limiting y antispam.

**Status:** Demo funcional · Listo para mostrar al cliente

---

## ✨ Features

- **Landing pública** con catálogo de habitaciones, tarifas detalladas y mapa
- **Sistema de reservas** con verificación de disponibilidad en tiempo real
- **Cálculo automático** de seña (30%) y saldo restante
- **Página de confirmación** con código de reserva único
- **Panel administrativo** protegido con autenticación (Basic Auth)
- **Stats en vivo** del admin: reservas totales, próximas, facturación, señas
- **Rate limiting** por IP (5 reservas / 15 min) contra spam
- **Honeypot antispam** invisible para usuarios reales
- **Validaciones**: fechas en el pasado, overlap de reservas, tipos con Zod

---

## 🛠️ Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS + sistema propio (mood images, hairlines) |
| Base de datos | Prisma ORM + SQLite (dev) / PostgreSQL (prod) |
| Validación | Zod |
| Autenticación | HTTP Basic Auth (middleware) |
| Tipografías | Italianno, Cormorant Garamond, Inter |

---

## 🚀 Setup local

Requisitos: Node.js 18+

```bash
git clone https://github.com/jota1221-coder/hotel-transitorio.git
cd hotel-transitorio
npm install
cp .env.example .env
npx prisma db push
npm run db:seed
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

Acceder al admin en `/admin` con las credenciales del `.env`.

---

## 📂 Estructura

```
src/
├── app/
│   ├── page.tsx               # Landing pública
│   ├── reservar/page.tsx      # Flujo de reserva
│   ├── confirmacion/[id]/     # Confirmación post-reserva
│   ├── admin/page.tsx         # Panel admin (protegido)
│   ├── api/
│   │   ├── rooms/route.ts     # GET habitaciones
│   │   └── bookings/route.ts  # POST reserva / GET listado (admin)
│   ├── error.tsx              # Error boundary
│   └── not-found.tsx          # 404
├── components/
│   ├── ReservationForm.tsx    # Formulario con honeypot
│   └── Logo.tsx
├── lib/
│   ├── db.ts                  # Cliente Prisma singleton
│   ├── format.ts              # Helpers ARS, noches
│   └── rate-limit.ts          # Rate limiting in-memory
└── middleware.ts              # Auth Basic para /admin
```

---

## 🔐 Seguridad implementada

- **Autenticación** en `/admin` y `GET /api/bookings`
- **Rate limiting** por IP en `POST /api/bookings`
- **Honeypot** invisible en formulario público
- **Validación estricta** con Zod en todos los inputs
- **Verificación de overlap** atómica antes de crear reserva
- **Manejo de errores** sin filtrar stack traces al cliente
- **Variables sensibles** fuera del repo (`.env` en `.gitignore`)

---

## 📋 Roadmap producción

- [ ] Migrar a PostgreSQL (Supabase / Railway)
- [ ] Integrar Mercado Pago para cobro real de seña
- [ ] Emails transaccionales con Resend
- [ ] Cancelación de reservas (huésped + admin)
- [ ] Galería de fotos reales por habitación
- [ ] Notificaciones por WhatsApp al hotel
- [ ] Exportación de reservas a CSV/Excel
- [ ] Deploy a Vercel con dominio propio

---

## 👤 Autor

**Joaquin Rao** — Estudiante de Ciencia de Datos, desarrollador web freelance.

[GitHub](https://github.com/jota1221-coder) · Martínez, Buenos Aires

---

*Proyecto desarrollado como demo comercial para Ruta Hotel (Esteban Echeverría 3040, Munro). Las imágenes son de stock hasta integrar las fotos reales del cliente.*
