import { Client } from '../models/Client.js';
import { Event } from '../models/Event.js';

export async function listClients(photographerId, search = '', tag = '') {
  const query = {};
  const filters = [];

  if (search) {
    filters.push({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ]
    });
  }

  if (tag) {
    filters.push({ tags: { $regex: tag, $options: 'i' } });
  }

  if (filters.length) {
    query.$and = filters;
  }

  return Client.find(query).sort({ createdAt: -1 });
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }
  return String(tags)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function createClient(photographerId, data) {
  const tags = normalizeTags(data.tags);
  return Client.create({ ...data, photographerId, createdBy: photographerId, updatedBy: photographerId, tags });
}

export async function updateClient(photographerId, id, data) {
  const tags = normalizeTags(data.tags);
  return Client.findByIdAndUpdate(id, { ...data, tags, updatedBy: photographerId }, { new: true });
}

export async function getClientWithHistory(photographerId, id) {
  const client = await Client.findById(id);
  const events = await Event.find({ clientId: id }).sort({ date: -1 });
  return { client, events };
}

export function deleteClient(photographerId, id) {
  return Client.findByIdAndDelete(id);
}
