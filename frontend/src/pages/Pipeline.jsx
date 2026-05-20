import { CalendarDays, MessageCircle, Send, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const stages = [
  { value: 'orcamento_pendente', label: 'Novo lead', helper: 'Chegou e ainda precisa de resposta' },
  { value: 'orcamento_enviado', label: 'Orcamento enviado', helper: 'Proposta enviada; aguardando resposta do cliente' },
  { value: 'agendado', label: 'Agendado', helper: 'Data reservada na agenda' },
  { value: 'confirmado', label: 'Confirmado', helper: 'Contrato fechado' },
  { value: 'finalizado', label: 'Finalizado', helper: 'Evento concluÃ­do' }
];

const typeLabels = {
  aniversario_infantil: 'AniversÃ¡rio infantil',
  casamento: 'Casamento',
  ensaio_gestante: 'Ensaio gestante',
  ensaio_casal: 'Ensaio casal',
  ensaio_familia: 'Ensaio famÃ­lia',
  outro: 'Outro'
};

function formatPhone(value = '') {
  let digits = String(value).replace(/\D/g, '');
  if (!digits) return '';
  if (!digits.startsWith('55')) digits = `55${digits}`;
  return digits;
}

function normalizeStatus(status = '') {
  return status === 'aguardando_resposta' ? 'orcamento_enviado' : status;
}

function whatsappUrl(event, text) {
  const phone = formatPhone(event.clientId?.phone);
  const query = new URLSearchParams({
    ...(phone ? { phone } : {}),
    text
  });
  return `https://api.whatsapp.com/send?${query.toString()}`;
}

function nextMessage(event) {
  const name = event.clientId?.name?.split(' ')[0] || 'tudo bem';
  if (event.status === 'orcamento_pendente') {
    return `Oi, ${name}! Recebi seu pedido de orÃ§amento e jÃ¡ vou te ajudar com as opÃ§Ãµes de ensaio/fotografia. Qual melhor horÃ¡rio para falarmos?`;
  }
  if (normalizeStatus(event.status) === 'orcamento_enviado') {
    return `Oi, ${name}! Passando para saber se conseguiu ver o orÃ§amento. Posso tirar dÃºvidas ou ajustar a proposta para sua data.`;
  }
  return `Oi, ${name}! Passando para confirmar os detalhes do nosso atendimento e deixar tudo organizado para a data.`;
}

export function Pipeline() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api('/events').then(setEvents).catch(console.error);
  }, []);

  const grouped = useMemo(() => {
    return stages.reduce((groups, stage) => {
      groups[stage.value] = events.filter((event) => normalizeStatus(event.status) === stage.value);
      return groups;
    }, {});
  }, [events]);

  const openLeads = (grouped.orcamento_pendente?.length || 0) + (grouped.orcamento_enviado?.length || 0);
  const closed = (grouped.agendado?.length || 0) + (grouped.confirmado?.length || 0) + (grouped.finalizado?.length || 0);
  const conversion = events.length ? Math.round((closed / events.length) * 100) : 0;

  return (
    <section className="page ops-page pipeline-page">
      <div className="ops-header">
        <div>
          <span className="hero-eyebrow rose">CRM</span>
          <h1>Pipeline comercial</h1>
          <p>Veja cada atendimento por etapa e aja rÃ¡pido nos leads que ainda precisam de resposta.</p>
        </div>
        <div className="ops-header-control">
          <span>ConversÃ£o</span>
          <strong>{conversion}%</strong>
          <small>{closed} fechado(s) de {events.length} atendimento(s)</small>
        </div>
      </div>

      <div className="ops-metrics-grid three">
        <div><MessageCircle size={20} /><span>Leads abertos</span><strong>{openLeads}</strong></div>
        <div><TrendingUp size={20} /><span>Fechados</span><strong>{closed}</strong></div>
        <div><CalendarDays size={20} /><span>Total no funil</span><strong>{events.length}</strong></div>
      </div>

      <div className="pipeline-board">
        {stages.map((stage) => (
          <section className="pipeline-column" key={stage.value}>
            <div className="pipeline-column-head">
              <div>
                <strong>{stage.label}</strong>
                <span>{stage.helper}</span>
              </div>
              <b>{grouped[stage.value]?.length || 0}</b>
            </div>
            <div className="pipeline-card-list">
              {(grouped[stage.value] || []).map((event) => (
                <article className="pipeline-card" key={event._id}>
                  <div className="pipeline-card-main">
                    <strong>{event.clientId?.name || 'Cliente sem nome'}</strong>
                    <span>{typeLabels[event.type] || event.type || 'Atendimento'}</span>
                  </div>
                  <small><CalendarDays size={14} /> {event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'Data a confirmar'}</small>
                  <a className="mini-link-button" href={whatsappUrl(event, nextMessage(event))} target="_blank" rel="noreferrer">
                    <Send size={15} />
                    WhatsApp
                  </a>
                </article>
              ))}
              {(grouped[stage.value] || []).length === 0 && (
                <div className="pipeline-empty">Sem atendimentos nessa etapa</div>
              )}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
