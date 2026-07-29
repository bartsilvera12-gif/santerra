# Panel de administración — puesta en marcha

El sitio funciona hoy con los datos de ejemplo de `lib/properties.ts`. Para que el
panel guarde de verdad hay que conectar Supabase. Son cuatro pasos.

## 1. Crear el proyecto en Supabase

1. Entrar a [supabase.com](https://supabase.com) y crear una cuenta.
2. Crear un proyecto nuevo. Elegir la región más cercana (São Paulo).
3. Guardar la contraseña de la base que te pide al crearlo.

## 2. Cargar el esquema

En el panel de Supabase, ir a **SQL Editor → New query**, pegar todo el contenido de
[`schema.sql`](./schema.sql) y ejecutarlo.

Eso crea:

- La tabla `properties` con las 8 propiedades actuales ya cargadas.
- La tabla `categories` con las 4 categorías del inicio.
- Las políticas de seguridad: cualquiera puede **leer**, solo quien inició sesión
  puede **escribir**.
- El bucket `property-images` para las fotos.

## 3. Configurar las credenciales

En Supabase, ir a **Project Settings → API** y copiar los dos valores. Después, crear
un archivo `.env.local` en la raíz del proyecto:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Reiniciar el servidor (`npm run dev`).

> `.env.local` no se sube al repositorio. En Vercel hay que cargar esas dos variables
> en **Settings → Environment Variables**.

## 4. Crear el usuario

En Supabase, ir a **Authentication → Users → Add user**, poner el correo y la
contraseña con la que vas a entrar, y marcar **Auto Confirm User**.

Listo: entrás en `/admin/login`.

---

## Cómo está armado

| Ruta | Qué hace |
|---|---|
| `/admin/login` | Ingreso con correo y contraseña |
| `/admin` | Resumen con los totales |
| `/admin/propiedades` | Listado con buscador y filtro por operación |
| `/admin/propiedades/nueva` | Alta de propiedad |
| `/admin/propiedades/[id]` | Edición y borrado |
| `/admin/categorias` | Categorías del inicio |

Todo `/admin` está protegido por `middleware.ts`: sin sesión redirige al login.

Las páginas públicas se revalidan cada 60 segundos, así que un cambio hecho en el
panel aparece en el sitio dentro de ese minuto.

## Seguridad

Las políticas RLS del esquema son la defensa real: la clave `anon` es pública por
diseño y solo habilita lectura. Cualquier escritura exige una sesión iniciada.
