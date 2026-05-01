import { Client } from '../models/Client.js';
import { Event } from '../models/Event.js';
import { User } from '../models/User.js';

const catalog = [
  {
    slug: 'casamento',
    eventType: 'casamento',
    name: 'Casamento',
    summary: 'Cobertura fotografica para cerimonia, making of e recepcao no estilo Vida em Foco.',
    packages: [
      { id: 'essencial', name: 'Essencial', price: 1800, hours: 4, deliveryDays: 20 },
      { id: 'classico', name: 'Classico', price: 3200, hours: 8, deliveryDays: 20 },
      { id: 'premium', name: 'Premium', price: 4600, hours: 12, deliveryDays: 25 }
    ],
    extras: [
      { id: 'pre-wedding', name: 'Ensaio pre wedding', price: 750 },
      { id: 'segundo-fotografo', name: 'Segundo fotografo', price: 900 },
      { id: 'album', name: 'Album premium', price: 680 }
    ]
  },
  {
    slug: 'ensaio-infantil',
    eventType: 'ensaio_infantil',
    name: 'Ensaio infantil',
    summary: 'Ensaio leve, divertido e pensado para registrar a fase da crianca com autenticidade.',
    packages: [
      { id: 'mini', name: 'Mini sessao', price: 320, hours: 1, deliveryDays: 10 },
      { id: 'essencial', name: 'Essencial', price: 490, hours: 2, deliveryDays: 12 },
      { id: 'familia', name: 'Com familia', price: 690, hours: 3, deliveryDays: 14 }
    ],
    extras: [
      { id: 'cenario', name: 'Cenario tematico', price: 180 },
      { id: 'video', name: 'Video curto', price: 220 },
      { id: 'fotos-extras', name: 'Galeria ampliada', price: 140 }
    ]
  },
  {
    slug: 'gestante',
    eventType: 'ensaio_gestante',
    name: 'Ensaio gestante',
    summary: 'Ensaio acolhedor e elegante para registrar a gestacao com direcao suave.',
    packages: [
      { id: 'estudio', name: 'Estudio', price: 420, hours: 1, deliveryDays: 10 },
      { id: 'externo', name: 'Externo', price: 620, hours: 2, deliveryDays: 12 },
      { id: 'premium', name: 'Premium', price: 980, hours: 3, deliveryDays: 15 }
    ],
    extras: [
      { id: 'maquiagem', name: 'Maquiagem social', price: 180 },
      { id: 'vestido', name: 'Vestido locado', price: 150 },
      { id: 'familia', name: 'Participacao da familia', price: 120 }
    ]
  },
  {
    slug: 'casal',
    eventType: 'ensaio_casal',
    name: 'Ensaio de casal',
    summary: 'Direcao natural para fotos romanticas, urbanas ou ao ar livre.',
    packages: [
      { id: 'city', name: 'City session', price: 350, hours: 1, deliveryDays: 8 },
      { id: 'sunset', name: 'Sunset session', price: 540, hours: 2, deliveryDays: 10 },
      { id: 'experience', name: 'Experience', price: 760, hours: 3, deliveryDays: 12 }
    ],
    extras: [
      { id: 'make', name: 'Maquiagem', price: 140 },
      { id: 'look-extra', name: 'Troca de look extra', price: 90 },
      { id: 'video', name: 'Reels curto', price: 230 }
    ]
  },
  {
    slug: 'evento-infantil',
    eventType: 'aniversario_infantil',
    name: 'Festa infantil',
    summary: 'Cobertura fotografica para aniversarios e comemoracoes com olhar espontaneo.',
    packages: [
      { id: 'start', name: 'Start', price: 850, hours: 3, deliveryDays: 15 },
      { id: 'party', name: 'Party', price: 1200, hours: 4, deliveryDays: 18 },
      { id: 'memorias', name: 'Memorias', price: 1680, hours: 6, deliveryDays: 20 }
    ],
    extras: [
      { id: 'album', name: 'Album resumido', price: 320 },
      { id: 'impressas', name: 'Fotos impressas', price: 160 },
      { id: 'video', name: 'Video de cobertura', price: 540 }
    ]
  }
];

function findCatalogItem(serviceSlug) {
  return catalog.find((item) => item.slug === serviceSlug);
}

async function findPublicPhotographer() {
  const photographer = await User.findOne().sort({ createdAt: 1 });
  if (!photographer) {
    const error = new Error('Nenhum fotografo configurado para receber simulacoes.');
    error.statusCode = 503;
    throw error;
  }

  return photographer;
}

function calculateTotal(service, packageId, extraIds = []) {
  const selectedPackage = service.packages.find((item) => item.id === packageId) || service.packages[0];
  const selectedExtras = service.extras.filter((item) => extraIds.includes(item.id));
  const extrasTotal = selectedExtras.reduce((sum, item) => sum + item.price, 0);

  return {
    selectedPackage,
    selectedExtras,
    total: selectedPackage.price + extrasTotal
  };
}

function normalizePhone(value = '') {
  return String(value).replace(/\D/g, '');
}

async function findOrCreateClient(photographerId, payload) {
  const email = String(payload.email || '').trim().toLowerCase();
  const phone = normalizePhone(payload.phone);

  let client = null;
  if (email) {
    client = await Client.findOne({ photographerId, email });
  }

  if (!client && phone) {
    client = await Client.findOne({ photographerId, phone });
  }

  if (!client) {
    client = await Client.create({
      photographerId,
      name: payload.name,
      email,
      phone
    });
  } else {
    client.name = payload.name || client.name;
    client.email = email || client.email;
    client.phone = phone || client.phone;
    await client.save();
  }

  return client;
}

function ensureRequired(payload) {
  const requiredFields = ['name', 'phone', 'eventDate', 'location', 'serviceSlug'];
  for (const field of requiredFields) {
    if (!payload[field]) {
      const error = new Error('Preencha todos os campos obrigatorios da simulacao.');
      error.statusCode = 400;
      throw error;
    }
  }
}

export function listQuoteCatalog() {
  return catalog;
}

export async function createPublicQuoteRequest(payload) {
  ensureRequired(payload);

  const service = findCatalogItem(payload.serviceSlug);
  if (!service) {
    const error = new Error('Servico nao encontrado para simulacao.');
    error.statusCode = 404;
    throw error;
  }

  const photographer = await findPublicPhotographer();
  const client = await findOrCreateClient(photographer._id, payload);
  const { selectedPackage, selectedExtras, total } = calculateTotal(service, payload.packageId, payload.extraIds || []);

  const notes = [
    'Simulacao enviada pelo site publico.',
    `Servico escolhido: ${service.name}.`,
    `Pacote: ${selectedPackage.name}.`,
    selectedExtras.length ? `Extras: ${selectedExtras.map((item) => item.name).join(', ')}.` : 'Extras: nenhum.',
    payload.contactPreference ? `Preferencia de contato: ${payload.contactPreference}.` : null,
    payload.guestCount ? `Convidados previstos: ${payload.guestCount}.` : null,
    payload.message ? `Mensagem do cliente: ${payload.message}` : null
  ]
    .filter(Boolean)
    .join('\n');

  const event = await Event.create({
    photographerId: photographer._id,
    clientId: client._id,
    type: service.eventType,
    date: new Date(payload.eventDate),
    endDate: payload.eventEndDate ? new Date(payload.eventEndDate) : undefined,
    location: payload.location,
    source: 'site',
    status: 'orcamento_pendente',
    followUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    price: total,
    notes
  });

  return {
    eventId: event._id,
    total,
    packageName: selectedPackage.name,
    extras: selectedExtras.map((item) => item.name),
    message: 'Simulacao enviada com sucesso.'
  };
}
