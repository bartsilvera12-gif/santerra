-- ============================================================
-- Bucket de imagenes: crear y dar permisos.
--
-- IMPORTANTE: correr los pasos POR SEPARADO, no todo de una.
--
-- El SQL Editor ejecuta el script entero en una transaccion: si una
-- sentencia falla, se revierte todo lo anterior. En Supabase autoalojado
-- el schema "storage" pertenece al rol supabase_storage_admin, asi que
-- las politicas suelen fallar con:
--
--     ERROR: must be owner of table objects
--
-- y eso se lleva puesto tambien la creacion del bucket.
-- ============================================================


-- ============================================================
-- PASO 1 — Crear el bucket.  Seleccionar SOLO estas lineas y ejecutar.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do update set public = true;

-- Verificacion: tiene que devolver una fila con public = true.
select id, name, public from storage.buckets where id = 'property-images';


-- ============================================================
-- PASO 2 — Politicas.  Seleccionar SOLO desde aca y ejecutar.
--
-- Si da "must be owner of table objects", saltear este paso y hacerlo
-- desde el panel: Storage -> property-images -> Policies -> New policy.
-- Ahi hay que crear cuatro, con estas condiciones:
--
--   SELECT  (para anon y authenticated):  bucket_id = 'property-images'
--   INSERT  (authenticated):  bucket_id = 'property-images' and santerra.is_admin()
--   UPDATE  (authenticated):  idem
--   DELETE  (authenticated):  idem
-- ============================================================

drop policy if exists "imagenes lectura publica"       on storage.objects;
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

create policy "imagenes update admin"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'property-images' and santerra.is_admin())
  with check (bucket_id = 'property-images' and santerra.is_admin());

create policy "imagenes borrado admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images' and santerra.is_admin());

-- Verificacion: tienen que aparecer las cuatro.
select policyname, cmd
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
  and policyname like 'imagenes%'
order by policyname;


-- ============================================================
-- Alternativa mas simple para el PASO 1
--
-- Crear el bucket desde el panel de Supabase:
--   Storage -> New bucket
--   Name: property-images
--   Public bucket: SI
-- ============================================================
