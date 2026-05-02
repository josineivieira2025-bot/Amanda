import { PublicCatalog } from '../models/PublicCatalog.js';
import { getDefaultCatalog } from './publicSiteService.js';

function cloneCatalog(catalog) {
  return JSON.parse(JSON.stringify(catalog));
}

function normalizeDetails(details = []) {
  return details
    .map((item) => String(item || '').trim())
    .filter(Boolean);
}

function normalizeService(service, fallback) {
  return {
    slug: fallback.slug,
    eventType: fallback.eventType,
    name: String(service?.name || fallback.name).trim(),
    summary: String(service?.summary || fallback.summary).trim(),
    packages: fallback.packages.map((fallbackPackage) => {
      const current = (service?.packages || []).find((item) => item.id === fallbackPackage.id) || fallbackPackage;
      return {
        id: fallbackPackage.id,
        name: String(current.name || fallbackPackage.name).trim(),
        price: Number(current.price || 0),
        hours: Number(current.hours || 0),
        deliveryDays: Number(current.deliveryDays || 0),
        details: normalizeDetails(current.details?.length ? current.details : fallbackPackage.details)
      };
    }),
    extras: fallback.extras.map((fallbackExtra) => {
      const current = (service?.extras || []).find((item) => item.id === fallbackExtra.id) || fallbackExtra;
      return {
        id: fallbackExtra.id,
        name: String(current.name || fallbackExtra.name).trim(),
        price: Number(current.price || 0)
      };
    })
  };
}

function normalizeCatalogPayload(services = []) {
  const defaults = getDefaultCatalog();
  return defaults.map((fallbackService) => {
    const current = services.find((item) => item.slug === fallbackService.slug);
    return normalizeService(current, fallbackService);
  });
}

export async function getCatalogForPhotographer(photographerId) {
  const current = await PublicCatalog.findOne({ photographerId }).lean();
  return current?.services?.length ? current.services : cloneCatalog(getDefaultCatalog());
}

export async function updateCatalogForPhotographer(photographerId, services) {
  const normalized = normalizeCatalogPayload(services);
  const catalog = await PublicCatalog.findOneAndUpdate(
    { photographerId },
    { services: normalized },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  return catalog.services;
}
