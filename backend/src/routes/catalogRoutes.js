import { Router } from 'express';
import { index, update } from '../controllers/catalogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.route('/').get(index).put(update);

export default router;
