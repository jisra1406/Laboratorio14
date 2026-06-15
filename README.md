# DiscoStore API

Este es el laboratorio "DiscoStore" que administra el catálogo de álbumes de una tienda de música.

## Requisitos Previos
- [Node.js](https://nodejs.org/) (versión recomendada: 18 o superior).

## Configuración y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   Copia el archivo `.env.example` a `.env` y ajusta el puerto o host si es necesario:
   ```bash
   cp .env.example .env
   ```

3. **Poblar la base de datos**:
   Inicializa la base de datos de SQLite con los datos obligatorios iniciales ejecutando:
   ```bash
   npm run seed
   ```

4. **Ejecutar el servidor en modo desarrollo**:
   ```bash
   npm run dev
   ```

## Endpoints Principales
- `GET /` - Información del API.
- `GET /albumes` - Lista todos los álbumes.
- `GET /album/:slug` - Obtiene un álbum específico.
- `GET /genero/:genero` - Álbumes filtrados por género.
- `GET /search/:text` - Búsqueda en títulos o artistas.
- `POST /albumes` - Crea un álbum.
- `PUT /album/:slug` - Actualiza un álbum.
- `DELETE /album/:slug` - Elimina un álbum.
- `GET /imagenes/*` - Retorna imágenes de álbumes.
