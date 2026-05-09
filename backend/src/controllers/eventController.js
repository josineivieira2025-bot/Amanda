import {
  createEvent,
  deleteEvent,
  findAvailableEvents,
  listEvents,
  updateEvent
} from '../services/eventService.js';
import { getDashboard } from '../services/dashboardService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const index = asyncHandler(async (req, res) => {
  res.json(await listEvents(req.user._id, req.query));
});

export const store = asyncHandler(async (req, res) => {
  res.status(201).json(await createEvent(req.user._id, req.body));
});

export const update = asyncHandler(async (req, res) => {
  res.json(await updateEvent(req.user._id, req.params.id, req.body));
});

export const destroy = asyncHandler(async (req, res) => {
  await deleteEvent(req.user._id, req.params.id);
  res.status(204).send();
});

export const availability = asyncHandler(async (req, res) => {
  res.json(await findAvailableEvents(req.user._id, req.query.from, req.query.to));
});

export const dashboard = asyncHandler(async (req, res) => {
  res.json(await getDashboard(req.user._id));
});
