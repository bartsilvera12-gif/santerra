-- ============================================================
-- Santerra Negocios Inmobiliarios — esquema de la base
-- Ejecutar una sola vez en el SQL Editor de Supabase.
--
-- IMPORTANTE: despues de correr esto hay que exponer el schema en
-- Project Settings -> API -> Data API -> Exposed schemas,
-- agregando "santerra" a la lista. Sin ese paso la API devuelve
-- "The schema must be one of the following: public".
-- ============================================================

create schema if not exists santerra;

-- ---------- Tablas ----------

create table if not exists santerra.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  image       text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists santerra.properties (
  id          text primary key,
  title       text not null,
  location    text not null,
  city        text not null,
  beds        int  not null default 0,
  baths       int  not null default 0,
  area        int  not null default 0,
  price       text not null,
  operation   text not null check (operation in ('VENTA', 'ALQUILER')),
  type        text not null check (type in ('Casa', 'Departamento', 'Terreno', 'Comercial')),
  image       text,
  gallery     text[] not null default '{}',
  description text not null default '',
  features    text[] not null default '{}',
  lat         double precision,
  lng         double precision,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists properties_type_idx      on santerra.properties (type);
create index if not exists properties_operation_idx on santerra.properties (operation);
create index if not exists properties_city_idx      on santerra.properties (city);

-- updated_at automatico
create or replace function santerra.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists properties_touch_updated_at on santerra.properties;
create trigger properties_touch_updated_at
  before update on santerra.properties
  for each row execute function santerra.touch_updated_at();

-- ---------- Permisos del schema ----------
-- Necesarios para que PostgREST pueda ver el schema. El control fino
-- lo hacen las politicas RLS de mas abajo.

grant usage on schema santerra to anon, authenticated, service_role;

grant select on all tables in schema santerra to anon;
grant all    on all tables in schema santerra to authenticated, service_role;

alter default privileges in schema santerra grant select on tables to anon;
alter default privileges in schema santerra grant all    on tables to authenticated, service_role;

-- ---------- Seguridad ----------
-- Lectura publica (el sitio la usa sin sesion), escritura solo para los
-- correos habilitados. No alcanza con estar autenticado: cualquiera
-- podria registrarse en Supabase y escribir atacando la API directo.

-- Para sumar administradores, agregar el correo a este array.
create or replace function santerra.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'email', '') = any (array[
    'admin@santerra.com'
  ]);
$$;

grant execute on function santerra.is_admin() to anon, authenticated;

alter table santerra.properties enable row level security;
alter table santerra.categories enable row level security;

drop policy if exists "properties lectura publica" on santerra.properties;
create policy "properties lectura publica"
  on santerra.properties for select
  to anon, authenticated
  using (published = true or santerra.is_admin());

drop policy if exists "properties escritura admin" on santerra.properties;
create policy "properties escritura admin"
  on santerra.properties for all
  to authenticated
  using (santerra.is_admin())
  with check (santerra.is_admin());

drop policy if exists "categories lectura publica" on santerra.categories;
create policy "categories lectura publica"
  on santerra.categories for select
  to anon, authenticated
  using (true);

drop policy if exists "categories escritura admin" on santerra.categories;
create policy "categories escritura admin"
  on santerra.categories for all
  to authenticated
  using (santerra.is_admin())
  with check (santerra.is_admin());

-- ---------- Storage de imagenes ----------
-- El storage vive siempre en el schema "storage", no se mueve.

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "imagenes lectura publica" on storage.objects;
create policy "imagenes lectura publica"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-images');

drop policy if exists "imagenes escritura admin" on storage.objects;
create policy "imagenes escritura admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images' and santerra.is_admin());

drop policy if exists "imagenes borrado admin" on storage.objects;
create policy "imagenes borrado admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images' and santerra.is_admin());

-- ---------- Datos iniciales ----------

insert into santerra.categories (slug, title, image, sort_order) values
  ('casas',        'Casas',        '/images/property-1.png', 1),
  ('departamentos','Departamentos','/images/property-2.png', 2),
  ('terrenos',     'Terrenos',     '/images/property-3.png', 3),
  ('comerciales',  'Comerciales',  '/images/property-1.png', 4)
on conflict (slug) do nothing;

insert into santerra.properties
  (id, title, location, city, beds, baths, area, price, operation, type, image, gallery, description, features, lat, lng)
values
  ('residencia-san-bernardino', 'Residencia en San Bernardino', 'San Bernardino, Cordillera', 'San Bernardino',
   4, 4, 420, 'USD 690.000', 'VENTA', 'Casa', '/images/property-1.png',
   array['/images/property-1.png','/images/property-2.png','/images/property-3.png'],
   'Residencia contemporánea con piscina, jardín amplio y vista al lago. Terminaciones premium, cocina integrada y suite principal con vestidor.',
   array['Piscina','Jardín 800 m²','Cochera x2','Parrillero','Suite principal','Domótica'], -25.2833, -57.2989),

  ('departamento-lujo-asuncion', 'Departamento de lujo en Asunción', 'Villa Morra, Asunción', 'Asunción',
   3, 3, 180, 'USD 2.400 / mes', 'ALQUILER', 'Departamento', '/images/property-2.png',
   array['/images/property-2.png','/images/property-3.png','/images/property-1.png'],
   'Departamento en piso alto con vista panorámica, terraza privada y amenities completos: piscina, gimnasio y seguridad 24/7.',
   array['Vista panorámica','Terraza','Gimnasio','Piscina','2 cocheras','Seguridad 24hs'], -25.2989, -57.5680),

  ('casa-contemporanea-luque', 'Casa contemporánea con piscina', 'Luque, Central', 'Luque',
   5, 4, 520, 'USD 520.000', 'VENTA', 'Casa', '/images/property-3.png',
   array['/images/property-3.png','/images/property-1.png','/images/property-2.png'],
   'Casa moderna en barrio cerrado, 5 dormitorios en suite, quincho, piscina climatizada y amplios espacios abiertos.',
   array['Barrio cerrado','Piscina climatizada','Quincho','Cochera x3','Estudio','Panel solar'], -25.2686, -57.4869),

  ('loft-villa-morra', 'Loft moderno en zona premium', 'Villa Morra, Asunción', 'Asunción',
   2, 2, 140, 'USD 1.600 / mes', 'ALQUILER', 'Departamento', '/images/property-1.png',
   array['/images/property-1.png','/images/property-2.png'],
   'Loft de doble altura con diseño de autor, terminaciones industriales y ubicación inmejorable a metros del corredor gastronómico.',
   array['Doble altura','Amoblado','Balcón','1 cochera','Amenities'], -25.3010, -57.5701),

  ('chalet-lago-san-bernardino', 'Chalet frente al lago', 'San Bernardino, Cordillera', 'San Bernardino',
   4, 3, 380, 'USD 480.000', 'VENTA', 'Casa', '/images/property-2.png',
   array['/images/property-2.png','/images/property-3.png'],
   'Chalet a orillas del lago Ypacaraí, muelle privado, deck de madera y vistas al atardecer desde todos los ambientes.',
   array['Muelle privado','Deck','Chimenea','Cochera x2','Jardín 1.200 m²'], -25.2760, -57.3050),

  ('terreno-encarnacion', 'Terreno costero en Encarnación', 'Costanera, Encarnación', 'Encarnación',
   0, 0, 1250, 'USD 320.000', 'VENTA', 'Terreno', '/images/property-3.png',
   array['/images/property-3.png'],
   'Terreno con excelente exposición sobre la costanera, ideal para desarrollo residencial o comercial de alta categoría.',
   array['Frente 25 m','Servicios completos','Uso mixto','Vista al río'], -27.3363, -55.8672),

  ('local-comercial-asuncion', 'Local comercial en corredor gastronómico', 'Villa Morra, Asunción', 'Asunción',
   0, 2, 320, 'USD 4.800 / mes', 'ALQUILER', 'Comercial', '/images/property-1.png',
   array['/images/property-1.png'],
   'Local en esquina, doble frente vidriado, salón amplio, depósito y sanitarios. Altísimo tránsito peatonal.',
   array['Doble frente','320 m²','Depósito','Estacionamiento','Aire acondicionado'], -25.2960, -57.5721),

  ('terreno-luque', 'Terreno en barrio cerrado', 'Luque, Central', 'Luque',
   0, 0, 850, 'USD 180.000', 'VENTA', 'Terreno', '/images/property-2.png',
   array['/images/property-2.png'],
   'Lote en barrio cerrado con seguridad 24hs, club house, canchas y áreas verdes. Listo para construir.',
   array['Barrio cerrado','Club house','Canchas','Seguridad 24hs'], -25.2701, -57.4820)
on conflict (id) do nothing;
