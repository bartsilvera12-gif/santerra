# Panel de administración — puesta en marcha

El sitio funciona hoy con los datos de ejemplo de `lib/properties.ts`. Para que el
panel guarde de verdad hay que conectar Supabase. Son cinco pasos.

## 1. Crear el proyecto en Supabase

1. Entrar a [supabase.com](https://supabase.com) y crear una cuenta.
2. Crear un proyecto nuevo. Elegir la región más cercana (São Paulo).
3. Guardar la contraseña de la base que te pide al crearlo.

## 2. Cargar el esquema

En el panel de Supabase, ir a **SQL Editor → New query**, pegar todo el contenido de
[`schema.sql`](./schema.sql) y ejecutarlo.

Eso crea:

- El schema **`santerra`**, donde viven las tablas (no se usa `public`).
- La tabla `santerra.properties` con las 8 propiedades actuales ya cargadas.
- La tabla `santerra.categories` con las 4 categorías del inicio.
- Las políticas de seguridad: cualquiera puede **leer**, solo quien inició sesión
  puede **escribir**.
- El bucket `property-images` para las fotos (el storage siempre vive en el schema
  `storage`, ese no se mueve).

## 3. Exponer el schema en la API

Este paso es obligatorio y fácil de pasar por alto. Por defecto Supabase solo
publica el schema `public`.

Ir a **Project Settings → API → Data API** y agregar `santerra` en **Exposed
schemas**. Guardar.

> Si te lo salteás, todas las consultas fallan con
> `The schema must be one of the following: public`.

## 4. Configurar las credenciales

En Supabase, ir a **Project Settings → API** y copiar los dos valores. Después, crear
un archivo `.env.local` en la raíz del proyecto:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Reiniciar el servidor (`npm run dev`).

> `.env.local` no se sube al repositorio. En Vercel hay que cargar esas dos variables
> en **Settings → Environment Variables**.

## 5. Crear el usuario

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

## Quién puede entrar al panel

Solo los correos habilitados. Hoy es uno: `admin@santerra.com`.

Está declarado en **dos lugares, y los dos importan**:

| Dónde | Qué hace |
|---|---|
| `ADMIN_EMAILS` en `lib/supabase/config.ts` | Corta el acceso a `/admin` en el sitio |
| `santerra.is_admin()` en la base | Corta la escritura en la API |

El de la base es el que realmente protege: sin él, cualquiera que se registre en
Supabase puede escribir en las tablas atacando la API directo, sin pasar nunca por
el sitio.

**Para agregar otro administrador hay que tocar los dos.** En la base, editar el
array de `santerra.is_admin()` y volver a ejecutar esa función. En el sitio, sumar el
correo a `NEXT_PUBLIC_ADMIN_EMAILS` separando por comas:

```
NEXT_PUBLIC_ADMIN_EMAILS=admin@santerra.com,otro@santerra.com
```

> Conviene además desactivar el registro público en **Authentication → Providers →
> Email → Enable sign-ups**. Si queda abierto, cualquiera puede crearse una cuenta;
> no va a poder entrar al panel ni escribir, pero no hay motivo para permitirlo.

## Seguridad

Las políticas RLS del esquema son la defensa real: la clave `anon` es pública por
diseño y solo habilita lectura. Cualquier escritura exige una sesión iniciada.

El schema `santerra` le da `select` a `anon` y permisos completos a `authenticated`,
pero eso solo abre la puerta: lo que realmente decide qué fila se puede tocar son
las políticas RLS.

## Si cambiás el nombre del schema

Está en un solo lugar: la constante `DB_SCHEMA` en `lib/supabase/config.ts`. Hay que
cambiarlo ahí, en `schema.sql` y en **Exposed schemas**.
