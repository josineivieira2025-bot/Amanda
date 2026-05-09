import { Router } from 'express';
import { destroy, index, store } from '../controllers/userController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, adminOnly);
router.route('/').get(index).post(store);
router.route('/:id').delete(destroy);

export default router;
