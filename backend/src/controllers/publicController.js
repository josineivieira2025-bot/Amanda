import { Event } from '../models/Event.js';
import { Photo } from '../models/Photo.js';
import { createPublicQuoteRequest, listQuoteCatalog } from '../services/publicSiteService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyToken } from '../utils/token.js';

export const quoteCatalog = asyncHandler(async (req, res) => {
  res.json(listQuoteCatalog());
});

export const createQuoteRequest = asyncHandler(async (req, res) => {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');

  let preferredPhotographerId;
  if (token) {
    try {
      preferredPhotographerId = verifyToken(token)?.userId;
    } catch {
      preferredPhotographerId = undefined;
    }
  }

  res.status(201).json(await createPublicQuoteRequest(req.body, { preferredPhotographerId }));
});

export const clientGallery = asyncHandler(async (req, res) => {
  const event = await Event.findOne({ clientAccessToken: req.params.token }).populate('clientId', 'name email');
  if (!event) {
    res.status(404);
    throw new Error('Galeria nao encontrada.');
  }

  const photos = await Photo.find({ eventId: event._id }).sort({ createdAt: -1 });
  res.json({ event, photos });
});

export const updateClientPhoto = asyncHandler(async (req, res) => {
  const event = await Event.findOne({ clientAccessToken: req.params.token });
  if (!event) {
    res.status(404);
    throw new Error('Galeria nao encontrada.');
  }

  const photo = await Photo.findOneAndUpdate(
    { _id: req.params.photoId, eventId: event._id },
    { isFavorite: req.body.isFavorite },
    { new: true }
  );

  res.json(photo);
});
