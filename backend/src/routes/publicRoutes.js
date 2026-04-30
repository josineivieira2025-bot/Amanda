import { Router } from 'express';
import { clientGallery, updateClientPhoto } from '../controllers/publicController.js';

const router = Router();

router.get('/gallery/:token', clientGallery);
router.patch('/gallery/:token/photos/:photoId', updateClientPhoto);

export default router;
