import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    photographerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    email: { type: String, lowercase: true, trim: true, default: '' },
    tags: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const Client = mongoose.model('Client', clientSchema);
