import { createPhoto, deletePhoto, listPhotosByEvent, updatePhoto } from '../services/photoService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const index = asyncHandler(async (req, res) => {
  res.json(await listPhotosByEvent(req.user._id, req.query.eventId));
});

export const store = asyncHandler(async (req, res) => {
  res.status(201).json(await createPhoto(req.user._id, req.body));
});

export const update = asyncHandler(async (req, res) => {
  res.json(await updatePhoto(req.user._id, req.params.id, req.body));
});

export const destroy = asyncHandler(async (req, res) => {
  await deletePhoto(req.user._id, req.params.id);
  res.status(204).send();
});
