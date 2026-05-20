import {
  addMonths,
  addWeeks,
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  startOfDay,
  subMonths,
  subWeeks
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { CalendarBoard } from '../components/CalendarBoard.jsx';
import { EventModal } from '../components/EventModal.jsx';

const statusLabels = {
  orcamento_pendente: 'Orçamento pendente',
  orcamento_enviado: 'Orcamento enviado / aguardando resposta',
  cliente_problema: 'Cliente problema',
  agendado: 'Agendado',
  confirmado: 'Confirmado',
  em_andamento: 'Em andamento',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado'
};

const typeLabels = {
  aniversario_15: 'Aniversário de 15',
  aniversario_adulto: 'Aniversário adulto',
  aniversario_infantil: 'Aniversário infantil',
  casamento: 'Casamento',
  cha_revelacao: 'Chá revelação',
  cha_de_panela: 'Chá de panela',
  corporativo: 'Corporativo',
  smash_the_cake: 'Smash the cake',
  newborn: 'Newborn',
  ensaio_infantil: 'Ensaio infantil',
  ensaio_casal: 'Ensaio de casal',
  ensaio_casamento: 'Ensaio de casamento',
  ensaio_adulto: 'Ensaio adulto',
  ensaio_gestante: 'Ensaio gestante',
  ensaio_familia: 'Ensaio de família',
  outro: 'Outro'
};

function normalizeText(value = '') {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function isBlockedEvent(event) {
  const normalized = normalizeText(`${event?.type || ''} ${event?.status || ''}`);
  return event?.isBlocked || normalized.includes('bloqueio') || normalized.includes('bloqueado') || normalized.includes('indisponivel');
}

function isClosedEvent(event) {
  return ['agendado', 'confirmado', 'em_andamento', 'finalizado'].includes(event?.status);
}

function normalizeStatus(status = '') {
  return status === 'aguardando_resposta' ? 'orcamento_enviado' : status;
}

function statusTone(status = '') {
  if (['agendado', 'confirmado', 'em_andamento', 'finalizado'].includes(status)) return 'success';
  if (['orcamento_pendente', 'orcamento_enviado', 'aguardando_resposta'].includes(status)) return 'warning';
  if (['cliente_problema', 'cancelado'].includes(status)) return 'danger';
  return 'info';
}

function AgendaStat({ label, value, helper }) {
  return (
    <div className="agenda-pro-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </div>
  );
}

export function Agenda() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('month');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  function load() {
    setLoading(true);
    api('/events')
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const periodEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return mode === 'month'
        ? isSameMonth(eventDate, date)
        : isSameWeek(eventDate, date, { weekStartsOn: 1 });
    });
  }, [events, date, mode]);

  const filteredEvents = useMemo(() => {
    const term = normalizeText(search);
    return periodEvents
      .filter((event) => (statusFilter ? normalizeStatus(event.status) === statusFilter : true))
      .filter((event) => {
        if (!term) return true;
        return normalizeText(`${event.clientId?.name || ''} ${event.location || ''} ${event.type || ''}`).includes(term);
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [periodEvents, search, statusFilter]);

  const upcomingEvents = useMemo(
    () => events
      .filter((event) => new Date(event.date) >= startOfDay(new Date()))
      .filter((event) => event.status !== 'cancelado')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5),
    [events]
  );

  const selectedDayEvents = selectedDay?.events || [];
  const closedCount = periodEvents.filter(isClosedEvent).length;
  const blockedCount = periodEvents.filter(isBlockedEvent).length;
  const leadCount = periodEvents.filter((event) => ['orcamento_pendente', 'orcamento_enviado'].includes(normalizeStatus(event.status))).length;
  const periodLabel = mode === 'month'
    ? format(date, "MMMM 'de' yyyy", { locale: ptBR })
    : `Semana de ${format(date, 'dd/MM', { locale: ptBR })}`;

  function handlePrevious() {
    setDate((current) => (mode === 'month' ? subMonths(current, 1) : subWeeks(current, 1)));
  }

  function handleNext() {
    setDate((current) => (mode === 'month' ? addMonths(current, 1) : addWeeks(current, 1)));
  }

  function openDay(day, dayEvents) {
    setSelectedDay({ day, events: dayEvents });
  }

  return (
    <section className="page agenda-pro-page">
      <div className="agenda-pro-header">
        <div>
          <span className="hero-eyebrow rose">Agenda</span>
          <h1>Calendário operacional</h1>
          <p>Visualize compromissos, bloqueios e leads do período com filtros rápidos e uma leitura mais clara da semana.</p>
        </div>
        <div className="agenda-pro-period-card">
          <span>Período atual</span>
          <strong>{periodLabel}</strong>
          <small>{filteredEvents.length} item(ns) visíveis com os filtros atuais</small>
        </div>
      </div>

      <div className="agenda-pro-toolbar">
        <div className="agenda-nav-group">
          <button className="agenda-icon-button" onClick={handlePrevious} type="button" aria-label="Período anterior">
            <ChevronLeft size={18} />
          </button>
          <strong className="agenda-period-label">{periodLabel}</strong>
          <button className="agenda-icon-button" onClick={handleNext} type="button" aria-label="Próximo período">
            <ChevronRight size={18} />
          </button>
        </div>

        <button className="agenda-today-button" onClick={() => setDate(new Date())} type="button">Hoje</button>

        <div className="agenda-mode-switch">
          <button className={`agenda-mode-button ${mode === 'month' ? 'active' : ''}`} onClick={() => setMode('month')} type="button">Mensal</button>
          <button className={`agenda-mode-button ${mode === 'week' ? 'active' : ''}`} onClick={() => setMode('week')} type="button">Semanal</button>
        </div>
      </div>

      <div className="agenda-pro-stats">
        <AgendaStat label="Total no período" value={periodEvents.length} helper="Eventos, leads e bloqueios" />
        <AgendaStat label="Compromissos firmes" value={closedCount} helper="Agendados, confirmados e finalizados" />
        <AgendaStat label="Leads em negociação" value={leadCount} helper="Orçamentos e respostas pendentes" />
        <AgendaStat label="Bloqueios" value={blockedCount} helper="Datas ou horários indisponíveis" />
      </div>

      <div className="agenda-pro-content">
        <div className="panel agenda-pro-calendar-panel">
          <div className="compact-head">
            <div>
              <h2>Calendário</h2>
              <p>Clique em um dia para ver os detalhes dos compromissos.</p>
            </div>
            <div className="agenda-legend">
              <span><i className="agenda-dot event" /> Evento</span>
              <span><i className="agenda-dot lead" /> Lead</span>
              <span><i className="agenda-dot block" /> Bloqueio</span>
            </div>
          </div>

          <div className="agenda-calendar-body">
            {loading ? <div className="agenda-loading" /> : <CalendarBoard date={date} events={filteredEvents} mode={mode} onSelectDay={openDay} />}
          </div>
        </div>

        <aside className="agenda-pro-side">
          <div className="panel agenda-filter-panel">
            <div className="compact-head">
              <div>
                <h2>Filtros</h2>
                <p>Encontre rapidamente cliente, local ou status.</p>
              </div>
            </div>

            <div className="search-box">
              <Search size={17} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar cliente, local ou tipo..." />
            </div>

            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">Todos os status</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option value={value} key={value}>{label}</option>
              ))}
            </select>
          </div>

          <div className="panel agenda-list-panel">
            <div className="compact-head">
              <div>
                <h2>Próximos</h2>
                <p>Os compromissos mais próximos da agenda.</p>
              </div>
            </div>

            <div className="agenda-compact-list">
              {upcomingEvents.map((event) => (
                <button className="agenda-compact-card clickable-card" type="button" key={event._id} onClick={() => setSelectedEvent(event)}>
                  <div className="date-box">
                    <strong>{format(new Date(event.date), 'dd')}</strong>
                    <span>{format(new Date(event.date), 'MMM', { locale: ptBR })}</span>
                  </div>
                  <div>
                    <strong>{event.clientId?.name || 'Cliente sem nome'}</strong>
                    <span>{format(new Date(event.date), 'HH:mm')} - {typeLabels[event.type] || event.type}</span>
                    <small className={`badge ${statusTone(event.status)}`}>{statusLabels[normalizeStatus(event.status)] || event.status}</small>
                  </div>
                </button>
              ))}
              {!upcomingEvents.length && (
                <div className="empty-state">
                  <strong>Nenhum compromisso futuro</strong>
                  <p>Os próximos eventos aparecem aqui.</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      {selectedDay && (
        <div className="day-drawer">
          <div className="day-drawer-card agenda-day-drawer">
            <div className="compact-head">
              <div>
                <h2>{format(selectedDay.day, "dd 'de' MMMM", { locale: ptBR })}</h2>
                <p>{selectedDayEvents.length} item(ns) nesse dia</p>
              </div>
              <button className="icon-button" type="button" onClick={() => setSelectedDay(null)} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <div className="day-event-list">
              {selectedDayEvents.map((event) => (
                <button className="day-event-card clickable-card" type="button" key={event._id} onClick={() => setSelectedEvent(event)}>
                  <strong>{event.clientId?.name || 'Cliente sem nome'}</strong>
                  <span><CalendarDays size={15} /> {typeLabels[event.type] || event.type}</span>
                  <span><Clock size={15} /> {format(new Date(event.date), 'HH:mm')} {event.endDate ? `- ${format(new Date(event.endDate), 'HH:mm')}` : ''}</span>
                  <span><MapPin size={15} /> {event.location || 'Local a confirmar'}</span>
                  <small className={`badge ${statusTone(event.status)}`}>{statusLabels[normalizeStatus(event.status)] || event.status}</small>
                </button>
              ))}
              {!selectedDayEvents.length && (
                <div className="empty-state">
                  <strong>Nenhum evento</strong>
                  <p>Essa data está livre na agenda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <EventModal
        event={selectedEvent}
        open={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        onSaved={load}
      />
    </section>
  );
}
