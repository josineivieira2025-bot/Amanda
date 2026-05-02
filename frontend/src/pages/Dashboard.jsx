import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, Clock, DollarSign, MessageCircle, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { EventModal } from '../components/EventModal.jsx';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const typeLabels = {
  aniversario_15: 'Aniversario de 15',
  aniversario_adulto: 'Aniversario adulto',
  aniversario_infantil: 'Aniversario infantil',
  casamento: 'Casamento',
  cha_revelacao: 'Cha revelacao',
  cha_de_panela: 'Cha de panela',
  corporativo: 'Corporativo',
  smash_the_cake: 'Smash the cake',
  newborn: 'Newborn',
  ensaio_infantil: 'Ensaio infantil',
  ensaio_casal: 'Ensaio de casal',
  ensaio_casamento: 'Ensaio de casamento',
  ensaio_adulto: 'Ensaio adulto',
  ensaio_gestante: 'Ensaio gestante',
  ensaio_familia: 'Ensaio de familia',
  outro: 'Outro'
};

const statusLabels = {
  orcamento_pendente: 'Orcamento pendente',
  orcamento_enviado: 'Orcamento enviado',
  aguardando_resposta: 'Aguardando resposta',
  cliente_problema: 'Cliente problema',
  agendado: 'Agendado',
  confirmado: 'Confirmado',
  em_andamento: 'Em andamento',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado'
};

function statusTone(status = '') {
  if (['agendado', 'confirmado', 'finalizado'].includes(status)) return 'success';
  if (['orcamento_pendente', 'orcamento_enviado', 'aguardando_resposta'].includes(status)) return 'warning';
  if (['cliente_problema', 'cancelado'].includes(status)) return 'danger';
  return 'info';
}

function DashboardMetric({ icon: Icon, label, value, helper, tone = '' }) {
  return (
    <div className={`dashboard-metric ${tone}`}>
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </div>
  );
}

export function Dashboard() {
  const [data, setData] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    Promise.all([api('/events/dashboard'), api('/events')])
      .then(([dashboard, allEvents]) => {
        setData(dashboard);
        setEvents(allEvents);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const upcomingEvents = useMemo(
    () => [...(data?.upcomingEvents || [])].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [data]
  );

  const nextEvent = upcomingEvents[0];
  const revenue = data?.monthlyRevenue || 0;
  const eventsThisMonth = data?.eventsThisMonth || 0;
  const averageTicket = eventsThisMonth > 0 ? revenue / eventsThisMonth : 0;
  const waiting = events.filter((event) => event.status === 'aguardando_resposta').length;
  const pendingBudget = events.filter((event) => event.status === 'orcamento_pendente').length;
  const instagramLeads = events.filter((event) => event.source === 'instagram').length;

  return (
    <section className="page dashboard-rose-page">
      <div className="dashboard-rose-hero">
        <div>
          <span className="hero-eyebrow rose">{format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}</span>
          <h1>Painel Mel Fotografia</h1>
          <p>Uma visao rapida da agenda, orcamentos, clientes em espera e entradas financeiras do estudio.</p>
          <div className="hero-footer">
            <span className="hero-chip rose-chip"><Sparkles size={16} /> Operacao organizada</span>
            <span className="hero-chip rose-chip"><DollarSign size={16} /> {money.format(revenue)} recebido</span>
          </div>
        </div>

        <button className="dashboard-next-card clickable-card" type="button" onClick={() => nextEvent && setSelectedEvent(nextEvent)}>
          <span>Proximo compromisso</span>
          {nextEvent ? (
            <>
              <strong>{nextEvent.clientId?.name || 'Cliente nao informado'}</strong>
              <small>{format(new Date(nextEvent.date), "dd/MM 'as' HH:mm", { locale: ptBR })}</small>
              <i>{typeLabels[nextEvent.type] || nextEvent.type}</i>
            </>
          ) : (
            <>
              <strong>Agenda tranquila</strong>
              <small>Nenhum proximo evento cadastrado.</small>
            </>
          )}
        </button>
      </div>

      <div className="dashboard-metrics">
        {loading ? (
          <>
            <div className="loading-box" />
            <div className="loading-box" />
            <div className="loading-box" />
            <div className="loading-box" />
          </>
        ) : (
          <>
            <DashboardMetric icon={CalendarDays} label="Eventos no mes" value={eventsThisMonth} helper="Registros do periodo" />
            <DashboardMetric icon={DollarSign} label="Receita mensal" value={money.format(revenue)} helper="Pagamentos recebidos" tone="success" />
            <DashboardMetric icon={TrendingUp} label="Ticket medio" value={money.format(averageTicket)} helper="Media por evento" />
            <DashboardMetric icon={MessageCircle} label="Aguardando resposta" value={waiting} helper="Clientes para follow-up" tone="warning" />
          </>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="compact-head">
            <div>
              <h2>Proximos eventos</h2>
              <p>Compromissos mais proximos na agenda.</p>
            </div>
          </div>

          <div className="dashboard-event-list">
            {upcomingEvents.map((event) => (
              <button className="dashboard-event-card clickable-card" type="button" key={event._id} onClick={() => setSelectedEvent(event)}>
                <div className="date-box">
                  <strong>{format(new Date(event.date), 'dd')}</strong>
                  <span>{format(new Date(event.date), 'MMM', { locale: ptBR })}</span>
                </div>
                <div>
                  <strong>{event.clientId?.name || 'Cliente nao informado'}</strong>
                  <span><Clock size={15} /> {format(new Date(event.date), 'HH:mm')} - {typeLabels[event.type] || event.type}</span>
                </div>
                <small className={`badge ${statusTone(event.status)}`}>{statusLabels[event.status] || event.status}</small>
              </button>
            ))}
            {upcomingEvents.length === 0 && (
              <div className="empty-state">
                <strong>Nenhum evento futuro</strong>
                <p>Os proximos compromissos aparecem aqui.</p>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-side-stack">
          <div className="panel">
            <h2>Funil rapido</h2>
            <div className="summary-list">
              <div className="summary-item"><span>Orcamentos pendentes</span><strong>{pendingBudget}</strong></div>
              <div className="summary-item"><span>Aguardando resposta</span><strong>{waiting}</strong></div>
              <div className="summary-item"><span>Vieram do Instagram</span><strong>{instagramLeads}</strong></div>
              <div className="summary-item"><span>Agenda futura</span><strong>{upcomingEvents.length}</strong></div>
            </div>
          </div>

          <div className="dashboard-highlight">
            <span>Dica do dia</span>
            <strong>Revise os orcamentos sem resposta</strong>
            <p>Clientes em aguardando resposta podem receber uma mensagem carinhosa de acompanhamento para nao esfriar o contato.</p>
          </div>
        </div>
      </div>

      <EventModal
        event={selectedEvent}
        open={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        onSaved={load}
      />
    </section>
  );
}

