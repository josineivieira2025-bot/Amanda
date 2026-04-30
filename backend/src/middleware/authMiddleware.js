import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../utils/token.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');

  if (!token) {
    res.status(401);
    throw new Error('Token nao informado.');
  }

  const payload = verifyToken(token);
  const user = await User.findById(payload.userId).select('-password');

  if (!user) {
    res.status(401);
    throw new Error('Usuario nao encontrado.');
  }

  req.user = user;
  next();
});
