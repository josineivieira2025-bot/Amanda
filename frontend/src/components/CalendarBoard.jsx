import { addDays, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, startOfMonth, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const typeLabels = {
  aniversario_15: 'Aniv. 15',
  aniversario_adulto: 'Aniv. adulto',
  aniversario_infantil: 'Aniv. infantil',
  casamento: 'Casamento',
  cha_revelacao: 'Cha revelacao',
  cha_de_panela: 'Cha de panela',
  corporativo: 'Corporativo',
  smash_the_cake: 'Smash',
  newborn: 'Newborn',
  ensaio_infantil: 'Ensaio infantil',
  ensaio_casal: 'Ensaio casal',
  ensaio_casamento: 'Ensaio casamento',
  ensaio_adulto: 'Ensaio adulto',
  ensaio_gestante: 'Gestante',
  ensaio_familia: 'Familia',
  outro: 'Outro'
};

export function CalendarBoard({ date = new Date(), events = [], mode = 'month', onSelectDay }) {
  const start = mode === 'week' ? startOfWeek(date, { weekStartsOn: 0 }) : startOfWeek(startOfMonth(date), { weekStartsOn: 0 });
  const end = mode === 'week' ? addDays(start, 6) : endOfWeek(endOfMonth(date), { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start, end });

  return (
    <div className={`calendar-grid ${mode}`}>
      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day) => (
        <div className="calendar-head" key={day}>{day}</div>
      ))}
      {days.map((day) => {
        const dayEvents = events.filter((event) => isSameDay(new Date(event.date), day));
        return (
          <button className="calendar-day" key={day.toISOString()} type="button" onClick={() => onSelectDay?.(day, dayEvents)}>
            <span>{format(day, 'd', { locale: ptBR })}</span>
            {dayEvents.slice(0, 3).map((event) => (
              <small key={event._id} className={event.isBlocked ? 'blocked' : ''}>
                {event.isBlocked ? 'Bloqueado' : typeLabels[event.type] || event.type}
              </small>
            ))}
            {dayEvents.length > 3 && <small>+{dayEvents.length - 3} eventos</small>}
          </button>
        );
      })}
    </div>
  );
}
