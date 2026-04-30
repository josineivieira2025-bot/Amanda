import { Client } from '../models/Client.js';
import { Event } from '../models/Event.js';

export async function listClients(photographerId, search = '') {
  const query = { photographerId };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }
  return Client.find(query).sort({ createdAt: -1 });
}

export function createClient(photographerId, data) {
  return Client.create({ ...data, photographerId });
}

export async function updateClient(photographerId, id, data) {
  return Client.findOneAndUpdate({ _id: id, photographerId }, data, { new: true });
}

export async function getClientWithHistory(photographerId, id) {
  const client = await Client.findOne({ _id: id, photographerId });
  const events = await Event.find({ clientId: id, photographerId }).sort({ date: -1 });
  return { client, events };
}

export function deleteClient(photographerId, id) {
  return Client.findOneAndDelete({ _id: id, photographerId });
}
