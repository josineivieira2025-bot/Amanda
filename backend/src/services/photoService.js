import { Photo } from '../models/Photo.js';

export function listPhotosByEvent(photographerId, eventId) {
  return Photo.find({ photographerId, eventId }).sort({ createdAt: -1 });
}

export function createPhoto(photographerId, data) {
  return Photo.create({ ...data, photographerId });
}

export function updatePhoto(photographerId, id, data) {
  return Photo.findOneAndUpdate({ _id: id, photographerId }, data, { new: true });
}

export function deletePhoto(photographerId, id) {
  return Photo.findOneAndDelete({ _id: id, photographerId });
}
