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

function slugify(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `servico-${Date.now()}`;
}

function uniqueValue(value, usedValues) {
  const base = slugify(value);
  let candidate = base;
  let index = 2;
  while (usedValues.has(candidate)) {
    candidate = `${base}-${index}`;
    index += 1;
  }
  usedValues.add(candidate);
  return candidate;
}

function normalizePackages(packages = [], fallbackPackages = []) {
  const source = packages.length ? packages : fallbackPackages;
  const usedIds = new Set();
  const normalized = source.map((item, index) => {
    const id = uniqueValue(item?.id || item?.name || `pacote-${index + 1}`, usedIds);
    return {
      id,
      name: String(item?.name || `Pacote ${index + 1}`).trim(),
      price: Number(item?.price || 0),
      hours: Number(item?.hours || 0),
      deliveryDays: Number(item?.deliveryDays || 0),
      details: normalizeDetails(item?.details?.length ? item.details : ['Cobertura fotografica'])
    };
  });

  return normalized.length ? normalized : [{
    id: 'pacote-1',
    name: 'Pacote principal',
    price: 0,
    hours: 1,
    deliveryDays: 7,
    details: ['Cobertura fotografica']
  }];
}

function normalizeExtras(extras = [], fallbackExtras = []) {
  const source = extras.length ? extras : fallbackExtras;
  const usedIds = new Set();
  return source.map((item, index) => ({
    id: uniqueValue(item?.id || item?.name || `extra-${index + 1}`, usedIds),
    name: String(item?.name || `Extra ${index + 1}`).trim(),
    price: Number(item?.price || 0)
  }));
}

function normalizeService(service, fallback, usedSlugs) {
  const slug = fallback?.slug || uniqueValue(service?.slug || service?.name, usedSlugs);
  if (fallback?.slug) usedSlugs.add(slug);

  return {
    slug,
    eventType: String(service?.eventType || fallback?.eventType || slug.replace(/-/g, '_')).trim(),
    name: String(service?.name || fallback?.name || 'Novo servico').trim(),
    summary: String(service?.summary || fallback?.summary || 'Descricao curta do servico.').trim(),
    packages: normalizePackages(service?.packages || [], fallback?.packages || []),
    extras: normalizeExtras(service?.extras || [], fallback?.extras || [])
  };
}

function normalizeCatalogPayload(services = []) {
  const defaults = getDefaultCatalog();
  const payload = Array.isArray(services) && services.length ? services : defaults;
  const fallbackBySlug = new Map(defaults.map((item) => [item.slug, item]));
  const usedSlugs = new Set();

  return payload.map((service) => normalizeService(service, fallbackBySlug.get(service?.slug), usedSlugs));
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
