import { Event } from '../models/Event.js';

function normalizeEventPayload(data) {
  return {
    ...data,
    endDate: data.endDate || undefined,
    followUpAt: data.followUpAt || undefined,
    budgetSentAt: data.budgetSentAt || undefined
  };
}

export async function listEvents(photographerId, filters = {}) {
  const query = { photographerId };
  if (filters.status) query.status = filters.status;
  if (filters.from || filters.to) {
    query.date = {};
    if (filters.from) query.date.$gte = new Date(filters.from);
    if (filters.to) query.date.$lte = new Date(filters.to);
  }

  return Event.find(query).populate('clientId', 'name phone email').sort({ date: 1 });
}

export function createEvent(photographerId, data) {
  return Event.create({ ...normalizeEventPayload(data), photographerId });
}

export function updateEvent(photographerId, id, data) {
  return Event.findOneAndUpdate({ _id: id, photographerId }, normalizeEventPayload(data), { new: true }).populate('clientId', 'name phone email');
}

export function deleteEvent(photographerId, id) {
  return Event.findOneAndDelete({ _id: id, photographerId });
}

export function findAvailableEvents(photographerId, from, to) {
  return Event.find({
    photographerId,
    date: { $gte: new Date(from), $lte: new Date(to) }
  }).select('date endDate status isBlocked type');
}
