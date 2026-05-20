import { Copy, FileText, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function buildContract(event) {
  const client = event.clientId?.name || 'CLIENTE';
  const date = event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'DATA A DEFINIR';
  const value = money.format(event.price || 0);

  return `CONTRATO DE PRESTACAO DE SERVICOS FOTOGRAFICOS

CONTRATANTE: ${client}
CONTRATADA: Mel Fotografia
SERVICO: ${event.type || 'Servico fotografico'}
DATA: ${date}
LOCAL: ${event.location || 'A confirmar'}
VALOR: ${value}

1. A CONTRATADA realizara a cobertura fotografica do servico descrito acima.
2. A reserva da data ocorre mediante confirmacao do atendimento e pagamento de entrada, quando aplicavel.
3. Prazos de selecao, edicao e entrega serao alinhados pelo atendimento.
4. Alteracoes de data dependem de disponibilidade da agenda.
5. Este texto e um modelo inicial e pode ser revisado antes do envio ao cliente.

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
        const closed = items
          .filter((event) => ['agendado', 'confirmado', 'em_andamento', 'finalizado'].includes(event.status))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(closed);
        setSelectedId(closed[0]?._id || '');
      })
      .catch(console.error);
  }, []);

  const selectedEvent = useMemo(() => events.find((event) => event._id === selectedId) || events[0], [events, selectedId]);
  const contractText = selectedEvent ? buildContract(selectedEvent) : '';
  const whatsappText = selectedEvent ? `Ola! Segue o modelo de contrato para conferirmos os dados:\n\n${contractText}` : '';
  const phone = formatPhone(selectedEvent?.clientId?.phone);
  const whatsappUrl = `https://api.whatsapp.com/send?${new URLSearchParams({ ...(phone ? { phone } : {}), text: whatsappText })}`;

  async function copyContract() {
    await navigator.clipboard.writeText(contractText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="page ops-page">
      <div className="ops-header">
        <div>
          <span className="hero-eyebrow rose">Contratos</span>
          <h1>Contratos de eventos</h1>
          <p>Selecione um evento fechado, revise o texto e envie para conferencia do cliente.</p>
        </div>
        <div className="ops-header-control">
          <span>Disponiveis</span>
          <strong>{events.length}</strong>
        </div>
      </div>

      <div className="ops-workspace contracts-workspace">
        <section className="ops-section">
          <div className="ops-section-head">
            <div>
              <h2>Eventos elegiveis</h2>
              <p>Agendados, confirmados, em andamento ou finalizados.</p>
            </div>
          </div>
          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className={selectedEvent?._id === event._id ? 'selected-row' : ''} onClick={() => setSelectedId(event._id)}>
                    <td>{event.clientId?.name || 'Cliente sem nome'}</td>
                    <td>{event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'Sem data'}</td>
                    <td>{event.status}</td>
                    <td>{money.format(event.price || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!events.length && <div className="ops-empty">Nenhum evento elegivel para contrato.</div>}
          </div>
        </section>

        <aside className="ops-inspector contract-inspector">
          <section className="ops-section">
            <div className="ops-section-head">
              <div>
                <h2>Previa do contrato</h2>
                <p>{selectedEvent?.clientId?.name || 'Selecione um evento'}</p>
              </div>
              <FileText size={18} />
            </div>
            <pre className="ops-document-preview">{contractText || 'Selecione um evento para gerar o contrato.'}</pre>
            <div className="ops-actions-row">
              <button className="ghost-button" type="button" disabled={!contractText} onClick={copyContract}>
                <Copy size={16} />
                {copied ? 'Copiado' : 'Copiar'}
              </button>
              <a className="primary-button" href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
