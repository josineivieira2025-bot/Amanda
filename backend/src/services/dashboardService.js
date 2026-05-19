import { Event } from '../models/Event.js';
import { Payment } from '../models/Payment.js';

const closedFinancialStatuses = ['confirmado', 'em_andamento', 'finalizado'];

export async function getDashboard(photographerId) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [eventsThisMonth, paymentsThisMonth, upcomingEvents, statusGroups] = await Promise.all([
    Event.countDocuments({ date: { $gte: start, $lt: end } }),
    Payment.find({ paidAt: { $gte: start, $lt: end } }).populate('eventId', 'status'),
    Event.find({ date: { $gte: now } })
      .populate('clientId', 'name phone email')
      .sort({ date: 1 })
      .limit(5),
    Event.aggregate([
      { $group: { _id: '$status', total: { $sum: 1 } } }
    ])
  ]);

  return {
    eventsThisMonth,
    monthlyRevenue: paymentsThisMonth
      .filter((payment) => closedFinancialStatuses.includes(payment.eventId?.status))
      .reduce((sum, payment) => sum + payment.amount, 0),
    upcomingEvents,
    statusGroups
  };
}
