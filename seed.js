import fs from 'fs/promises';
import { openDb } from './db.js';

async function seed() {
  try {
    console.log('Iniciando carga de datos obligatoria en SQLite...');
    
    // Leemos los datos del JSON
    const data = await fs.readFile('./data/albums.json', 'utf8');
    const albums = JSON.parse(data);
    
    // Abrimos conexión a la base de datos
    const db = await openDb();
    
    // Limpiamos la tabla para garantizar que sea una carga limpia sin conflictos
    await db.exec('DELETE FROM albums');
    
    // Insertamos los álbumes
    for (const album of albums) {
      await db.run(
        `INSERT INTO albums (slug, titulo, artista, genero, anio, sello, pistas, imagen, resumen, descripcion)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          album.slug, album.titulo, album.artista, album.genero,
          album.anio, album.sello, album.pistas, album.imagen,
          album.resumen, album.descripcion
        ]
      );
    }
    
    console.log("¡Base de datos poblada exitosamente con " + albums.length + " álbumes!");
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  }
}

seed();
