import { z } from 'zod';

export const albumSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  artista: z.string().min(1, "El artista es requerido"),
  genero: z.string().min(1, "El género es requerido"),
  anio: z.number().int().min(1900, "El año no es válido"),
  sello: z.string().min(1, "El sello discográfico es requerido"),
  pistas: z.number().int().min(1, "Debe tener al menos 1 pista"),
  imagen: z.string().optional(),
  resumen: z.string().min(1, "El resumen es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida")
});

export const albumUpdateSchema = albumSchema.partial();
