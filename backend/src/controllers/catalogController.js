import { getCatalogForPhotographer, updateCatalogForPhotographer } from '../services/catalogService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const index = asyncHandler(async (req, res) => {
  res.json(await getCatalogForPhotographer(req.user._id));
});

export const update = asyncHandler(async (req, res) => {
  res.json(await updateCatalogForPhotographer(req.user._id, req.body.services || []));
});
