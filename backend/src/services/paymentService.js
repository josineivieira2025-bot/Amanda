import { Event } from '../models/Event.js';
import { Payment } from '../models/Payment.js';

const closedFinancialStatuses = ['confirmado', 'em_andamento', 'finalizado'];

export async function listPayments(photographerId, filters = {}) {
  const query = { photographerId };
  if (filters.eventId) query.eventId = filters.eventId;
  if (filters.month && filters.year) {
    query.paidAt = {
      $gte: new Date(Number(filters.year), Number(filters.month) - 1, 1),
      $lt: new Date(Number(filters.year), Number(filters.month), 1)
    };
  }

  const payments = await Payment.find(query)
    .populate({
      path: 'eventId',
      select: 'type date price status clientId',
      populate: { path: 'clientId', select: 'name' }
    })
    .sort({ paidAt: -1 });

  return payments.filter((payment) => closedFinancialStatuses.includes(payment.eventId?.status));
}

export async function createPayment(photographerId, data) {
  const event = await Event.findOne({ _id: data.eventId, photographerId });
  if (!event) {
    const error = new Error('Evento nao encontrado.');
    error.statusCode = 404;
    throw error;
  }

  if (!closedFinancialStatuses.includes(event.status)) {
    const error = new Error('Pagamentos so podem ser registrados em eventos fechados.');
    error.statusCode = 400;
    throw error;
  }

  return Payment.create({ ...data, photographerId, createdBy: photographerId, updatedBy: photographerId });
}

export function deletePayment(photographerId, id) {
  return Payment.findOneAndDelete({ _id: id, photographerId });
}

export async function getFinancialSummary(photographerId, month, year) {
  const start = new Date(Number(year), Number(month) - 1, 1);
  const end = new Date(Number(year), Number(month), 1);

  const events = await Event.find({
    photographerId,
    status: { $in: closedFinancialStatuses },
    date: { $gte: start, $lt: end }
  }).populate('clientId', 'name');

  const eventIds = events.map((event) => event._id);
  const [eventPayments, paymentsThisMonth] = await Promise.all([
    Payment.find({ photographerId, eventId: { $in: eventIds } }),
    Payment.find({ photographerId, paidAt: { $gte: start, $lt: end } }).populate({
      path: 'eventId',
      select: 'status'
    })
  ]);

  const total = events.reduce((sum, event) => sum + event.price, 0);
  const paid = eventPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const receivedThisMonth = paymentsThisMonth
    .filter((payment) => closedFinancialStatuses.includes(payment.eventId?.status))
    .reduce((sum, payment) => sum + payment.amount, 0);

  return {
    month: Number(month),
    year: Number(year),
    total,
    paid,
    receivedThisMonth,
    pending: Math.max(total - paid, 0),
    events,
    payments: eventPayments
  };
}
