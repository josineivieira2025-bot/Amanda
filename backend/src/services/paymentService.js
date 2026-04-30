import { Event } from '../models/Event.js';
import { Payment } from '../models/Payment.js';

export async function listPayments(photographerId, filters = {}) {
  const query = { photographerId };
  if (filters.eventId) query.eventId = filters.eventId;
  return Payment.find(query).populate('eventId', 'type date price').sort({ paidAt: -1 });
}

export function createPayment(photographerId, data) {
  return Payment.create({ ...data, photographerId });
}

export function deletePayment(photographerId, id) {
  return Payment.findOneAndDelete({ _id: id, photographerId });
}

export async function getFinancialSummary(photographerId, month, year) {
  const start = new Date(Number(year), Number(month) - 1, 1);
  const end = new Date(Number(year), Number(month), 1);

  const [events, payments] = await Promise.all([
    Event.find({ photographerId, date: { $gte: start, $lt: end } }),
    Payment.find({ photographerId, paidAt: { $gte: start, $lt: end } })
  ]);

  const total = events.reduce((sum, event) => sum + event.price, 0);
  const paid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return {
    month: Number(month),
    year: Number(year),
    total,
    paid,
    pending: Math.max(total - paid, 0),
    payments
  };
}
