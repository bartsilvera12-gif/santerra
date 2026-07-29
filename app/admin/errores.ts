/**
 * Traduce los errores de subida de Supabase Storage, que llegan en ingles y
 * sin pistas de que hacer.
 *
 * "Failed to fetch" es el mas confuso: no es un rechazo del servidor sino que
 * la peticion nunca llego a completarse, casi siempre porque el bucket todavia
 * no existe en la instancia.
 */
export function explicarErrorDeSubida(mensaje: string): string {
  const m = mensaje.toLowerCase();

  if (m.includes("failed to fetch") || m.includes("networkerror")) {
    return 'No se pudo contactar al almacenamiento. Suele ser porque falta crear el bucket "property-images": corré supabase/004-bucket-imagenes.sql.';
  }
  if (m.includes("bucket not found")) {
    return 'El bucket "property-images" no existe. Corré supabase/004-bucket-imagenes.sql.';
  }
  if (m.includes("row-level security") || m.includes("unauthorized") || m.includes("403")) {
    return "Tu usuario no tiene permiso para subir. Revisá que el correo esté en santerra.is_admin().";
  }
  if (m.includes("payload too large") || m.includes("413")) {
    return "La imagen pesa demasiado. Probá con una más liviana.";
  }
  if (m.includes("already exists")) {
    return "Ya existe un archivo con ese nombre. Volvé a intentar.";
  }
  return mensaje;
}
