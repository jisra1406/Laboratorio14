import { openDb } from '../db.js';
import { albumSchema, albumUpdateSchema } from '../schema.js';

export const getApiInfo = (req, res) => {
  res.json({
    name: 'DiscoStore API',
    description: 'API para administrar el catálogo de álbumes de una tienda de música',
    version: '1.0.0'
  });
};

export const getAlbums = async (req, res) => {
  try {
    const db = await openDb();
    const albums = await db.all('SELECT * FROM albums');
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAlbumBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const db = await openDb();
    const album = await db.get('SELECT * FROM albums WHERE slug = ?', [slug]);

    if (!album) {
      return res.status(404).json({ error: 'Álbum no encontrado' });
    }

    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getAlbumsByGenre = async (req, res) => {
  try {
    const { genero } = req.params;
    const db = await openDb();
    // La búsqueda de género ignora mayúsculas/minúsculas usando LIKE
    const albums = await db.all('SELECT slug FROM albums WHERE genero LIKE ?', ['%' + genero + '%']);
    res.json(albums.map(a => a.slug)); // El requerimiento dice: "Slugs de las albumes de ese genero"
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const searchAlbums = async (req, res) => {
  try {
    const { text } = req.params;
    const db = await openDb();
    const albums = await db.all(
      'SELECT * FROM albums WHERE titulo LIKE ? OR artista LIKE ?',
      ['%' + text + '%', '%' + text + '%']
    );
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const createAlbum = async (req, res) => {
  try {
    const validation = albumSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Datos inválidos', details: validation.error.issues });
    }

    const { titulo, artista, genero, anio, sello, pistas, imagen, resumen, descripcion } = validation.data;
    
    // Generar el slug a partir del título: minúsculas, reemplazar espacios por guiones y quitar caracteres especiales
    const slug = titulo.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

    const db = await openDb();
    
    // Validar si el slug ya existe (409 Conflict)
    const existing = await db.get('SELECT slug FROM albums WHERE slug = ?', [slug]);
    if (existing) {
      return res.status(409).json({ error: 'Ya existe un álbum con este título (slug duplicado)' });
    }

    await db.run(
      'INSERT INTO albums (slug, titulo, artista, genero, anio, sello, pistas, imagen, resumen, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [slug, titulo, artista, genero, anio, sello, pistas, imagen || null, resumen, descripcion]
    );

    res.setHeader('Location', '/album/' + slug);
    res.status(201).json({ message: 'Álbum creado exitosamente', slug });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const updateAlbum = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const db = await openDb();
    const existing = await db.get('SELECT * FROM albums WHERE slug = ?', [slug]);
    if (!existing) {
      return res.status(404).json({ error: 'Álbum no encontrado para actualizar' });
    }

    const validation = albumUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Datos inválidos', details: validation.error.issues });
    }

    const updates = validation.data;
    
    // No actualizamos si el body está vacío
    if (Object.keys(updates).length === 0) {
      return res.status(200).json(existing);
    }

    // Construir la query dinámica
    const setClause = [];
    const values = [];
    for (const [key, value] of Object.entries(updates)) {
      setClause.push(key + ' = ?');
      values.push(value);
    }
    values.push(slug);

    await db.run(
      'UPDATE albums SET ' + setClause.join(', ') + ' WHERE slug = ?',
      values
    );

    res.status(200).json({ message: 'Álbum actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const db = await openDb();
    const existing = await db.get('SELECT slug FROM albums WHERE slug = ?', [slug]);
    if (!existing) {
      return res.status(404).json({ error: 'Álbum no encontrado para eliminar' });
    }

    await db.run('DELETE FROM albums WHERE slug = ?', [slug]);

    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
