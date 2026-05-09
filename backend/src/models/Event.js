import crypto from 'crypto';
import mongoose from 'mongoose';

const eventStatuses = [
  'orcamento_pendente',
  'orcamento_enviado',
  'aguardando_resposta',
  'cliente_problema',
  'agendado',
  'confirmado',
  'em_andamento',
  'finalizado',
  'cancelado'
];

const eventSchema = new mongoose.Schema(
  {
    photographerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    type: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true, trim: true },
    source: {
      type: String,
      enum: ['instagram', 'whatsapp', 'indicacao', 'site', 'cliente_antigo', 'outro'],
      default: 'instagram'
    },
    status: {
      type: String,
      enum: eventStatuses,
      default: 'orcamento_pendente'
    },
    tag: {
      type: String,
      enum: [
        'cliente_problema',
        'cliente_critico',
        'cliente_prioridade',
        'cliente_antigo',
        'cliente_novo',
        'cliente_importante',
        'cliente_recorrente'
      ],
      default: ''
    },
    followUpAt: { type: Date },
    budgetSentAt: { type: Date },
    price: { type: Number, required: true, min: 0 },
    notes: { type: String, default: '' },
    isBlocked: { type: Boolean, default: false },
    clientAccessToken: { type: String, unique: true, index: true }
  },
  { timestamps: true }
);

eventSchema.pre('save', function createAccessToken(next) {
  if (!this.clientAccessToken) {
    this.clientAccessToken = crypto.randomBytes(24).toString('hex');
  }
  next();
});

export const Event = mongoose.model('Event', eventSchema);

