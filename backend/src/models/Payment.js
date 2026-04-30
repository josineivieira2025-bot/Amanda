import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    photographerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    paidAt: { type: Date, default: Date.now },
    method: { type: String, required: true, enum: ['pix', 'cartao', 'dinheiro', 'boleto', 'transferencia'] },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
