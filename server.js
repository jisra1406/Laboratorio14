import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import albumRoutes from './routes/albumRoutes.js';

// Cargar variables de entorno
dotenv.config();

// Definir __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PUERTO || 3000;
const HOST = process.env.HOST || 'localhost';

// Middlewares
app.use(cors());
app.use(express.json());

// Servir la carpeta pública para las imágenes
app.use('/imagenes', express.static(path.join(__dirname, 'public/imagenes')));

// Rutas de la API
app.use('/', albumRoutes);

// Manejador genérico para 404 en rutas no definidas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, HOST, () => {
  console.log("Servidor corriendo en http://" + HOST + ":" + PORT);
});
