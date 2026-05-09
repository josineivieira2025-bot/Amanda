import { Photo } from '../models/Photo.js';

export function listPhotosByEvent(photographerId, eventId) {
  return Photo.find({ eventId }).sort({ createdAt: -1 });
}

export function createPhoto(photographerId, data) {
  return Photo.create({ ...data, photographerId, createdBy: photographerId, updatedBy: photographerId });
}

export function updatePhoto(photographerId, id, data) {
  return Photo.findByIdAndUpdate(id, { ...data, updatedBy: photographerId }, { new: true });
}

export function deletePhoto(photographerId, id) {
  return Photo.findByIdAndDelete(id);
}
