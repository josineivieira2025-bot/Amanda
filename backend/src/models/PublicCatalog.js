import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    hours: { type: Number, required: true, min: 0 },
    deliveryDays: { type: Number, required: true, min: 0 },
    details: [{ type: String, trim: true }]
  },
  { _id: false }
);

const extraSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const catalogServiceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true },
    eventType: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    packages: [packageSchema],
    extras: [extraSchema]
  },
  { _id: false }
);

const publicCatalogSchema = new mongoose.Schema(
  {
    photographerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    services: [catalogServiceSchema]
  },
  { timestamps: true }
);

export const PublicCatalog = mongoose.model('PublicCatalog', publicCatalogSchema);
