import express from 'express';
import {
  getApiInfo,
  getAlbums,
  getAlbumBySlug,
  getAlbumsByGenre,
  searchAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum
} from '../controllers/albumController.js';

const router = express.Router();

// Rutas
router.get('/', getApiInfo);
router.get('/albumes', getAlbums);
router.post('/albumes', createAlbum);

router.get('/album/:slug', getAlbumBySlug);
router.put('/album/:slug', updateAlbum);
router.delete('/album/:slug', deleteAlbum);

router.get('/genero/:genero', getAlbumsByGenre);
router.get('/search/:text', searchAlbums);

export default router;
