import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarDays,
  Clock,
  DollarSign,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Users,
  WalletCards,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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

const sourceLabels = {
  instagram: 'Instagram',
  site: 'Site',
  whatsapp: 'WhatsApp',
  indicacao: 'Indicacao',
  google: 'Google',
  outro: 'Outro'
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

function QuickActionCard({ to, icon: Icon, title, text }) {
  return (
    <Link className="dashboard-action-card" to={to}>
      <span className="dashboard-action-icon"><Icon size={18} /></span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <ArrowRight size={18} />
    </Link>
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
  const todayEvents = upcomingEvents.filter((event) => isSameDay(new Date(event.date), new Date()));
  const confirmedUpcoming = upcomingEvents.filter((event) => ['agendado', 'confirmado', 'finalizado'].includes(event.status)).length;
  const followUpRate = waiting + pendingBudget > 0 ? Math.min(100, Math.round((waiting / (waiting + pendingBudget)) * 100)) : 0;
  const bookingRate = upcomingEvents.length > 0 ? Math.round((confirmedUpcoming / upcomingEvents.length) * 100) : 0;
  const monthlyGoal = 12000;
  const goalProgress = Math.min(100, Math.round((revenue / monthlyGoal) * 100));

  const quickActions = [
    {
      to: '/painel/agenda',
      icon: CalendarDays,
      title: 'Organizar agenda',
      text: 'Veja o mes, mova prioridades e confira horarios livres.'
    },
    {
      to: '/painel/eventos',
      icon: Sparkles,
      title: 'Responder leads',
      text: 'Aqueça conversas pendentes e converta orcamentos mais rapido.'
    },
    {
      to: '/painel/clientes',
      icon: Users,
      title: 'Cuidar dos clientes',
      text: 'Acesse historico, preferencias e relacionamento do estudio.'
    },
    {
      to: '/painel/financeiro',
      icon: WalletCards,
      title: 'Revisar financeiro',
      text: 'Acompanhe entradas, ticket medio e caixa do periodo.'
    }
  ];

  return (
    <section className="page dashboard-rose-page dashboard-luxe-page">
      <div className="dashboard-rose-hero dashboard-luxe-hero">
        <div className="dashboard-luxe-copy">
          <span className="hero-eyebrow rose">{format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}</span>
          <h1>Painel Mel Fotografia</h1>
          <p>
            Uma visao linda e inteligente da sua operacao: agenda, leads, clientes e faturamento organizados para voce ganhar tempo e encantar mais.
          </p>

          <div className="hero-footer">
            <span className="hero-chip rose-chip"><Sparkles size={16} /> Operacao organizada</span>
            <span className="hero-chip rose-chip"><DollarSign size={16} /> {money.format(revenue)} recebido</span>
            <span className="hero-chip rose-chip"><MessageCircle size={16} /> {waiting + pendingBudget} contato(s) pedindo atencao</span>
          </div>

          <div className="dashboard-luxe-glance">
            <div className="dashboard-glance-card">
              <span>Hoje</span>
              <strong>{todayEvents.length}</strong>
              <small>compromisso(s)</small>
            </div>
            <div className="dashboard-glance-card">
              <span>Confirmacao</span>
              <strong>{bookingRate}%</strong>
              <small>agenda futura firme</small>
            </div>
            <div className="dashboard-glance-card">
              <span>Meta do mes</span>
              <strong>{goalProgress}%</strong>
              <small>do objetivo de {money.format(monthlyGoal)}</small>
            </div>
          </div>
        </div>

        <button className="dashboard-next-card dashboard-luxe-next clickable-card" type="button" onClick={() => nextEvent && setSelectedEvent(nextEvent)}>
          <span>Proximo compromisso</span>
          {nextEvent ? (
            <>
              <strong>{nextEvent.clientId?.name || 'Cliente nao informado'}</strong>
              <small>{format(new Date(nextEvent.date), "dd/MM 'as' HH:mm", { locale: ptBR })}</small>
              <i>{typeLabels[nextEvent.type] || nextEvent.type}</i>
              <div className="dashboard-next-meta">
                <span><MapPin size={14} /> {nextEvent.location || 'Local a confirmar'}</span>
                <small>Origem: {sourceLabels[nextEvent.source] || 'Nao informada'}</small>
              </div>
            </>
          ) : (
            <>
              <strong>Agenda tranquila</strong>
              <small>Nenhum proximo evento cadastrado.</small>
              <div className="dashboard-next-meta">
                <span><Sparkles size={14} /> Aproveite para cuidar dos leads</span>
                <small>Seu painel continua prontinho para novos pedidos.</small>
              </div>
            </>
          )}
        </button>
      </div>

      <div className="dashboard-metrics dashboard-luxe-metrics">
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

      <div className="dashboard-quick-actions">
        {quickActions.map((action) => (
          <QuickActionCard key={action.to} {...action} />
        ))}
      </div>

      <div className="dashboard-grid dashboard-luxe-grid">
        <div className="panel luxe-panel">
          <div className="compact-head compact-head-luxe">
            <div>
              <h2>Proximos eventos</h2>
              <p>Compromissos mais proximos na agenda com acesso rapido aos detalhes.</p>
            </div>
            <Link className="mini-link-button" to="/painel/agenda">Abrir agenda</Link>
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
          <div className="panel luxe-panel dashboard-insight-panel">
            <div className="compact-head compact-head-luxe">
              <div>
                <h2>Radar comercial</h2>
                <p>Uma leitura rapida para decidir onde agir primeiro.</p>
              </div>
            </div>

            <div className="dashboard-radar-list">
              <div className="dashboard-radar-item">
                <div>
                  <strong>Orcamentos pendentes</strong>
                  <span>{pendingBudget} oportunidade(s) esperando resposta</span>
                </div>
                <b>{pendingBudget}</b>
              </div>
              <div className="dashboard-radar-track"><span style={{ width: `${Math.min(100, pendingBudget * 12)}%` }} /></div>

              <div className="dashboard-radar-item">
                <div>
                  <strong>Aguardando resposta</strong>
                  <span>{waiting} conversa(s) mornas para reacender</span>
                </div>
                <b>{waiting}</b>
              </div>
              <div className="dashboard-radar-track warning"><span style={{ width: `${Math.max(12, followUpRate)}%` }} /></div>

              <div className="dashboard-radar-item">
                <div>
                  <strong>Vieram do Instagram</strong>
                  <span>{instagramLeads} lead(s) no canal que mais aquece desejo</span>
                </div>
                <b>{instagramLeads}</b>
              </div>
              <div className="dashboard-radar-track accent"><span style={{ width: `${Math.min(100, Math.max(14, instagramLeads * 10))}%` }} /></div>
            </div>
          </div>

          <div className="dashboard-highlight dashboard-luxe-highlight">
            <span>Dica do dia</span>
            <strong>Capriche no follow-up mais quente</strong>
            <p>
              Se o cliente ja pediu orcamento e ficou em silencio, envie uma mensagem gentil com disponibilidade, prazo de entrega e um toque afetivo. Esse passo costuma destravar a venda.
            </p>
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
