import { CalendarDays, DollarSign, MessageCircle, TrendingUp, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const statusLabels = {
  orcamento_pendente: 'Orcamentos pendentes',
  orcamento_enviado: 'Orcamentos enviados / aguardando resposta',
  cliente_problema: 'Clientes sensiveis',
  agendado: 'Agendados',
  confirmado: 'Confirmados',
  em_andamento: 'Em andamento',
  finalizado: 'Finalizados',
  cancelado: 'Cancelados'
};

const sourceLabels = {
  instagram: 'Instagram',
  site: 'Site',
  whatsapp: 'WhatsApp',
  indicacao: 'Indicacao',
  cliente_antigo: 'Cliente antigo',
  google: 'Google',
  outro: 'Outro'
};

function currentPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function parsePeriod(period) {
  const [year, month] = period.split('-');
  return { year, month };
}

function normalizeStatus(status = '') {
  return status === 'aguardando_resposta' ? 'orcamento_enviado' : status;
}

function groupCount(items, key) {
  return items.reduce((groups, item) => {
    const value = key === 'status' ? normalizeStatus(item[key]) : item[key] || 'outro';
    groups[value] = (groups[value] || 0) + 1;
    return groups;
  }, {});
}

function OpsMetric({ icon: Icon, label, value, helper, tone = '' }) {
  return (
    <div className={`ops-metric ${tone}`}>
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </div>
  );
}

function BarRow({ label, value, total }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="ops-bar-row">
      <div>
        <strong>{label}</strong>
        <span>{value} registro(s)</span>
      </div>
      <div className="ops-bar-track"><i style={{ width: `${percent}%` }} /></div>
      <b>{percent}%</b>
    </div>
  );
}

function OpsSection({ title, text, children }) {
  return (
    <section className="ops-section">
      <div className="ops-section-head">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function Reports() {
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [period, setPeriod] = useState(currentPeriod);
  const [loading, setLoading] = useState(true);

  function load() {
    const { month, year } = parsePeriod(period);
    const from = `${year}-${month}-01`;
    const to = new Date(Number(year), Number(month), 0).toISOString().slice(0, 10);

    setLoading(true);
    Promise.all([
      api(`/events?from=${from}&to=${to}`),
      api(`/payments/summary?month=${month}&year=${year}`)
    ])
      .then(([eventItems, summaryData]) => {
        setEvents(eventItems);
        setSummary(summaryData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(load, [period]);

  const statusGroups = useMemo(() => groupCount(events, 'status'), [events]);
  const sourceGroups = useMemo(() => groupCount(events, 'source'), [events]);
  const closedEvents = events.filter((event) => ['agendado', 'confirmado', 'em_andamento', 'finalizado'].includes(event.status));
  const pendingFollowUps = events.filter((event) => ['orcamento_pendente', 'orcamento_enviado'].includes(normalizeStatus(event.status))).length;
  const received = summary?.receivedThisMonth || 0;
  const contracted = summary?.total || 0;
  const conversionRate = events.length > 0 ? Math.round((closedEvents.length / events.length) * 100) : 0;
  const averageClosedTicket = closedEvents.length > 0 ? contracted / closedEvents.length : 0;
  const topSource = Object.entries(sourceGroups).sort((a, b) => b[1] - a[1])[0];
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <section className="page ops-page reports-page">
      <div className="ops-header">
        <div>
          <span className="hero-eyebrow rose">Relatorios</span>
          <h1>Visao gerencial do estudio</h1>
          <p>Indicadores, funil e auditoria do periodo em uma tela limpa para decisao rapida.</p>
        </div>
        <div className="ops-header-control">
          <span>Periodo</span>
          <input type="month" value={period} onChange={(event) => setPeriod(event.target.value || currentPeriod())} />
        </div>
      </div>

      <div className="ops-metrics-grid">
        <OpsMetric icon={CalendarDays} label="Atendimentos" value={events.length} helper="Leads e eventos cadastrados" />
        <OpsMetric icon={Users} label="Fechados" value={closedEvents.length} helper={`${conversionRate}% de fechamento`} tone="success" />
        <OpsMetric icon={MessageCircle} label="Follow-up" value={pendingFollowUps} helper="Leads que pedem retorno" tone="warning" />
        <OpsMetric icon={DollarSign} label="Recebido" value={money.format(received)} helper="Entradas no periodo" tone="success" />
        <OpsMetric icon={TrendingUp} label="Ticket medio" value={money.format(averageClosedTicket)} helper="Por contrato fechado" />
      </div>

      <div className="ops-grid two">
        <OpsSection title="Funil por status" text="Distribuicao operacional dos atendimentos.">
          <div className="ops-bar-list">
            {Object.entries(statusGroups).map(([status, count]) => (
              <BarRow key={status} label={statusLabels[status] || status} value={count} total={events.length} />
            ))}
            {!events.length && !loading && <div className="ops-empty">Nenhum dado no periodo selecionado.</div>}
          </div>
        </OpsSection>

        <OpsSection title="Origem dos leads" text="Canais que trouxeram demanda no periodo.">
          <div className="ops-bar-list">
            {Object.entries(sourceGroups).map(([source, count]) => (
              <BarRow key={source} label={sourceLabels[source] || source} value={count} total={events.length} />
            ))}
            {!events.length && !loading && <div className="ops-empty">Nenhum canal registrado no periodo.</div>}
          </div>
        </OpsSection>
      </div>

      <OpsSection title="Atendimentos do periodo" text="Tabela gerencial para conferir status, origem e valor.">
        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Data</th>
                <th>Origem</th>
                <th>Status</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((event) => (
                <tr key={event._id}>
                  <td>{event.clientId?.name || 'Cliente sem nome'}</td>
                  <td>{event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'Sem data'}</td>
                  <td>{sourceLabels[event.source] || event.source || 'Origem nao informada'}</td>
                  <td>{statusLabels[normalizeStatus(event.status)] || event.status}</td>
                  <td>{money.format(Number(event.price || 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!events.length && !loading && <div className="ops-empty">Nenhum atendimento no periodo selecionado.</div>}
        </div>
      </OpsSection>

      <OpsSection title="Proximas acoes" text="Leitura rapida para agir sem abrir varias telas.">
        <div className="ops-insight-row">
          <article>
            <strong>Retornos comerciais</strong>
            <p>{pendingFollowUps} lead(s) precisam de follow-up. Comece por quem ja recebeu orcamento.</p>
          </article>
          <article>
            <strong>Canal mais forte</strong>
            <p>{topSource ? `${sourceLabels[topSource[0]] || topSource[0]} trouxe ${topSource[1]} atendimento(s).` : 'Ainda nao ha canal dominante neste periodo.'}</p>
          </article>
          <article>
            <strong>Saldo a receber</strong>
            <p>{money.format(summary?.pending || 0)} ainda aparece como saldo aberto em contratos fechados.</p>
          </article>
        </div>
      </OpsSection>
    </section>
  );
}
