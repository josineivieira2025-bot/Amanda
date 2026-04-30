import { Router } from 'express';
import { destroy, index, store, summary } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.get('/summary', summary);
router.route('/').get(index).post(store);
router.route('/:id').delete(destroy);

export default router;
