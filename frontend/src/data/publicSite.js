export const serviceContent = {
  casamento: {
    route: '/servicos/casamento',
    seoTitle: 'Casamento | Vida em Foco Fotografia',
    seoDescription:
      'Cobertura de casamento com direcao leve, olhar sensivel e simulacao de orcamento online para clientes da Vida em Foco.',
    eyebrow: 'Casamentos',
    heroTitle: 'Seu casamento com fotografia sensivel e planejamento claro',
    heroText:
      'A Vida em Foco acompanha o ritmo do dia com discricao, direcao quando necessario e uma entrega pensada para quem quer viver o casamento sem tensao.',
    image:
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1400&q=80',
    bullets: [
      'Cobertura para cerimonia, making of e recepcao',
      'Orientacao de cronograma e momentos-chave',
      'Simulacao online com pacote e extras'
    ]
  },
  'ensaio-infantil': {
    route: '/servicos/ensaio-infantil',
    seoTitle: 'Ensaio Infantil | Vida em Foco Fotografia',
    seoDescription:
      'Ensaio infantil com clima leve, acolhedor e simulacao de orcamento online para familias da Vida em Foco.',
    eyebrow: 'Infantil',
    heroTitle: 'Memorias leves para uma fase que passa rapido',
    heroText:
      'O ensaio infantil e conduzido com paciencia, brincadeira e um olhar que respeita o tempo da crianca para que as fotos fiquem naturais.',
    image:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1400&q=80',
    bullets: [
      'Ensaio em estudio, casa ou area externa',
      'Participacao da familia quando fizer sentido',
      'Pacotes simples para comparar antes do contato'
    ]
  },
  gestante: {
    route: '/servicos/gestante',
    seoTitle: 'Ensaio Gestante | Vida em Foco Fotografia',
    seoDescription:
      'Ensaio gestante com direcao suave, experiencia acolhedora e simulacao de orcamento online.',
    eyebrow: 'Gestante',
    heroTitle: 'Um ensaio para guardar a fase mais delicada da espera',
    heroText:
      'A proposta da Vida em Foco e transformar a gestacao em imagens elegantes e afetivas, com conforto e calma em cada etapa.',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1400&q=80',
    bullets: [
      'Direcao suave e atmosfera feminina',
      'Possibilidade de incluir parceiro e familia',
      'Simulacao com extras como maquiagem e vestido'
    ]
  },
  casal: {
    route: '/servicos/casal',
    seoTitle: 'Ensaio de Casal | Vida em Foco Fotografia',
    seoDescription:
      'Ensaio de casal com estilo natural, visual romantico e simulacao de orcamento online no site da Vida em Foco.',
    eyebrow: 'Casal',
    heroTitle: 'Um ensaio para contar a energia do casal sem poses travadas',
    heroText:
      'Perfeito para namoro, noivado, pre wedding ou simplesmente para registrar a fase atual com espontaneidade e direcao leve.',
    image:
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1400&q=80',
    bullets: [
      'Locacoes alinhadas ao estilo do casal',
      'Direcao para quem nao tem costume com camera',
      'Comparacao de pacotes e extras no proprio site'
    ]
  },
  'evento-infantil': {
    route: '/servicos/evento-infantil',
    seoTitle: 'Festa Infantil | Vida em Foco Fotografia',
    seoDescription:
      'Cobertura de festa infantil com simulacao de orcamento, pacote, extras e envio direto para o painel da Vida em Foco.',
    eyebrow: 'Eventos',
    heroTitle: 'Cobertura fotografica para festas infantis cheias de vida',
    heroText:
      'Da decoracao ao parabens, a cobertura registra detalhes, emocao e movimento para que a familia aproveite a festa sabendo que tudo esta sendo guardado.',
    image:
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1400&q=80',
    bullets: [
      'Cobertura por blocos de horas',
      'Extras para album, impressas e video',
      'Pedido de orcamento feito pelo proprio cliente'
    ]
  }
};

export const homeCollections = [
  {
    title: 'Casamentos',
    text: 'Cobertura com presenca, narrativa e planejamento visual para um dia intenso e unico.',
    slug: 'casamento'
  },
  {
    title: 'Ensaios',
    text: 'Experiencias leves para gestante, infantil e casal, com direcao acolhedora e natural.',
    slug: 'gestante'
  },
  {
    title: 'Eventos infantis',
    text: 'Registro espontaneo e organizado de aniversarios e comemoracoes.',
    slug: 'evento-infantil'
  }
];

export const quoteFormDefaults = {
  name: '',
  email: '',
  phone: '',
  location: '',
  eventDate: '',
  eventEndDate: '',
  guestCount: '',
  contactPreference: 'whatsapp',
  message: '',
  serviceSlug: '',
  packageId: '',
  extraIds: []
};

export function getServiceContent(slug) {
  return serviceContent[slug];
}
