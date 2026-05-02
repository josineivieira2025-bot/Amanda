import { Client } from '../models/Client.js';
import { Event } from '../models/Event.js';
import { PublicCatalog } from '../models/PublicCatalog.js';
import { User } from '../models/User.js';

const catalog = [
  {
    slug: 'casamento',
    eventType: 'casamento',
    name: 'Casamento',
    summary: 'Cobertura para casamento civil e recepcao com registro dos momentos mais importantes do dia.',
    packages: [
      {
        id: 'civil-recepcao',
        name: 'Civil + recepcao',
        price: 700,
        hours: 2,
        deliveryDays: 20,
        details: ['Cartorio + recepcao', 'Fotos ilimitadas', 'Entrega em alta resolucao', 'Link para download']
      },
      {
        id: 'estendido',
        name: 'Cobertura estendida',
        price: 1200,
        hours: 4,
        deliveryDays: 20,
        details: ['Mais tempo de cobertura', 'Momentos-chave do dia', 'Entrega em alta resolucao', 'Link para download']
      }
    ],
    extras: [
      { id: 'hora-extra', name: 'Hora extra de cobertura', price: 280 },
      { id: 'album', name: 'Album premium', price: 680 },
      { id: 'entrega-prioritaria', name: 'Entrega prioritaria', price: 250 }
    ]
  },
  {
    slug: 'ensaio-infantil',
    eventType: 'ensaio_infantil',
    name: 'Ensaio infantil',
    summary: 'Ensaio infantil delicado e atemporal com foco na essencia da crianca e da familia.',
    packages: [
      {
        id: 'ensaio-base',
        name: 'Ensaio infantil',
        price: 279,
        hours: 1,
        deliveryDays: 10,
        details: ['25 fotos', 'Fotos com a familia', 'Estetica leve e atemporal']
      },
      {
        id: 'ensaio-parcelado',
        name: 'Ensaio infantil parcelado',
        price: 379,
        hours: 1,
        deliveryDays: 10,
        details: ['25 fotos', 'Fotos com a familia', 'Opcao parcelada']
      }
    ],
    extras: [
      { id: 'familia', name: 'Fotos com a familia', price: 120 },
      { id: 'video', name: 'Video curto', price: 220 },
      { id: 'fotos-extras', name: 'Fotos extras', price: 140 }
    ]
  },
  {
    slug: 'gestante',
    eventType: 'ensaio_gestante',
    name: 'Ensaio gestante',
    summary: 'Pacotes de ensaio gestante com opcoes de estudio, externo, vestuario e maquiagem.',
    packages: [
      {
        id: 'premium',
        name: 'Premium',
        price: 1530,
        hours: 3,
        deliveryDays: 15,
        details: ['Ensaio externo + estudio', '45 fotos', 'Vestuario incluso', 'Maquiagem inclusa']
      },
      {
        id: 'middle',
        name: 'Middle',
        price: 679,
        hours: 2,
        deliveryDays: 12,
        details: ['Ensaio externo', '30 fotos', '3 vestuarios', 'Maquiagem social']
      },
      {
        id: 'essential',
        name: 'Essential',
        price: 590,
        hours: 1,
        deliveryDays: 12,
        details: ['Ensaio em estudio', '15 fotos', '2 vestuarios', 'Maquiagem social']
      },
      {
        id: 'minimalist',
        name: 'Minimalist',
        price: 469,
        hours: 1,
        deliveryDays: 10,
        details: ['Ensaio em estudio', '10 fotos', '1 vestuario', 'Maquiagem social']
      }
    ],
    extras: [
      { id: 'maquiagem-extra', name: 'Maquiagem extra', price: 180 },
      { id: 'look-extra', name: 'Look extra', price: 150 },
      { id: 'familia', name: 'Participacao da familia', price: 120 }
    ]
  },
  {
    slug: 'casal',
    eventType: 'ensaio_casal',
    name: 'Ensaio de casal',
    summary: 'Ensaio de casal com opcoes de estudio ou externo e direcao leve para fotos naturais.',
    packages: [
      {
        id: 'externo',
        name: 'Externo',
        price: 300,
        hours: 1,
        deliveryDays: 8,
        details: ['Ambiente externo', '25 fotos tratadas', 'Clima natural e leve']
      },
      {
        id: 'estudio',
        name: 'Estudio',
        price: 230,
        hours: 1,
        deliveryDays: 8,
        details: ['Em estudio', '15 fotos tratadas', 'Clima intimista']
      }
    ],
    extras: [
      { id: 'maquiagem', name: 'Maquiagem', price: 120 },
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
      {
        id: 'start',
        name: 'Start',
        price: 850,
        hours: 3,
        deliveryDays: 15,
        details: ['3 horas de cobertura', 'Decoracao, convidados e parabens', 'Entrega digital']
      },
      {
        id: 'party',
        name: 'Party',
        price: 1200,
        hours: 4,
        deliveryDays: 18,
        details: ['4 horas de cobertura', 'Mais retratos e detalhes', 'Entrega digital']
      },
      {
        id: 'memorias',
        name: 'Memorias',
        price: 1680,
        hours: 6,
        deliveryDays: 20,
        details: ['6 horas de cobertura', 'Registro mais completo da festa', 'Entrega digital']
      }
    ],
    extras: [
      { id: 'album', name: 'Album resumido', price: 320 },
      { id: 'impressas', name: 'Fotos impressas', price: 160 },
      { id: 'video', name: 'Video de cobertura', price: 540 }
    ]
  },
  {
    slug: 'aniversario-15',
    eventType: 'aniversario_15',
    name: 'Aniversario de 15 anos',
    summary: 'Ensaio de 15 anos com opcoes de estudio ou externo para criar imagens marcantes.',
    packages: [
      {
        id: 'externo',
        name: 'Externo',
        price: 300,
        hours: 1,
        deliveryDays: 10,
        details: ['Ambiente externo', '25 fotos tratadas', 'Visual leve e marcante']
      },
      {
        id: 'externo-parcelado',
        name: 'Externo parcelado',
        price: 399,
        hours: 1,
        deliveryDays: 10,
        details: ['Ambiente externo', '25 fotos tratadas', 'Opcao parcelada']
      },
      {
        id: 'estudio',
        name: 'Estudio',
        price: 230,
        hours: 1,
        deliveryDays: 10,
        details: ['Em estudio', '15 fotos tratadas', 'Clima elegante']
      },
      {
        id: 'estudio-parcelado',
        name: 'Estudio parcelado',
        price: 330,
        hours: 1,
        deliveryDays: 10,
        details: ['Em estudio', '15 fotos tratadas', 'Opcao parcelada']
      }
    ],
    extras: [
      { id: 'make', name: 'Maquiagem profissional', price: 180 },
      { id: 'reels', name: 'Reels curto', price: 240 },
      { id: 'album', name: 'Album comemorativo', price: 420 }
    ]
  },
  {
    slug: 'aniversario-adulto',
    eventType: 'aniversario_adulto',
    name: 'Aniversario adulto',
    summary: 'Cobertura fotografica para aniversarios adultos, encontros e comemoracoes especiais.',
    packages: [
      {
        id: 'intimo',
        name: 'Intimo',
        price: 680,
        hours: 3,
        deliveryDays: 14,
        details: ['3 horas de cobertura', 'Clima mais reservado', 'Retratos e detalhes']
      },
      {
        id: 'social',
        name: 'Social',
        price: 980,
        hours: 4,
        deliveryDays: 16,
        details: ['4 horas de cobertura', 'Mais registros de convidados', 'Entrega digital']
      },
      {
        id: 'completo',
        name: 'Completo',
        price: 1480,
        hours: 6,
        deliveryDays: 20,
        details: ['6 horas de cobertura', 'Evento mais completo', 'Entrega digital']
      }
    ],
    extras: [
      { id: 'flash', name: 'Iluminacao extra', price: 170 },
      { id: 'video', name: 'Video de melhores momentos', price: 460 },
      { id: 'cabine', name: 'Mini cabine de retratos', price: 390 }
    ]
  },
  {
    slug: 'cha-revelacao',
    eventType: 'cha_revelacao',
    name: 'Cha revelacao',
    summary: 'Cobertura delicada em estudio para registrar a revelacao com emocao e carinho.',
    packages: [
      {
        id: 'cha-estudio',
        name: 'Cha revelacao em estudio',
        price: 450,
        hours: 2,
        deliveryDays: 10,
        details: ['20 fotos tratadas', 'Video de ate 1min30', 'Direcionamento de poses', 'Entrega digital']
      }
    ],
    extras: [
      { id: 'video', name: 'Video da revelacao', price: 380 },
      { id: 'familia', name: 'Retratos de familia', price: 140 },
      { id: 'album', name: 'Album pequeno', price: 260 }
    ]
  },
  {
    slug: 'cha-de-panela',
    eventType: 'cha_de_panela',
    name: 'Cha de panela',
    summary: 'Registro leve e divertido para cha de panela, com foco nos detalhes e nas convidadas.',
    packages: [
      {
        id: 'cha-panela',
        name: 'Cha de panela',
        price: 450,
        hours: 2,
        deliveryDays: 10,
        details: ['Cobertura leve e divertida', 'Detalhes e convidadas', 'Entrega digital']
      }
    ],
    extras: [
      { id: 'video', name: 'Video curto', price: 320 },
      { id: 'familia', name: 'Retratos especiais', price: 120 },
      { id: 'album', name: 'Album pequeno', price: 260 }
    ]
  },
  {
    slug: 'newborn',
    eventType: 'newborn',
    name: 'Newborn',
    summary: 'Ensaio newborn com pacotes reais do atendimento, do Minimalist ao Premium.',
    packages: [
      {
        id: 'minimalist',
        name: 'Minimalist',
        price: 399,
        hours: 2,
        deliveryDays: 12,
        details: ['10 fotos tratadas', 'Pais e irmaos', 'Roupas e acessorios do estudio']
      },
      {
        id: 'essential',
        name: 'Essential',
        price: 449,
        hours: 2,
        deliveryDays: 12,
        details: ['15 fotos tratadas', 'Pais e irmaos', 'Roupas e acessorios do estudio']
      },
      {
        id: 'middle',
        name: 'Middle',
        price: 499,
        hours: 3,
        deliveryDays: 14,
        details: ['15 fotos tratadas', 'Pais e irmaos', 'Revista 15x21 com o ensaio']
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 610,
        hours: 4,
        deliveryDays: 16,
        details: ['20 fotos tratadas', 'Pais e irmaos', 'Album encadernado 15x21']
      }
    ],
    extras: [
      { id: 'familia', name: 'Fotos com os pais', price: 120 },
      { id: 'album', name: 'Album baby', price: 360 },
      { id: 'impressas', name: 'Kit de impressas', price: 180 }
    ]
  },
  {
    slug: 'ensaio-familia',
    eventType: 'ensaio_familia',
    name: 'Ensaio em familia',
    summary: 'Ensaio em familia com direcao completa, fotos em alta qualidade e proposta enxuta.',
    packages: [
      {
        id: 'familia',
        name: 'Ensaio em familia',
        price: 230,
        hours: 1,
        deliveryDays: 10,
        details: ['15 fotos digitais', 'Direcionamento completo', 'Entrega em alta qualidade']
      }
    ],
    extras: [
      { id: 'look', name: 'Consultoria de looks', price: 110 },
      { id: 'video', name: 'Video curto da familia', price: 240 },
      { id: 'album', name: 'Album afeto', price: 390 }
    ]
  },
  {
    slug: 'corporativo',
    eventType: 'corporativo',
    name: 'Corporativo',
    summary: 'Ensaio corporativo pensado para transmitir credibilidade, elegancia e confianca.',
    packages: [
      {
        id: 'corporativo',
        name: 'Ensaio corporativo',
        price: 230,
        hours: 1,
        deliveryDays: 7,
        details: ['15 fotos profissionais', 'Direcionamento de poses', 'Entrega em alta resolucao']
      }
    ],
    extras: [
      { id: 'direcao', name: 'Direcao de imagem', price: 180 },
      { id: 'reels', name: 'Reels para marca', price: 320 },
      { id: 'urgencia', name: 'Entrega agil', price: 240 }
    ]
  },
  {
    slug: 'formatura',
    eventType: 'formatura_externo',
    name: 'Formatura',
    summary: 'Ensaios de formatura com opcoes externas, beca e pacotes mais completos.',
    packages: [
      {
        id: 'externo',
        name: 'Externo',
        price: 190,
        hours: 1,
        deliveryDays: 10,
        details: ['20 fotos', 'Beca completa e cadeira', 'Fotos individuais e em turma']
      },
      {
        id: 'pacote-1',
        name: 'Pacote 1',
        price: 349,
        hours: 2,
        deliveryDays: 12,
        details: ['30 fotos digitais', 'Beca com faixa do curso', 'Fotos com a familia']
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 449,
        hours: 3,
        deliveryDays: 15,
        details: ['30 fotos digitais', 'Beca com faixa do curso', 'Cadeira de formandos']
      }
    ],
    extras: [
      { id: 'beca', name: 'Beca completa', price: 110 },
      { id: 'familia', name: 'Fotos com a familia', price: 120 },
      { id: 'album', name: 'Album de formatura', price: 380 }
    ]
  },
  {
    slug: 'smash-the-cake',
    eventType: 'smash_the_cake',
    name: 'Smash the Cake',
    summary: 'Ensaio tematico com bolo, cenario personalizado e memorias divertidas do primeiro aninho.',
    packages: [
      {
        id: 'smash',
        name: 'Smash the Cake',
        price: 399,
        hours: 2,
        deliveryDays: 12,
        details: ['25 fotos', 'Fotos com a familia', 'Cenario personalizado']
      },
      {
        id: 'smash-parcelado',
        name: 'Smash parcelado',
        price: 499,
        hours: 2,
        deliveryDays: 12,
        details: ['25 fotos', 'Fotos com a familia', 'Opcao parcelada']
      }
    ],
    extras: [
      { id: 'tema', name: 'Tema personalizado', price: 180 },
      { id: 'familia', name: 'Fotos com a familia', price: 120 },
      { id: 'video', name: 'Video curto', price: 220 }
    ]
  }
];

function cloneCatalog(items) {
  return JSON.parse(JSON.stringify(items));
}

function parseConfiguredEmails() {
  const values = [
    String(process.env.PUBLIC_SITE_USER_EMAILS || ''),
    String(process.env.PUBLIC_SITE_USER_EMAIL || '')
  ]
    .join(',')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return Array.from(new Set(values));
}

async function getCatalogForPhotographerId(photographerId) {
  const stored = await PublicCatalog.findOne({ photographerId }).lean();
  return stored?.services?.length ? stored.services : getDefaultCatalog();
}

function findCatalogItem(services, serviceSlug) {
  return services.find((item) => item.slug === serviceSlug);
}

async function findPublicPhotographers(options = {}) {
  const configuredEmails = parseConfiguredEmails();
  const configuredId = String(process.env.PUBLIC_SITE_USER_ID || '').trim();
  const preferredPhotographerId = String(options.preferredPhotographerId || '').trim();

  const photographers = [];
  const seenIds = new Set();

  function pushPhotographer(photographer) {
    if (!photographer?._id) return;
    const key = String(photographer._id);
    if (seenIds.has(key)) return;
    seenIds.add(key);
    photographers.push(photographer);
  }

  if (preferredPhotographerId) {
    pushPhotographer(await User.findById(preferredPhotographerId));
  }

  if (configuredId) {
    pushPhotographer(await User.findById(configuredId));
  }

  if (configuredEmails.length) {
    const configuredUsers = await User.find({ email: { $in: configuredEmails } });
    const byEmail = new Map(
      configuredUsers.map((user) => [String(user.email || '').trim().toLowerCase(), user])
    );

    for (const email of configuredEmails) {
      pushPhotographer(byEmail.get(email));
    }
  }

  if (!photographers.length) {
    pushPhotographer(await User.findOne().sort({ createdAt: 1 }));
  }

  if (!photographers.length) {
    const error = new Error('Nenhum fotografo configurado para receber simulacoes.');
    error.statusCode = 503;
    throw error;
  }

  return photographers;
}

async function findPublicPhotographer(options = {}) {
  const photographers = await findPublicPhotographers(options);
  return photographers[0];
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

export function getDefaultCatalog() {
  return cloneCatalog(catalog);
}

export async function listQuoteCatalog(options = {}) {
  const photographer = await findPublicPhotographer(options);
  return getCatalogForPhotographerId(photographer._id);
}

export async function createPublicQuoteRequest(payload, options = {}) {
  ensureRequired(payload);

  const photographers = await findPublicPhotographers(options);
  const createdEvents = [];
  let responseSummary = null;

  for (const photographer of photographers) {
    const services = await getCatalogForPhotographerId(photographer._id);
    const service = findCatalogItem(services, payload.serviceSlug);
    if (!service) {
      const error = new Error('Servico nao encontrado para simulacao.');
      error.statusCode = 404;
      throw error;
    }

    const client = await findOrCreateClient(photographer._id, payload);
    const { selectedPackage, selectedExtras, total } = calculateTotal(service, payload.packageId, payload.extraIds || []);

    const notes = [
      'Simulacao enviada pelo site publico.',
      `Servico escolhido: ${service.name}.`,
      `Pacote: ${selectedPackage.name}.`,
      selectedPackage.details?.length ? `Itens do pacote: ${selectedPackage.details.join(', ')}.` : null,
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

    createdEvents.push(event);

    if (!responseSummary) {
      responseSummary = {
        total,
        packageName: selectedPackage.name,
        packageDetails: selectedPackage.details || [],
        extras: selectedExtras.map((item) => item.name)
      };
    }
  }

  return {
    eventId: createdEvents[0]?._id,
    eventIds: createdEvents.map((item) => item._id),
    recipients: photographers.length,
    total: responseSummary?.total || 0,
    packageName: responseSummary?.packageName || '',
    packageDetails: responseSummary?.packageDetails || [],
    extras: responseSummary?.extras || [],
    message: 'Simulacao enviada com sucesso.'
  };
}
