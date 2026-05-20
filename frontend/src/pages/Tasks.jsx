import { ListChecks } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const taskTemplates = [
  'Enviar orcamento',
  'Fazer follow-up',
  'Confirmar pagamento de entrada',
  'Separar contrato',
  'Confirmar local e horario',
  'Editar previa',
  'Enviar galeria',
  'Entregar arquivos finais'
];

function taskKey(eventId, task) {
  return `task_${eventId}_${task}`;
}

export function Tasks() {
  const [events, setEvents] = useState([]);
  const [done, setDone] = useState({});
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    api('/events')
      .then((items) => {
        const active = items
          .filter((event) => event.status !== 'cancelado')
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(active);
        setSelectedId(active[0]?._id || '');
      })
      .catch(console.error);
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

  const selectedEvent = useMemo(() => events.find((event) => event._id === selectedId) || events[0], [events, selectedId]);
  const totalTasks = events.length * taskTemplates.length;
  const doneCount = events.reduce((sum, event) => (
    sum + taskTemplates.filter((task) => done[taskKey(event._id, task)]).length
  ), 0);

  return (
    <section className="page ops-page">
      <div className="ops-header">
        <div>
          <span className="hero-eyebrow rose">Tarefas</span>
          <h1>Checklist operacional</h1>
          <p>Controle pendencias de atendimento, contrato, pagamento, edicao e entrega.</p>
        </div>
        <div className="ops-header-control">
          <span>Concluido</span>
          <strong>{totalTasks ? Math.round((doneCount / totalTasks) * 100) : 0}%</strong>
        </div>
      </div>

      <div className="ops-workspace">
        <section className="ops-section">
          <div className="ops-section-head">
            <div>
              <h2>Atendimentos ativos</h2>
              <p>Selecione uma linha para revisar o checklist.</p>
            </div>
          </div>
          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Progresso</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const finished = taskTemplates.filter((task) => done[taskKey(event._id, task)]).length;
                  return (
                    <tr key={event._id} className={selectedEvent?._id === event._id ? 'selected-row' : ''} onClick={() => setSelectedId(event._id)}>
                      <td>{event.clientId?.name || 'Cliente sem nome'}</td>
                      <td>{event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'Sem data'}</td>
                      <td>{event.status}</td>
                      <td>{finished}/{taskTemplates.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!events.length && <div className="ops-empty">Nenhum atendimento ativo.</div>}
          </div>
        </section>

        <aside className="ops-inspector">
          <section className="ops-section">
            <div className="ops-section-head">
              <div>
                <h2>Checklist</h2>
                <p>{selectedEvent?.clientId?.name || 'Selecione um atendimento'}</p>
              </div>
              <ListChecks size={18} />
            </div>
            {selectedEvent ? (
              <div className="ops-check-list">
                {taskTemplates.map((task) => (
                  <label className="ops-check-row" key={task}>
                    <input
                      type="checkbox"
                      checked={Boolean(done[taskKey(selectedEvent._id, task)])}
                      onChange={() => toggle(selectedEvent._id, task)}
                    />
                    <span>{task}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="ops-empty">Sem checklist selecionado.</div>
            )}
          </section>
        </aside>
      </div>
    </section>
  );
}
