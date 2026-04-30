import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    photographerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, lowercase: true, trim: true, default: '' }
  },
  { timestamps: true }
);

export const Client = mongoose.model('Client', clientSchema);
