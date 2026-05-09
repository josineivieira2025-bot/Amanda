import { Router } from 'express';
import { changePassword, login, me, register, updateProfile } from '../controllers/authController.js';
import { adminOnly, optionalProtect, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', optionalProtect, adminOnly, register);
router.post('/login', login);
router.get('/me', protect, me);
router.put('/me', protect, updateProfile);
router.put('/password', protect, changePassword);

export default router;
