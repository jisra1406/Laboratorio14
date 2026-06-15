import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  const db = await open({
    filename: './albums.db',
    driver: sqlite3.Database
  });

  // Crear la tabla si no existe
  await db.exec(`
    CREATE TABLE IF NOT EXISTS albums (
      slug TEXT PRIMARY KEY,
      titulo TEXT NOT NULL,
      artista TEXT NOT NULL,
      genero TEXT NOT NULL,
      anio INTEGER NOT NULL,
      sello TEXT NOT NULL,
      pistas INTEGER NOT NULL,
      imagen TEXT,
      resumen TEXT NOT NULL,
      descripcion TEXT NOT NULL
    )
  `);

  return db;
}
