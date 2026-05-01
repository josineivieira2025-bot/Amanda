function clean(value) {
  return String(value || '').trim();
}

function valueOrDash(value) {
  return clean(value) || '-';
}

function clientName(client) {
  return clean(client?.name) || 'tudo bem';
}

function dateOnly(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('pt-BR');
}

function timeOnly(value) {
  if (!value) return '-';
  return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function dateTime(value) {
  if (!value) return '-';
  return `${dateOnly(value)} ${timeOnly(value)}`;
}

function money(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function eventInfo(data) {
  return {
    data: dateOnly(data.date),
    inicio: timeOnly(data.date),
    fim: timeOnly(data.endDate),
    horario: data.endDate ? `${timeOnly(data.date)} as ${timeOnly(data.endDate)}` : timeOnly(data.date),
    local: valueOrDash(data.location),
    valor: money(data.price)
  };
}

const paymentText = `Formas de pagamento:
* 10% de sinal para reserva da data e o restante ate o dia do evento via Pix ou Transferencia
* Parcelamento no cartao de credito conforme condicoes combinadas`;

const signature = `Atenciosamente,
Vida em Foco`;

const templates = {
  casamento(data) {
    const info = eventInfo(data);
    return `ORCAMENTO - CASAMENTO CIVIL + RECEPCAO

Evento: Casamento Civil + Recepcao
Horario: ${info.horario}
Data: ${info.data}
Local: ${info.local}
Cobertura Fotografica: Cartorio + Recepcao

Fotos ilimitadas no cartorio e na recepcao
2 horas de cobertura fotografica na recepcao
Fotos entregues em alta resolucao
Entrega via link para download

Investimento: R$ 700,00

${paymentText}

${signature}`;
  },

  aniversario_infantil(data, client) {
    const info = eventInfo(data);
    return `Prezada(o) ${clientName(client)},
Sera um prazer registrar a festa de aniversario do(a) seu(sua) filho(a) e eternizar esse momento tao especial com todo carinho e atencao aos detalhes.

Informacoes do Evento
* Data: ${info.data}
* Local: ${info.local}
* Horario: ${info.horario}

Nossa proposta inclui cobertura fotografica completa durante 3 horas, registrando desde os detalhes da decoracao ate os momentos mais emocionantes da festa.

O que sera registrado:
Detalhes da decoracao e do ambiente no inicio da cobertura
Momentos espontaneos e especiais da festa
Interacao com familiares e convidados
O momento mais esperado: o Parabens

Nosso objetivo e capturar sorrisos, emocoes e cada detalhe que torna essa data unica, criando lembrancas que poderao ser revividas por muitos anos.

Investimento: ${info.valor}

${signature}`;
  },

  ensaio_gestante() {
    return `Proposta de Orcamento - Ensaios Gestante

PACOTE PREMIUM
Sessao fotografica externa: 30 fotos em locacao escolhida com o cliente
Sessao fotografica em estudio: 15 fotos
Vestuario e maquiagem social inclusos para os dois ensaios
Valor: R$ 1530,00 ou R$ 1630,00 ate 10x sem juros

PACOTE MIDDLE
Sessao fotografica externa em locacao a escolha do cliente
3 vestuarios inclusos
Maquiagem social
30 fotos
Valor: R$ 679,00 ou R$ 779,00 ate 10x sem juros

PACOTE ESSENTIAL
Sessao fotografica em estudio
2 vestuarios inclusos
Maquiagem social
15 fotos
Valor: R$ 590,00 ou R$ 690,00 ate 10x de R$ 69,43 sem juros

PACOTE MINIMALIST
Sessao fotografica em estudio
1 vestuario incluso
Maquiagem social
10 fotos
Valor: R$ 469,00 ou R$ 569,00 ate 10x sem juros

${signature}`;
  },

  ensaio_infantil() {
    return `ENSAIO INFANTIL

Um ambiente leve, delicado e atemporal, pensado para valorizar o que realmente importa: a crianca.
Cores neutras, elementos suaves e uma composicao harmonica que nao rouba a cena, apenas realca cada expressao, gesto e detalhe do seu pequeno.

O foco esta na essencia, na pureza e nas emocoes genuinas captadas em cada clique.

25 fotos
Fotos com a familia

Valor: R$ 279,00 ou R$ 379,00 ate 10x sem juros

${signature}`;
  },

  smash_the_cake() {
    return `ENSAIO INFANTIL - SMASH THE CAKE

Um cenario ludico, colorido e totalmente personalizado, criado com base no tema escolhido pela familia.
Cada detalhe e pensado para refletir a personalidade do bebe e tornar esse momento ainda mais especial.

Composicao elaborada, elementos decorativos criativos e um bolo exclusivo para o smash, tudo preparado com muito carinho para garantir uma experiencia divertida e cheia de memorias encantadoras.

Diversao, bagunca gostosa e registros inesqueciveis para celebrar o primeiro aninho.

25 fotos
Fotos com a familia

Valor: R$ 399,00 ou R$ 499,00 ate 10x sem juros

${signature}`;
  },

  ensaio_casal() {
    return `Orcamento - Ensaio de Casal

OPCAO EXTERNA
Ensaio realizado em ambiente externo
25 fotos tratadas e entregues em alta resolucao
Valor: R$ 300,00

OPCAO ESTUDIO
Ensaio realizado em estudio
15 fotos tratadas e entregues em alta resolucao
Valor: R$ 230,00

Extra maquiagem: R$ 120,00

Perfeito para casais que gostam de fotos naturais, leves e cheias de espontaneidade, ou para um registro mais intimista em estudio.

${signature}`;
  },

  aniversario_15() {
    return `Orcamento - Ensaio de 15 anos

OPCAO EXTERNA
Ensaio realizado em ambiente externo
25 fotos tratadas e entregues em alta resolucao
Valor: R$ 300,00 ou R$ 399,00 em ate 10x sem juros

OPCAO ESTUDIO
Ensaio realizado em estudio
15 fotos tratadas e entregues em alta resolucao
Valor: R$ 230,00 ou R$ 330,00 em ate 10x sem juros

${signature}`;
  },

  newborn() {
    return `Ensaio de Newborn

PACOTE MINIMALIST
10 fotos tratadas
Fotos com os pais / irmaos
Roupas e acessorios do estudio inclusos
Valor: R$ 399,00 ou R$ 499,00 ate 10x sem juros

PACOTE ESSENTIAL
15 fotos tratadas
Fotos com os pais / irmaos
Roupas e acessorios do estudio inclusos
Valor: R$ 449,00 ou R$ 549,00 ate 10x sem juros

PACOTE MIDDLE
15 fotos tratadas
Fotos com os pais / irmaos
1 Revista 15x21cm com todas as fotos do ensaio
Valor: R$ 499,00 ou R$ 599,00 ate 10x sem juros

PACOTE PREMIUM
20 fotos tratadas
Fotos com os pais / irmaos
1 Album encadernado 15x21cm com todas as fotos do ensaio
Valor: R$ 610,00 ou R$ 710,00 ate 10x sem juros

${signature}`;
  },

  cha_revelacao() {
    return `Orcamento - Cha de Revelacao em Estudio

Pacote inclui:
20 fotos tratadas em alta qualidade
1 video de ate 1 minuto e 30 segundos
Direcionamento completo de poses
Entrega digital via link

Investimento: R$ 450,00

Um momento unico e cheio de emocao que merece ser registrado com muito carinho.

${signature}`;
  },

  cha_de_panela() {
    return `Orcamento - Cha de Panela em Estudio

Pacote inclui:
20 fotos tratadas em alta qualidade
1 video de ate 1 minuto e 30 segundos
Direcionamento completo de poses
Entrega digital via link

Investimento: R$ 450,00

Um momento especial que merece ser registrado com muito carinho.

${signature}`;
  },

  corporativo() {
    return `Orcamento - Ensaio Corporativo

O ensaio corporativo e pensado para valorizar sua imagem profissional, transmitindo credibilidade, elegancia e confianca.

O que esta incluso:
Direcionamento completo de poses e orientacao de imagem
15 fotos profissionais tratadas
Entrega das fotos em alta resolucao
Arquivos enviados em formato digital atraves de link do Google Drive

Investimento: R$ 230,00

Sera um prazer registrar imagens que fortalecam sua presenca profissional.

${signature}`;
  }
};

export function buildBudgetTemplateText(data, client, labels = {}) {
  const template = templates[data.type];
  if (template) return template(data, client);

  const info = eventInfo(data);
  const type = labels[data.type] || 'Servico fotografico';

  return [
    `Oi, ${clientName(client)}! Tudo bem?`,
    '',
    `Segue o orcamento para ${type}:`,
    '',
    `Data e inicio: ${dateTime(data.date)}`,
    `Horario final: ${data.endDate ? info.fim : 'horario final a combinar'}`,
    `Local: ${info.local}`,
    `Investimento: ${info.valor}`,
    '',
    'Se fizer sentido para voce, posso deixar essa data pre-reservada enquanto alinhamos os detalhes.',
    'Qualquer duvida ou ajuste que precisar, estou a disposicao.',
    '',
    signature
  ].join('\n');
}

