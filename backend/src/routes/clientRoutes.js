import { Router } from 'express';
import { destroy, index, show, store, update } from '../controllers/clientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.route('/').get(index).post(store);
router.route('/:id').get(show).put(update).delete(destroy);

export default router;
