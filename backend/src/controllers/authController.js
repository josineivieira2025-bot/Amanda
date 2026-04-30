import { loginUser, registerUser, updateUserPassword, updateUserProfile } from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body.email, req.body.password);
  res.json(result);
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateUserProfile(req.user._id, req.body);
  res.json({ user });
});

export const changePassword = asyncHandler(async (req, res) => {
  res.json(await updateUserPassword(req.user._id, req.body.currentPassword, req.body.newPassword));
});
