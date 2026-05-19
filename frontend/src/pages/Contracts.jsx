import { Copy, FileText, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function buildContract(event) {
  const client = event.clientId?.name || 'CLIENTE';
  const date = event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'DATA A DEFINIR';
  const value = money.format(event.price || 0);

  return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS FOTOGRÁFICOS

CONTRATANTE: ${client}
CONTRATADA: Mel Fotografia
SERVIÇO: ${event.type || 'Serviço fotográfico'}
DATA: ${date}
LOCAL: ${event.location || 'A confirmar'}
VALOR: ${value}

1. A CONTRATADA realizará a cobertura fotográfica do serviço descrito acima.
2. A reserva da data ocorre mediante confirmação do atendimento e pagamento de entrada, quando aplicável.
3. Prazos de seleção, edição e entrega serão alinhados pelo atendimento.
4. Alterações de data dependem de disponibilidade da agenda.
5. Este texto é um modelo inicial e pode ser revisado antes do envio ao cliente.

Assinatura do cliente: ______________________________
Assinatura da contratada: ___________________________`;
}

function formatPhone(value = '') {
  let digits = String(value).replace(/\D/g, '');
  if (!digits) return '';
  if (!digits.startsWith('55')) digits = `55${digits}`;
  return digits;
}

export function Contracts() {
  const [events, setEvents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api('/events')
      .then((items) => {
        const closed = items.filter((event) => ['agendado', 'confirmado', 'em_andamento', 'finalizado'].includes(event.status));
        setEvents(closed);
        setSelectedId(closed[0]?._id || '');
      })
      .catch(console.error);
  }, []);

  const selectedEvent = useMemo(() => events.find((event) => event._id === selectedId), [events, selectedId]);
  const contractText = selectedEvent ? buildContract(selectedEvent) : '';
  const whatsappText = selectedEvent ? `Olá! Segue o modelo de contrato para conferirmos os dados:\n\n${contractText}` : '';
  const phone = formatPhone(selectedEvent?.clientId?.phone);
  const whatsappUrl = `https://api.whatsapp.com/send?${new URLSearchParams({ ...(phone ? { phone } : {}), text: whatsappText })}`;

  async function copyContract() {
    await navigator.clipboard.writeText(contractText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="page contracts-page">
      <div className="module-hero">
        <div>
          <span className="hero-eyebrow rose">Contratos</span>
          <h1>Gerador de contrato</h1>
          <p>Gere um modelo inicial com dados do evento para revisar e enviar ao cliente.</p>
        </div>
        <div className="module-hero-card">
          <span>Contratos possíveis</span>
          <strong>{events.length}</strong>
          <small>eventos agendados, confirmados ou finalizados</small>
        </div>
      </div>

      <div className="contracts-grid">
        <div className="panel">
          <div className="compact-head">
            <div>
              <h2>Evento</h2>
              <p>Escolha o atendimento para gerar o documento.</p>
            </div>
            <FileText size={20} />
          </div>
          <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
            <option value="">Selecione</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.clientId?.name || 'Cliente sem nome'} - {event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'Sem data'}
              </option>
            ))}
          </select>

          {selectedEvent && (
            <div className="contract-summary">
              <span>Cliente</span>
              <strong>{selectedEvent.clientId?.name || 'Cliente sem nome'}</strong>
              <span>Valor</span>
              <strong>{money.format(selectedEvent.price || 0)}</strong>
            </div>
          )}
        </div>

        <div className="panel contract-preview-panel">
          <div className="compact-head">
            <div>
              <h2>Prévia do contrato</h2>
              <p>Texto editável fora do sistema após copiar.</p>
            </div>
            <div className="toolbar">
              <button className="ghost-button" type="button" disabled={!contractText} onClick={copyContract}>
                <Copy size={16} />
                {copied ? 'Copiado' : 'Copiar'}
              </button>
              <a className="primary-button" href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </div>
          <pre className="contract-preview">{contractText || 'Selecione um evento para gerar o contrato.'}</pre>
        </div>
      </div>
    </section>
  );
}
