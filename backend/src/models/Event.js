import crypto from 'crypto';
import mongoose from 'mongoose';

const eventTypes = [
  'aniversario_15',
  'aniversario_15_externo',
  'aniversario_15_estudio',
  'aniversario_adulto',
  'aniversario_infantil',
  'casamento',
  'cha_revelacao',
  'cha_de_panela',
  'corporativo',
  'smash_the_cake',
  'newborn',
  'ensaio_infantil',
  'ensaio_casal',
  'ensaio_casal_externo',
  'ensaio_casal_estudio',
  'ensaio_casamento',
  'ensaio_adulto',
  'ensaio_gestante',
  'ensaio_familia',
  'formatura_externo',
  'formatura_pacote_1',
  'formatura_premium',
  'outro'
];

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
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    type: { type: String, required: true, enum: eventTypes },
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

