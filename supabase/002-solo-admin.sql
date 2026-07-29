-- ============================================================
-- Restringe la escritura a los correos habilitados.
--
-- Correr esto si ya ejecutaste schema.sql antes. Si arrancas de cero,
-- schema.sql ya viene con estas politicas y no hace falta.
--
-- Antes: cualquier usuario registrado en Supabase podia escribir.
-- Ahora: solo los correos de la funcion santerra.is_admin().
-- ============================================================

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

-- ---------- Propiedades ----------

drop policy if exists "properties lectura publica"      on santerra.properties;
drop policy if exists "properties escritura autenticada" on santerra.properties;
drop policy if exists "properties escritura admin"       on santerra.properties;

-- El publico ve solo lo publicado; el admin ve todo, incluso borradores.
create policy "properties lectura publica"
  on santerra.properties for select
  to anon, authenticated
  using (published = true or santerra.is_admin());

create policy "properties escritura admin"
  on santerra.properties for all
  to authenticated
  using (santerra.is_admin())
  with check (santerra.is_admin());

-- ---------- Categorias ----------

drop policy if exists "categories lectura publica"       on santerra.categories;
drop policy if exists "categories escritura autenticada" on santerra.categories;
drop policy if exists "categories escritura admin"       on santerra.categories;

create policy "categories lectura publica"
  on santerra.categories for select
  to anon, authenticated
  using (true);

create policy "categories escritura admin"
  on santerra.categories for all
  to authenticated
  using (santerra.is_admin())
  with check (santerra.is_admin());

-- ---------- Imagenes ----------

drop policy if exists "imagenes escritura autenticada" on storage.objects;
drop policy if exists "imagenes borrado autenticado"   on storage.objects;
drop policy if exists "imagenes escritura admin"       on storage.objects;
drop policy if exists "imagenes borrado admin"         on storage.objects;

create policy "imagenes escritura admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images' and santerra.is_admin());

create policy "imagenes borrado admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images' and santerra.is_admin());

-- ---------- Para agregar otro administrador ----------
-- Editar el array de santerra.is_admin() y volver a correr solo esa
-- funcion. Las politicas no hay que tocarlas.
--
--   select coalesce(auth.jwt() ->> 'email', '') = any (array[
--     'admin@santerra.com',
--     'otro@santerra.com'
--   ]);
