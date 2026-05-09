import { Router } from 'express';
import { availability, dashboard, destroy, index, store, update } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.get('/dashboard', dashboard);
router.get('/availability', availability);
router.route('/').get(index).post(store);
router.route('/:id').put(update).delete(destroy);

export default router;
