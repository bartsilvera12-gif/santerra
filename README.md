# Santerra Negocios Inmobiliarios

Sitio web construido con **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Framer Motion**.

## Instalación

```bash
npm install
npm run dev
```

Abrir <http://localhost:3000>.

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run start` — arrancar el build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript sin emitir

## Estructura

- `app/` — Next.js App Router (layout + página principal + estilos globales)
- `components/` — Componentes reutilizables (Header, Hero, PropertySearch, FeaturedProperties, Categories, InstitutionalVideo, SellProperty, Process, Testimonials, Contact, Footer, WhatsAppFloat)
- `lib/animations.ts` — Variantes compartidas de Framer Motion
- `public/images/` — Assets (copiados de `uploads/`)

## Notas

- El hero usa video con autoplay/muted/loop/playsInline y un poster (`/images/hero.png`) como fallback y para el crossfade inicial.
- Header transparente sobre el hero, sólido y con blur al hacer scroll.
- Todas las secciones tienen `fade-up` al entrar al viewport y las tarjetas se animan escalonadamente (150ms de diferencia).
- Se respeta `prefers-reduced-motion` (ver `app/globals.css`).
- Paleta: `#C52A42`, `#151C23`, `#0A0E12`, `#F1F3F5` y blanco.

## Integración con Supabase

Los formularios (búsqueda y contacto) están preparados para conectarse a Supabase.
Antes de insertar cualquier registro desde el panel:

1. Obtener el `user_id` con `auth.uid()` tras el login.
2. Leer el perfil correspondiente y recuperar el `store_id`.
3. Incluir el `store_id` en todo `INSERT` (nunca insertar sin `store_id`).
4. Confiar en las políticas RLS del backend; no bypassear.
