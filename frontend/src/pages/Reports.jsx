import { BarChart3, CalendarDays, DollarSign, MessageCircle, TrendingUp, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const statusLabels = {
  orcamento_pendente: 'Orçamentos pendentes',
  orcamento_enviado: 'Orcamentos enviados / aguardando resposta',
  cliente_problema: 'Clientes sensíveis',
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
  indicacao: 'Indicação',
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

function BarRow({ label, value, total }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="report-bar-row">
      <div>
        <strong>{label}</strong>
        <span>{value} registro(s)</span>
      </div>
      <div className="report-bar-track"><i style={{ width: `${percent}%` }} /></div>
      <b>{percent}%</b>
    </div>
  );
}

function ReportMetric({ icon: Icon, label, value, helper, tone = '' }) {
  return (
    <div className={`report-metric ${tone}`}>
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </div>
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
  const leads = events.filter((event) => ['orcamento_pendente', 'orcamento_enviado'].includes(normalizeStatus(event.status)));
  const conversionRate = events.length > 0 ? Math.round((closedEvents.length / events.length) * 100) : 0;
  const pendingFollowUps = events.filter((event) => ['orcamento_pendente', 'orcamento_enviado'].includes(normalizeStatus(event.status))).length;
  const received = summary?.receivedThisMonth || 0;
  const contracted = summary?.total || 0;
  const averageClosedTicket = closedEvents.length > 0 ? contracted / closedEvents.length : 0;
  const topSource = Object.entries(sourceGroups).sort((a, b) => b[1] - a[1])[0];

  return (
    <section className="page reports-page">
      <div className="reports-hero">
        <div>
          <span className="hero-eyebrow rose">Relatórios</span>
          <h1>Visão gerencial do estúdio</h1>
          <p>Analise captação, fechamento, receita e gargalos do mês com dados simples de agir.</p>
        </div>
        <div className="reports-period-card">
          <span>Período</span>
          <input type="month" value={period} onChange={(event) => setPeriod(event.target.value || currentPeriod())} />
          <strong>{conversionRate}%</strong>
          <small>taxa de fechamento do período</small>
        </div>
      </div>

      <div className="report-metrics-grid">
        <ReportMetric icon={CalendarDays} label="Atendimentos" value={events.length} helper="Eventos e leads cadastrados" />
        <ReportMetric icon={Users} label="Fechados" value={closedEvents.length} helper="Agendados, confirmados e finalizados" tone="success" />
        <ReportMetric icon={MessageCircle} label="Follow-up" value={pendingFollowUps} helper="Leads que pedem retorno" tone="warning" />
        <ReportMetric icon={DollarSign} label="Recebido" value={money.format(received)} helper="Entradas no mês selecionado" tone="success" />
        <ReportMetric icon={TrendingUp} label="Ticket fechado" value={money.format(averageClosedTicket)} helper="Média por contrato fechado" />
      </div>

      <div className="reports-grid">
        <div className="panel report-panel">
          <div className="compact-head">
            <div>
              <h2>Funil por status</h2>
              <p>Onde estão os atendimentos do período.</p>
            </div>
            <BarChart3 size={20} />
          </div>
          <div className="report-bar-list">
            {Object.entries(statusGroups).map(([status, count]) => (
              <BarRow key={status} label={statusLabels[status] || status} value={count} total={events.length} />
            ))}
            {!events.length && !loading && (
              <div className="empty-state">
                <strong>Nenhum dado no período</strong>
                <p>Cadastre eventos ou altere o mês para ver os relatórios.</p>
              </div>
            )}
          </div>
        </div>

        <div className="panel report-panel">
          <div className="compact-head">
            <div>
              <h2>Origem dos leads</h2>
              <p>Canais que mais trouxeram atendimentos.</p>
            </div>
          </div>
          <div className="report-bar-list">
            {Object.entries(sourceGroups).map(([source, count]) => (
              <BarRow key={source} label={sourceLabels[source] || source} value={count} total={events.length} />
            ))}
          </div>
        </div>

        <div className="panel report-panel report-insights">
          <div className="compact-head">
            <div>
              <h2>Próximas ações</h2>
              <p>Sugestões geradas a partir dos dados do mês.</p>
            </div>
          </div>

          <div className="report-insight-list">
            <article>
              <strong>Priorize retornos comerciais</strong>
              <p>{pendingFollowUps} lead(s) ainda precisam de follow-up. Comece por quem já recebeu orçamento.</p>
            </article>
            <article>
              <strong>Reforce o canal que mais converte</strong>
              <p>{topSource ? `${sourceLabels[topSource[0]] || topSource[0]} trouxe ${topSource[1]} atendimento(s).` : 'Ainda não há canal dominante neste período.'}</p>
            </article>
            <article>
              <strong>Use o financeiro como checklist</strong>
              <p>{money.format(summary?.pending || 0)} ainda aparece como saldo a receber em contratos fechados.</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
