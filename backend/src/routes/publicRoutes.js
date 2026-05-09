import { Router } from 'express';
import {
  clientGallery,
  createQuoteRequest,
  quoteCatalog,
  updateClientPhoto
} from '../controllers/publicController.js';

const router = Router();

router.get('/quote-catalog', quoteCatalog);
router.post('/quote-request', createQuoteRequest);
router.get('/gallery/:token', clientGallery);
router.patch('/gallery/:token/photos/:photoId', updateClientPhoto);

export default router;
