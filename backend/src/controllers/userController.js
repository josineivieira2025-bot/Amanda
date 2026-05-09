import { createUser, deleteUser, listUsers } from '../services/userService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const index = asyncHandler(async (req, res) => {
  res.json(await listUsers());
});

export const store = asyncHandler(async (req, res) => {
  res.status(201).json(await createUser(req.body));
});

export const destroy = asyncHandler(async (req, res) => {
  await deleteUser(req.params.id);
  res.status(204).send();
});
