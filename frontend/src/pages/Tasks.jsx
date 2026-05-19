import { CheckCircle2, Clock, ListChecks, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const taskTemplates = [
  'Enviar orçamento',
  'Fazer follow-up',
  'Confirmar pagamento de entrada',
  'Separar contrato',
  'Confirmar local e horário',
  'Editar prévia',
  'Enviar galeria',
  'Entregar arquivos finais'
];

function taskKey(eventId, task) {
  return `task_${eventId}_${task}`;
}

export function Tasks() {
  const [events, setEvents] = useState([]);
  const [done, setDone] = useState({});

  useEffect(() => {
    api('/events').then(setEvents).catch(console.error);
    try {
      setDone(JSON.parse(localStorage.getItem('photo_erp_tasks') || '{}'));
    } catch {
      setDone({});
    }
  }, []);

  function toggle(eventId, task) {
    const key = taskKey(eventId, task);
    const next = { ...done, [key]: !done[key] };
    setDone(next);
    localStorage.setItem('photo_erp_tasks', JSON.stringify(next));
  }

  const activeEvents = useMemo(
    () => events
      .filter((event) => event.status !== 'cancelado')
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 12),
    [events]
  );

  const totalTasks = activeEvents.length * taskTemplates.length;
  const doneCount = activeEvents.reduce((sum, event) => (
    sum + taskTemplates.filter((task) => done[taskKey(event._id, task)]).length
  ), 0);

  return (
    <section className="page tasks-page">
      <div className="module-hero">
        <div>
          <span className="hero-eyebrow rose">Tarefas</span>
          <h1>Checklist operacional</h1>
          <p>Controle as etapas de orçamento, contrato, pagamento, edição e entrega por atendimento.</p>
        </div>
        <div className="module-hero-card">
          <span>Concluído</span>
          <strong>{totalTasks ? Math.round((doneCount / totalTasks) * 100) : 0}%</strong>
          <small>{doneCount} de {totalTasks} tarefas marcadas</small>
        </div>
      </div>

      <div className="tasks-grid">
        {activeEvents.map((event) => {
          const eventDone = taskTemplates.filter((task) => done[taskKey(event._id, task)]).length;
          return (
            <article className="task-event-card" key={event._id}>
              <div className="task-event-head">
                <div>
                  <strong>{event.clientId?.name || 'Cliente sem nome'}</strong>
                  <span>{event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'Data a confirmar'}</span>
                </div>
                <b>{eventDone}/{taskTemplates.length}</b>
              </div>
              <div className="task-list">
                {taskTemplates.map((task) => (
                  <label className="task-check" key={task}>
                    <input
                      type="checkbox"
                      checked={Boolean(done[taskKey(event._id, task)])}
                      onChange={() => toggle(event._id, task)}
                    />
                    <span>{task}</span>
                  </label>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      {!activeEvents.length && (
        <div className="empty-state">
          <ListChecks size={24} />
          <strong>Nenhum atendimento ativo</strong>
          <p>Quando houver eventos ou leads, os checklists aparecem aqui.</p>
        </div>
      )}
    </section>
  );
}
