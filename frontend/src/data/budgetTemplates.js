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

function dateAndStart(value) {
  if (!value) return '-';
  return `${dateOnly(value)} ${timeOnly(value)}`;
}

function moneyNumber(value, fallback = 0) {
  const number = Number(value || 0) || fallback;
  return number.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function hoursText(data, fallback = '3 horas') {
  if (!data.date || !data.endDate) return fallback;
  const start = new Date(data.date).getTime();
  const end = new Date(data.endDate).getTime();
  const diff = Math.max(0, end - start);
  if (!diff) return fallback;
  const hours = diff / 36e5;
  if (Number.isInteger(hours)) return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  return `${String(hours).replace('.', ',')} horas`;
}

function eventInfo(data, fallbackPrice = 0) {
  return {
    data: dateOnly(data.date),
    dataInicio: dateAndStart(data.date),
    horario: data.endDate ? `${timeOnly(data.date)} às ${timeOnly(data.endDate)}` : timeOnly(data.date),
    horarioFinal: data.endDate ? timeOnly(data.endDate) : '-',
    local: valueOrDash(data.location),
    valor: moneyNumber(data.price, fallbackPrice),
    sinal: moneyNumber((Number(data.price || 0) || fallbackPrice) * 0.1)
  };
}

const templates = {
  outro(data, client, labels = {}) {
    const info = eventInfo(data);
    const type = labels[data.type] || 'SERVIÇO';
    const name = clean(client?.name);

    if (!name) {
      return `Oi, tudo bem! Tudo bem?

Segue o orcamento para ${type}:

Data e inicio: ${info.dataInicio}
Horario final: ${info.horarioFinal}
Local: ${info.local}
Investimento: R$ ${info.valor}

Se fizer sentido para voce, posso deixar essa data pre-reservada enquanto alinhamos os detalhes.
Qualquer duvida ou ajuste que precisar, estou a disposicao.`;
    }

    return `Oi, ${name}! Tudo bem?

Segue o orcamento para ${type}:

Data e inicio: ${info.dataInicio}
Horario final: ${info.horarioFinal}
Local: ${info.local}
Investimento: R$ ${info.valor}

Se fizer sentido para voce, posso deixar essa data pre-reservada enquanto alinhamos os detalhes.
Qualquer duvida ou ajuste que precisar, estou a disposicao.`;
  },

  casamento(data) {
    const info = eventInfo(data, 700);
    return `ORÇAMENTO – CASAMENTO CIVIL + RECEPÇÃO

Evento: ${valueOrDash(data.title) === '-' ? 'Casamento Civil + Recepção' : valueOrDash(data.title)}

Horário: ${info.horario}
Data: ${info.data}
Cobertura Fotográfica: 📸 Cartório + Recepção

✔ Fotos ilimitadas no cartório e na recepção
✔ 2 hora de cobertura fotográfica na recepção
✔ Fotos entregues em alta resolução
✔ Entrega via link para download

Investimento: R$ ${info.valor}

Formas de pagamento:
• 10% de sinal para reserva da data e o restante até o dia do evento via Pix ou Transferência
• Parcelamento em até 5x no cartão de crédito (com juros)

      Atenciosamente,

Mel Sabino Fotografia`;
  },

  aniversario_infantil(data, client) {
    const info = eventInfo(data);
    const horas = hoursText(data);
    return `Prezada(o) ${clientName(client)},
Será um prazer registrar a festa de aniversário do(a) seu(sua) filho(a) e eternizar esse momento tão especial com todo carinho e atenção aos detalhes.

Informações do Evento
• Data: ${info.data}
• Local: ${info.local}
• Horário: ${info.horario}

Nossa proposta inclui cobertura fotográfica completa durante ${horas}, registrando desde os detalhes da decoração até os momentos mais emocionantes da festa.

O que será registrado
📸 Detalhes da decoração e do ambiente no início da cobertura
📸 Momentos espontâneos e especiais da festa
📸 Interação com familiares e convidados
📸 O momento mais esperado: o Parabéns

Nosso objetivo é capturar sorrisos, emoções e cada detalhe que torna essa data única, criando lembranças que poderão ser revividas por muitos anos.

Entrega do Material
• Quantidade de fotos:
Todas as fotos realizadas no evento que estiverem com qualidade técnica e estética serão entregues (sem limite de cliques).

• Formato de entrega:
As fotos serão disponibilizadas através de galeria online com link para download, facilitando o compartilhamento com familiares e amigos.

• Prazo de entrega:
As fotos tratadas serão entregues em até 20 dias úteis após o evento.

Investimento
• Cobertura fotográfica: ${horas}
• Valor: R$ ${info.valor}

Formas de pagamento
• Sinal de R$ ${info.sinal} para reserva da data
• Restante até o dia do evento via Pix ou transferência
• Parcelamento em até 10x no cartão (com juros da operadora)

⚠️ A data só é garantida após o pagamento do sinal de reserva.

Ficarei muito feliz em fazer parte desse momento especial e registrar cada detalhe dessa comemoração.
Estou à disposição para qualquer dúvida ou para garantirmos sua data na agenda.

Atenciosamente,

     *Estúdio Mel Fotografia*`;
  },

  ensaio_gestante() {
    return `📸 Proposta de Orçamento - Ensaios Gestante

💫 PACOTE PREMIUM
Sessão *Fotográfica externa (30 fotos em locação escolhida com o cliente)
Sessão fotográfica estúdio  (15 fotos)
Vestuário e maquiagem social incluído para os dois ensaios.
💰 R$ 1530,00 ou 1630,00 até 10x SEM JUROS

💫 PACOTE MIDDLE
Sessão Fotográfica externa (Locação a escolha do cliente)
3 vestuários inclusos
Maquiagem socia
30 fotos
💰 R$ 679,00 ou 779,00 ate 10x SEM JUROS

💫 PACOTE ESSENTIAL
Sessão fotográfica estúdio
2 vestuários inclusos
Maquiagem social
15 fotos
💰 R$ 590,00 ou 690 até 10x de R$ 69,43 SEM JUROS

💫 PACOTE MINIMALIST
Sessão fotográfica estúdio
1 vestuário incluso
Maquiagem social
10 fotos
💰 R$ 469,00 ou 569,00 até 10x SEM JUROS`;
  },

  ensaio_infantil() {
    return `ENSAIO INFANTIL
Um ambiente leve, delicado e atemporal, pensado para valorizar o que realmente importa: a criança. Cores neutras, elementos suaves e uma composição harmônica que não rouba a cena — apenas realça cada expressão, gesto e detalhe do seu pequeno. O foco está na essência, na pureza e nas emoções genuínas captadas em cada clique.
25 fotos / Fotos com a família
💰 Valor: R$ 279,00 ou 379,00 ATÉ 10X SEM JUROS`;
  },

  smash_the_cake() {
    return `ENSAIO INFANTIL
SMASH THE CAKE*

Um cenário lúdico, colorido e totalmente personalizado, criado com base no tema escolhido pela família. Cada detalhe é pensado para refletir a personalidade do bebê e tornar esse momento ainda mais especial.
Composição elaborada, elementos decorativos criativos e um bolo exclusivo para o smash — tudo preparado com muito carinho para garantir uma experiência divertida e cheia de memórias encantadoras.
🌸 Diversão, bagunça gostosa e registros inesquecíveis para celebrar o primeiro aninho!
25 fotos / Fotos com a família

💰 *Valor: R$ 399,00 ou R$ 499,00 ATÉ 10X SEM JUROS`;
  },

  ensaio_casal_externo() {
    return `🌿 Ensaio de Casal – Externo
😊
Segue as informações do ensaio de casal externo:
📍 Ensaio realizado em ambiente externo
📷 25 fotos tratadas e entregues em alta resolução.
💰 Valor: R$ 300,00

EXTRAS MAQUIAGEM VALOR: R$120

Perfeito para casais que gostam de fotos naturais, leves e cheias de espontaneidade.`;
  },

  ensaio_casal_estudio() {
    return `📸 Ensaio de Casal – Estúdio 😊
Segue as informações do ensaio de casal no estúdio:
📍 Ensaio realizado em estúdio
📷 15 fotos tratadas e entregues em alta resolução.
💰 Valor: R$ 230,00

Extras maquiagem Valor: R$ 120

Um ensaio mais intimista, ideal para registrar a conexão do casal de forma elegante e atemporal.✨`;
  },

  ensaio_casal(data, client, labels) {
    return templates.ensaio_casal_externo(data, client, labels);
  },

  aniversario_15_externo() {
    return `🌿 Ensaio de 15 anos – Externo
😊
Segue as informações do ensaio de 15 anos:
📍 Ensaio realizado em ambiente externo
📷 25 fotos tratadas e entregues em alta resolução.
💰 *Valor: R$ 300,00
Ou 399,00 em até 10x SEM JUROS.`;
  },

  aniversario_15_estudio() {
    return `📸 Ensaio de 15 anos– Estúdio 😊
Segue as informações do ensaio de casal no estúdio:
📍 Ensaio realizado em estúdio
📷 15 fotos tratadas e entregues em alta resolução.
💰 Valor: R$ 230,00 ou 330,00 em até 10x SEM JUROS`;
  },

  aniversario_15(data, client, labels) {
    return templates.aniversario_15_externo(data, client, labels);
  },

  newborn() {
    return `🤱🏻Ensaio de Newborn👶🏻

🔹 Pacote Minimalist
10 fotos tratadas
Fotos com os pais / irmãos
Roupas e acessórios do estúdio inclusos

Valor: R$ 399,00 ou 499,00 até 10x SEM JUROS

🔹 Pacote Essential
15 fotos tratadas
Fotos com os pais / irmãos
Roupas e acessórios do estúdio inclusos

Valor: R$ 449,00 ou 549,00 até 10x SEM JUROS

🔹 Pacote Middle
15 fotos tratadas
Fotos com os pais / irmãos
1 Revista 15x21cm (com todas as fotos do ensaio)

Valor : R$ 499,00 ou 599,00 até 10x SEM JUROS

🔸 Pacote Premium (O mais completo!)
20 fotos tratadas
Fotos com os pais / irmãos
1 Álbum encadernado 15x21cm (com todas as fotos do ensaio)

Valor: R$ 610,00 ou 710 até 10x SEM JUROS`;
  },

  cha_revelacao() {
    return `✨ Orçamento – Chá de Revelação em Estúdio ✨

📸 Pacote inclui:
• 20 fotos tratadas em alta qualidade
• 1 vídeo de até 1 minuto e 30 segundos
• Direcionamento completo de poses
• Entrega digital via link
💰 Investimento: R$ 450,00

Um momento único e cheio de emoção que merece ser registrado com muito carinho 💛`;
  },

  cha_de_panela() {
    return templates.cha_revelacao();
  },

  corporativo() {
    return `Orçamento – Ensaio Corporativo

O ensaio corporativo é pensado para valorizar sua imagem profissional, transmitindo credibilidade, elegância e confiança.

📷 O que está incluso:
• Direcionamento completo de poses e orientação de imagem
• 15 fotos profissionais tratadas
• Entrega das fotos em alta resolução
• Arquivos enviados em formato digital através de link do Google Drive

💰 Investimento:
R$ 230,00

Será um prazer registrar imagens que fortaleçam sua presença profissional.💖`;
  },

  formatura_externo() {
    return `✨ Formatura externo ✨

O pacote inclui beca completa e cadeira.

💰 Valor: R$ 190,00 por pessoa

📸 Inclui 20 fotos, sendo:
• Fotos individuais
• Fotos familiares
• Fotos em turma

E formas de pagamento:

Valor de 30% para reservar o ensaio e o restante até a data.

Ou cartão de crédito 💳`;
  },

  formatura_pacote_1() {
    return `🎓✨ Ensaio de Formatura ✨🎓
📸 Pacote 1
• 30 fotos digitais
• Beca completa com faixa na cor do curso
• Fotos com a família
💰 De: R$ 349,00`;
  },

  formatura_premium() {
    return `🎓✨ Ensaio de Formatura Premium ✨🎓
📸 Pacote 2
• 30 fotos digitais
• Beca completa com faixa na cor do curso
• Cadeira de formandos inclusa
• Fotos com a família
💰 De: R$ 449,00`;
  },

  ensaio_familia() {
    return `📸 Orçamento – Ensaio em Família 💖

✨ 15 fotos digitais

✔ Direcionamento completo de poses
✔ Orientação para melhores composições e expressões
✔ Fotos entregues em alta qualidade via link do Google Drive

💰 Investimento: R$ 230,00

Será um prazer registrar esse momento especial da sua família! 💕`;
  }
};

export function buildBudgetTemplateText(data, client, labels = {}) {
  const template = templates[data.type] || templates.outro;
  return template(data, client, labels);
}
