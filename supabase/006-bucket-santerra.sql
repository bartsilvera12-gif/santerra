-- ============================================================
-- Bucket propio de Santerra: santerra-medios
--
-- Por que no "property-images": esta instancia de Supabase aloja varios
-- proyectos y los buckets son un espacio de nombres compartido. Ese
-- nombre ya lo ocupa otra inmobiliaria, con su propia politica:
--
--   storage_property_images_admin_write_lilian
--     bucket_id = 'property-images' AND lilian_inmobiliaria.is_lilian_admin()
--
-- Por eso el panel decia "Failed to create bucket": ya existia.
-- ============================================================


-- ---------- 1) El bucket ----------

insert into storage.buckets (id, name, public)
values ('santerra-medios', 'santerra-medios', true)
on conflict (id) do update set public = true;


-- ---------- 2) Politicas ----------
-- Los nombres llevan el prefijo santerra_ para no chocar con las de los
-- otros proyectos que comparten storage.objects.

drop policy if exists "santerra_medios_lectura"  on storage.objects;
drop policy if exists "santerra_medios_subida"   on storage.objects;
drop policy if exists "santerra_medios_edicion"  on storage.objects;
drop policy if exists "santerra_medios_borrado"  on storage.objects;

create policy "santerra_medios_lectura"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'santerra-medios');

create policy "santerra_medios_subida"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'santerra-medios' and santerra.is_admin());

create policy "santerra_medios_edicion"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'santerra-medios' and santerra.is_admin())
  with check (bucket_id = 'santerra-medios' and santerra.is_admin());

create policy "santerra_medios_borrado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'santerra-medios' and santerra.is_admin());


-- ---------- 3) Limpieza ----------
-- Las politicas que habiamos creado sobre property-images ya no aplican
-- y solo ensucian el bucket de la otra inmobiliaria. Se quitan.

drop policy if exists "imagenes lectura publica" on storage.objects;
drop policy if exists "imagenes escritura admin" on storage.objects;
drop policy if exists "imagenes update admin"    on storage.objects;
drop policy if exists "imagenes borrado admin"   on storage.objects;


-- ---------- Verificacion ----------

select id, name, public from storage.buckets where id = 'santerra-medios';

select policyname, cmd
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
  and policyname like 'santerra_%'
order by policyname;
