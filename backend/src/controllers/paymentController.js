import { createPayment, deletePayment, getFinancialSummary, listPayments } from '../services/paymentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const index = asyncHandler(async (req, res) => {
  res.json(await listPayments(req.user._id, req.query));
});

export const store = asyncHandler(async (req, res) => {
  res.status(201).json(await createPayment(req.user._id, req.body));
});

export const destroy = asyncHandler(async (req, res) => {
  await deletePayment(req.user._id, req.params.id);
  res.status(204).send();
});

export const summary = asyncHandler(async (req, res) => {
  const now = new Date();
  res.json(
    await getFinancialSummary(
      req.user._id,
      req.query.month || now.getMonth() + 1,
      req.query.year || now.getFullYear()
    )
  );
});
