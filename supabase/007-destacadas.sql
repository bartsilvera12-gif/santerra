-- ============================================================
-- Marca de propiedad destacada.
--
-- Alimenta la seccion "Propiedades Destacadas" del inicio.
-- Es seguro repetirlo.
-- ============================================================

alter table santerra.properties
  add column if not exists featured boolean not null default false;

create index if not exists properties_featured_idx
  on santerra.properties (featured)
  where featured;

-- Se marcan las tres primeras para que la seccion no arranque vacia.
update santerra.properties
set featured = true
where id in (
  'residencia-san-bernardino',
  'departamento-lujo-asuncion',
  'casa-contemporanea-luque'
);

-- ---------- Verificacion ----------

select id, title, featured
from santerra.properties
order by featured desc, title;
