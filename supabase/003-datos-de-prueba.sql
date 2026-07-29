-- ============================================================
-- Datos de prueba: 8 propiedades y 4 categorias.
--
-- Correr en el SQL Editor de Supabase si las tablas quedaron vacias.
-- Es seguro repetirlo: on conflict do nothing evita duplicados.
--
-- Al final hay dos consultas de verificacion.
-- ============================================================

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

-- ---------- Verificacion ----------
-- Tienen que dar 8 y 4.

select 'propiedades' as tabla, count(*) from santerra.properties
union all
select 'categorias',  count(*) from santerra.categories;

-- Todas publicadas, que es lo que mira el sitio.
select id, title, operation, type, published from santerra.properties order by title;
