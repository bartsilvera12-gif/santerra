-- ============================================================
-- Crea el bucket de imagenes y sus permisos.
--
-- Correr en el SQL Editor de Supabase si al subir una foto aparece
-- "Failed to fetch" o "Bucket not found".
--
-- Es seguro repetirlo.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do update set public = true;

-- ---------- Permisos ----------
-- Lectura para cualquiera (las fotos se ven en el sitio publico) y
-- escritura solo para los correos habilitados en santerra.is_admin().

drop policy if exists "imagenes lectura publica"     on storage.objects;
drop policy if exists "imagenes escritura autenticada" on storage.objects;
drop policy if exists "imagenes borrado autenticado"   on storage.objects;
drop policy if exists "imagenes escritura admin"       on storage.objects;
drop policy if exists "imagenes borrado admin"         on storage.objects;
drop policy if exists "imagenes update admin"          on storage.objects;

create policy "imagenes lectura publica"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-images');

create policy "imagenes escritura admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images' and santerra.is_admin());

-- Necesaria para que el cliente pueda reintentar una subida (upsert).
create policy "imagenes update admin"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'property-images' and santerra.is_admin())
  with check (bucket_id = 'property-images' and santerra.is_admin());

create policy "imagenes borrado admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images' and santerra.is_admin());

-- ---------- Verificacion ----------
-- Tiene que aparecer property-images con public = true.

select id, name, public from storage.buckets where id = 'property-images';

-- Y las cuatro politicas.
select policyname, cmd
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
  and policyname like 'imagenes%'
order by policyname;
