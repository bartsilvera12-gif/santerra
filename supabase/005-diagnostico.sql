-- ============================================================
-- Diagnostico del bucket de imagenes.
--
-- Correr TODO junto y pasarme el resultado de las 4 consultas.
-- Son solo lecturas, no modifican nada.
-- ============================================================

-- 1) A que base y con que usuario esta conectado el editor.
--    Sirve para descartar que el SQL vaya a otro proyecto.
select
  current_database() as base,
  current_user       as usuario,
  session_user       as usuario_sesion;

-- 2) Que buckets hay realmente en la tabla.
--    Si aca aparece property-images pero la API dice "Bucket not found",
--    el problema es que el servicio de storage no ve estos cambios.
select id, name, public, created_at
from storage.buckets
order by created_at;

-- 3) Columnas obligatorias de storage.buckets.
--    Si hay alguna NOT NULL sin valor por defecto que no estemos
--    completando, el insert falla.
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'storage' and table_name = 'buckets'
order by ordinal_position;

-- 4) Quien es el dueño de las tablas de storage.
--    Si no es el usuario de la consulta 1, las politicas van a fallar
--    con "must be owner of table objects".
select tablename, tableowner
from pg_tables
where schemaname = 'storage';


-- ============================================================
-- Si la consulta 2 NO muestra property-images, probar el insert
-- solo, y mirar si tira algun error:
-- ============================================================

-- insert into storage.buckets (id, name, public)
-- values ('property-images', 'property-images', true);
