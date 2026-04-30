import {
  createClient,
  deleteClient,
  getClientWithHistory,
  listClients,
  updateClient
} from '../services/clientService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const index = asyncHandler(async (req, res) => {
  res.json(await listClients(req.user._id, req.query.search));
});

export const show = asyncHandler(async (req, res) => {
  res.json(await getClientWithHistory(req.user._id, req.params.id));
});

export const store = asyncHandler(async (req, res) => {
  res.status(201).json(await createClient(req.user._id, req.body));
});

export const update = asyncHandler(async (req, res) => {
  res.json(await updateClient(req.user._id, req.params.id, req.body));
});

export const destroy = asyncHandler(async (req, res) => {
  await deleteClient(req.user._id, req.params.id);
  res.status(204).send();
});
