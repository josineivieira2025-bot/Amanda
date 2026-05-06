import {
  addMonths,
  addWeeks,
  format,
  isSameMonth,
  isSameWeek,
  subMonths,
  subWeeks,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { CalendarBoard } from '../components/CalendarBoard.jsx';
import { EventModal } from '../components/EventModal.jsx';

function normalizeText(value = '') {
  return value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function isBlockedEvent(event) {
  const text = `${event?.type || ''} ${event?.status || ''}`;
  const normalized = normalizeText(text);

  return (
    normalized.includes('bloqueio') ||
    normalized.includes('bloqueado') ||
    normalized.includes('indisponivel')
  );
}

function isConfirmedEvent(event) {
  const normalized = normalizeText(event?.status || '');
  return ['confirmado', 'aprovado', 'pago', 'agendado'].includes(normalized);
}

function StatCard({ label, value, helper, tone = 'blue' }) {
  return (
    <div className={`agenda-stat-card ${tone}`}>
      <span className="agenda-stat-label">{label}</span>
      <strong className="agenda-stat-value">{value}</strong>
      {helper ? <small className="agenda-stat-helper">{helper}</small> : null}
    </div>
  );
}

export function Agenda() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('month');
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

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);

      if (mode === 'month') {
        return isSameMonth(eventDate, date);
      }

      return isSameWeek(eventDate, date, { weekStartsOn: 1 });
    });
  }, [events, date, mode]);

  const totalPeriod = filteredEvents.length;
  const blockedCount = filteredEvents.filter(isBlockedEvent).length;
  const confirmedCount = filteredEvents.filter(isConfirmedEvent).length;

  const monthLabel = format(date, "MMMM 'de' yyyy", { locale: ptBR });
  const weekLabel = `Semana de ${format(date, 'dd/MM', { locale: ptBR })}`;
  const periodLabel = mode === 'month' ? monthLabel : weekLabel;

  function handlePrevious() {
    setDate((current) =>
      mode === 'month' ? subMonths(current, 1) : subWeeks(current, 1)
    );
  }

  function handleNext() {
    setDate((current) =>
      mode === 'month' ? addMonths(current, 1) : addWeeks(current, 1)
    );
  }

  function handleToday() {
    setDate(new Date());
  }

  function openDay(day, dayEvents) {
    setSelectedDay({ day, events: dayEvents });
  }

  return (
    <>
      <style>{`
        .agenda-page {
          min-height: 100%;
          padding: 28px 0 0;
          display: grid;
          gap: 24px;
          background:
            radial-gradient(circle at top left, rgba(143, 207, 157, 0.18), transparent 26%),
            radial-gradient(circle at top right, rgba(210, 239, 217, 0.55), transparent 22%),
            linear-gradient(180deg, #f8fff9 0%, #edf8ef 100%);
        }

        .agenda-hero {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
        }

        .agenda-hero-card {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          padding: 28px;
          color: #fff;
          background: linear-gradient(135deg, #1f4d2d 0%, #4f9a64 48%, #8fcf9d 100%);
          box-shadow: 0 24px 60px rgba(31, 72, 43, 0.18);
        }

        .agenda-hero-card::after {
          content: "";
          position: absolute;
          top: -70px;
          right: -60px;
          width: 220px;
          height: 220px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
        }

        .agenda-eyebrow {
          display: inline-flex;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .agenda-hero-card h1 {
          margin: 14px 0 10px;
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .agenda-hero-card p {
          margin: 0;
          max-width: 720px;
          color: rgba(255,255,255,0.82);
          line-height: 1.7;
          font-size: 15px;
        }

        .agenda-hero-footer {
          margin-top: 24px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .agenda-chip {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          font-size: 14px;
          font-weight: 600;
        }

        .agenda-chip-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #34d399;
          box-shadow: 0 0 0 6px rgba(52, 211, 153, 0.15);
        }

        .agenda-side-card {
          border-radius: 28px;
          padding: 24px;
          background: rgba(255,255,255,0.78);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.65);
          box-shadow: 0 20px 50px rgba(31, 41, 55, 0.10);
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 14px;
        }

        .agenda-side-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #64748b;
        }

        .agenda-side-title {
          font-size: 24px;
          line-height: 1.2;
          font-weight: 800;
          color: #0f172a;
          text-transform: capitalize;
        }

        .agenda-side-text {
          color: #64748b;
          line-height: 1.7;
          font-size: 14px;
        }

        .agenda-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 20px;
          border-radius: 24px;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(255,255,255,0.65);
          backdrop-filter: blur(12px);
          box-shadow: 0 18px 40px rgba(31,41,55,0.08);
        }

        .agenda-toolbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .agenda-toolbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .agenda-nav-group {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px;
          border-radius: 999px;
          background: #f6fff7;
          border: 1px solid #d4ecd9;
        }

        .agenda-icon-button,
        .agenda-today-button,
        .agenda-mode-button {
          border: none;
          outline: none;
          cursor: pointer;
          transition: all .18s ease;
          font: inherit;
        }

        .agenda-icon-button {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: #fff;
          color: #0f172a;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.08);
        }

        .agenda-icon-button:hover {
          transform: translateY(-1px);
          background: #f8fafc;
        }

        .agenda-period-label {
          min-width: 170px;
          text-align: center;
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
          text-transform: capitalize;
          padding: 0 6px;
        }

        .agenda-today-button {
          padding: 10px 14px;
          border-radius: 999px;
          background: #edf9ef;
          color: #2f7042;
          font-weight: 700;
        }

        .agenda-today-button:hover {
          background: #dff3e4;
        }

        .agenda-mode-switch {
          display: inline-flex;
          align-items: center;
          padding: 5px;
          border-radius: 999px;
          background: #f6fff7;
          border: 1px solid #d4ecd9;
        }

        .agenda-mode-button {
          padding: 10px 14px;
          border-radius: 999px;
          background: transparent;
          color: #64748b;
          font-weight: 700;
        }

        .agenda-mode-button.active {
          background: linear-gradient(135deg, #76bd86 0%, #2f7042 100%);
          color: #fff;
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.22);
        }

        .agenda-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .agenda-stat-card {
          position: relative;
          overflow: hidden;
          min-height: 130px;
          border-radius: 24px;
          padding: 20px;
          background: rgba(255,255,255,0.86);
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 18px 40px rgba(31,41,55,0.08);
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .agenda-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 50px rgba(31,41,55,0.12);
        }

        .agenda-stat-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
        }

        .agenda-stat-card.blue::before {
          background: linear-gradient(90deg, #b9e7c2, #76bd86);
        }

        .agenda-stat-card.green::before {
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .agenda-stat-card.violet::before {
          background: linear-gradient(90deg, #8b5cf6, #6366f1);
        }

        .agenda-stat-label {
          display: block;
          margin-bottom: 14px;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
        }

        .agenda-stat-value {
          display: block;
          font-size: 34px;
          line-height: 1;
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .agenda-stat-helper {
          display: block;
          margin-top: 12px;
          color: #6b7280;
          font-size: 13px;
        }

        .agenda-calendar-shell {
          border-radius: 28px;
          padding: 22px;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(255,255,255,0.65);
          backdrop-filter: blur(12px);
          box-shadow: 0 20px 50px rgba(31,41,55,0.08);
        }

        .agenda-calendar-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .agenda-calendar-title h2 {
          margin: 0;
          color: #0f172a;
          font-size: 1.35rem;
        }

        .agenda-calendar-title p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .agenda-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .agenda-legend-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: #f6fff7;
          border: 1px solid #d4ecd9;
          color: #475569;
          font-size: 13px;
          font-weight: 600;
        }

        .agenda-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
        }

        .agenda-legend-dot.evento {
          background: #76bd86;
        }

        .agenda-legend-dot.bloqueio {
          background: #f59e0b;
        }

        .agenda-calendar-body {
          border-radius: 22px;
          background: linear-gradient(180deg, rgba(248,251,255,0.9) 0%, rgba(255,255,255,0.95) 100%);
          border: 1px solid #d4ecd9;
          padding: 14px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .agenda-loading {
          height: 520px;
          border-radius: 20px;
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.72),
            rgba(255,255,255,0.96),
            rgba(255,255,255,0.72)
          );
          background-size: 200% 100%;
          animation: agendaShimmer 1.3s linear infinite;
        }

        @keyframes agendaShimmer {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }

        @media (max-width: 1100px) {
          .agenda-hero {
            grid-template-columns: 1fr;
          }

          .agenda-stats-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 720px) {
          .agenda-page {
            padding: 0;
            gap: 16px;
          }

          .agenda-toolbar {
            align-items: stretch;
            padding: 14px;
            border-radius: 20px;
          }

          .agenda-toolbar-left,
          .agenda-toolbar-right {
            width: 100%;
            justify-content: space-between;
          }

          .agenda-nav-group {
            width: 100%;
            justify-content: space-between;
          }

          .agenda-period-label {
            min-width: auto;
            flex: 1;
          }

          .agenda-stats-grid {
            grid-template-columns: 1fr;
          }

          .agenda-hero-card,
          .agenda-side-card,
          .agenda-calendar-shell {
            border-radius: 22px;
            padding: 20px;
          }

          .agenda-hero-card h1 {
            font-size: 31px;
          }

          .agenda-calendar-body {
            padding: 10px;
          }

          .agenda-calendar-title h2 {
            font-size: 1.15rem;
          }
        }

        @media (max-width: 520px) {
          .agenda-hero-card p,
          .agenda-side-text {
            font-size: 14px;
            line-height: 1.55;
          }

          .agenda-side-title {
            font-size: 21px;
          }

          .agenda-toolbar-left,
          .agenda-toolbar-right,
          .agenda-mode-switch,
          .agenda-today-button {
            width: 100%;
          }

          .agenda-mode-button {
            flex: 1;
          }

          .agenda-stat-card {
            min-height: 108px;
            padding: 18px;
            border-radius: 20px;
          }

          .agenda-stat-value {
            font-size: 29px;
          }
        }
      `}</style>

      <section className="agenda-page">
        <div className="agenda-hero">
          <div className="agenda-hero-card">
            <span className="agenda-eyebrow">Agenda inteligente</span>

            <h1>Agenda</h1>
            <p>
              Controle sua programação com uma visualização mais moderna,
              elegante e clara dos eventos, bloqueios e compromissos agendados.
            </p>

            <div className="agenda-hero-footer">
              <div className="agenda-chip">
                <span className="agenda-chip-dot" />
                Organização em tempo real
              </div>

              <div className="agenda-chip">
                {mode === 'month' ? 'Visualização mensal' : 'Visualização semanal'}
              </div>
            </div>
          </div>

          <div className="agenda-side-card">
            <span className="agenda-side-label">Período atual</span>
            <div className="agenda-side-title">{periodLabel}</div>
            <div className="agenda-side-text">
              Veja rapidamente os compromissos do período selecionado e alterne
              entre a visão mensal e semanal com uma navegação mais fluida.
            </div>
          </div>
        </div>

        <div className="agenda-toolbar">
          <div className="agenda-toolbar-left">
            <div className="agenda-nav-group">
              <button className="agenda-icon-button" onClick={handlePrevious}>
                <ChevronLeft size={18} />
              </button>

              <strong className="agenda-period-label">{periodLabel}</strong>

              <button className="agenda-icon-button" onClick={handleNext}>
                <ChevronRight size={18} />
              </button>
            </div>

            <button className="agenda-today-button" onClick={handleToday}>
              Hoje
            </button>
          </div>

          <div className="agenda-toolbar-right">
            <div className="agenda-mode-switch">
              <button
                className={`agenda-mode-button ${mode === 'month' ? 'active' : ''}`}
                onClick={() => setMode('month')}
              >
                Mensal
              </button>

              <button
                className={`agenda-mode-button ${mode === 'week' ? 'active' : ''}`}
                onClick={() => setMode('week')}
              >
                Semanal
              </button>
            </div>
          </div>
        </div>

        <div className="agenda-stats-grid">
          <StatCard
            label={mode === 'month' ? 'Eventos no mês' : 'Eventos na semana'}
            value={totalPeriod}
            helper="Total de registros no período"
            tone="blue"
          />

          <StatCard
            label="Confirmados"
            value={confirmedCount}
            helper="Compromissos com status positivo"
            tone="green"
          />

          <StatCard
            label="Bloqueios"
            value={blockedCount}
            helper="Datas ou horários indisponíveis"
            tone="violet"
          />
        </div>

        <div className="agenda-calendar-shell">
          <div className="agenda-calendar-head">
            <div className="agenda-calendar-title">
              <h2>Calendário visual</h2>
              <p>Calendário com bloqueios e eventos agendados</p>
            </div>

            <div className="agenda-legend">
              <span className="agenda-legend-item">
                <span className="agenda-legend-dot evento" />
                Evento
              </span>

              <span className="agenda-legend-item">
                <span className="agenda-legend-dot bloqueio" />
                Bloqueio
              </span>
            </div>
          </div>

          <div className="agenda-calendar-body">
            {loading ? (
              <div className="agenda-loading" />
            ) : (
              <CalendarBoard date={date} events={events} mode={mode} onSelectDay={openDay} />
            )}
          </div>
        </div>

        {selectedDay && (
          <div className="day-drawer">
            <div className="day-drawer-card">
              <div className="compact-head">
                <div>
                  <h2>{format(selectedDay.day, "dd 'de' MMMM", { locale: ptBR })}</h2>
                  <p>{selectedDay.events.length} evento(s) nesse dia</p>
                </div>
                <button className="icon-button" type="button" onClick={() => setSelectedDay(null)} aria-label="Fechar">
                  <X size={18} />
                </button>
              </div>

              <div className="day-event-list">
                {selectedDay.events.map((event) => (
                  <button className="day-event-card clickable-card" type="button" key={event._id} onClick={() => setSelectedEvent(event)}>
                    <strong>{event.clientId?.name || 'Cliente sem nome'}</strong>
                    <span><CalendarDays size={15} />{event.type}</span>
                    <span><Clock size={15} />{format(new Date(event.date), 'HH:mm')} {event.endDate ? `- ${format(new Date(event.endDate), 'HH:mm')}` : ''}</span>
                    <span><MapPin size={15} />{event.location}</span>
                    <small>{event.status}</small>
                  </button>
                ))}
                {selectedDay.events.length === 0 && (
                  <div className="empty-state">
                    <strong>Nenhum evento</strong>
                    <p>Essa data esta livre na agenda.</p>
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
    </>
  );
}
