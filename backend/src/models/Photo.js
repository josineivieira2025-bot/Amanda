import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema(
  {
    photographerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    url: { type: String, required: true },
    title: { type: String, default: '' },
    isFavorite: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Photo = mongoose.model('Photo', photoSchema);
