-- ============================================================
-- Datos de contacto editables desde el panel.
--
-- Una sola fila, fijada con id = 1, para no tener que manejar
-- "cual de todas" en el codigo.
--
-- Es seguro repetirlo.
-- ============================================================

create table if not exists santerra.settings (
  id          smallint primary key default 1,
  phone       text not null default '0981 401 909',
  phone_e164  text not null default '+595981401909',
  whatsapp    text not null default '595981401909',
  email       text not null default 'hola@santerra.com.py',
  address     text not null default 'Asunción, Paraguay',
  instagram   text not null default '',
  facebook    text not null default '',
  linkedin    text not null default '',
  updated_at  timestamptz not null default now(),
  constraint settings_fila_unica check (id = 1)
);

insert into santerra.settings (id) values (1)
on conflict (id) do nothing;

drop trigger if exists settings_touch_updated_at on santerra.settings;
create trigger settings_touch_updated_at
  before update on santerra.settings
  for each row execute function santerra.touch_updated_at();

-- ---------- Permisos ----------

grant select on santerra.settings to anon;
grant all    on santerra.settings to authenticated;

alter table santerra.settings enable row level security;

drop policy if exists "settings lectura publica" on santerra.settings;
create policy "settings lectura publica"
  on santerra.settings for select
  to anon, authenticated
  using (true);

drop policy if exists "settings escritura admin" on santerra.settings;
create policy "settings escritura admin"
  on santerra.settings for all
  to authenticated
  using (santerra.is_admin())
  with check (santerra.is_admin());

-- ---------- Verificacion ----------

select * from santerra.settings;
