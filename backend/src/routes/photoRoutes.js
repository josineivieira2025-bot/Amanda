import { Router } from 'express';
import { destroy, index, store, update } from '../controllers/photoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.route('/').get(index).post(store);
router.route('/:id').put(update).delete(destroy);

export default router;
