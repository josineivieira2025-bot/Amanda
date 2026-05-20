import { Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const deliverySteps = [
  'Backup dos arquivos',
  'Previa enviada',
  'Selecao do cliente',
  'Edicao final',
  'Galeria publicada',
  'Arquivos entregues'
];

function storageKey(eventId, step) {
  return `post_${eventId}_${step}`;
}

function formatPhone(value = '') {
  let digits = String(value).replace(/\D/g, '');
  if (!digits) return '';
  if (!digits.startsWith('55')) digits = `55${digits}`;
  return digits;
}

export function PostEvent() {
  const [events, setEvents] = useState([]);
  const [done, setDone] = useState({});
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    api('/events')
      .then((items) => {
        const delivery = items
          .filter((event) => ['em_andamento', 'finalizado', 'confirmado'].includes(event.status))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(delivery);
        setSelectedId(delivery[0]?._id || '');
      })
      .catch(console.error);
    try {
      setDone(JSON.parse(localStorage.getItem('photo_erp_post_event') || '{}'));
    } catch {
      setDone({});
    }
  }, []);

  function toggle(eventId, step) {
    const key = storageKey(eventId, step);
    const next = { ...done, [key]: !done[key] };
    setDone(next);
    localStorage.setItem('photo_erp_post_event', JSON.stringify(next));
  }

  const selectedEvent = useMemo(() => events.find((event) => event._id === selectedId) || events[0], [events, selectedId]);
  const progress = useMemo(() => {
    const total = events.length * deliverySteps.length;
    const finished = events.reduce((sum, event) => (
      sum + deliverySteps.filter((step) => done[storageKey(event._id, step)]).length
    ), 0);
    return { total, finished, percent: total ? Math.round((finished / total) * 100) : 0 };
  }, [done, events]);

  const phone = formatPhone(selectedEvent?.clientId?.phone);
  const text = 'Oi! Passando para atualizar o andamento da sua entrega fotografica. Estamos organizando as proximas etapas.';
  const whatsappUrl = `https://api.whatsapp.com/send?${new URLSearchParams({ ...(phone ? { phone } : {}), text })}`;

  return (
    <section className="page ops-page">
      <div className="ops-header">
        <div>
          <span className="hero-eyebrow rose">Pos-evento</span>
          <h1>Entrega e acompanhamento</h1>
          <p>Controle backup, selecao, edicao, galeria e entrega final por cliente.</p>
        </div>
        <div className="ops-header-control">
          <span>Andamento</span>
          <strong>{progress.percent}%</strong>
        </div>
      </div>

      <div className="ops-workspace">
        <section className="ops-section">
          <div className="ops-section-head">
            <div>
              <h2>Entregas em andamento</h2>
              <p>Eventos confirmados, em andamento ou finalizados.</p>
            </div>
          </div>
          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Entrega</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const finished = deliverySteps.filter((step) => done[storageKey(event._id, step)]).length;
                  return (
                    <tr key={event._id} className={selectedEvent?._id === event._id ? 'selected-row' : ''} onClick={() => setSelectedId(event._id)}>
                      <td>{event.clientId?.name || 'Cliente sem nome'}</td>
                      <td>{event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'Sem data'}</td>
                      <td>{event.status}</td>
                      <td>{finished}/{deliverySteps.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!events.length && <div className="ops-empty">Nenhuma entrega em andamento.</div>}
          </div>
        </section>

        <aside className="ops-inspector">
          <section className="ops-section">
            <div className="ops-section-head">
              <div>
                <h2>Fluxo de entrega</h2>
                <p>{selectedEvent?.clientId?.name || 'Selecione uma entrega'}</p>
              </div>
            </div>
            {selectedEvent ? (
              <>
                <div className="ops-check-list">
                  {deliverySteps.map((step) => (
                    <label className="ops-check-row" key={step}>
                      <input checked={Boolean(done[storageKey(selectedEvent._id, step)])} onChange={() => toggle(selectedEvent._id, step)} type="checkbox" />
                      <span>{step}</span>
                    </label>
                  ))}
                </div>
                <a className="primary-button" href={whatsappUrl} target="_blank" rel="noreferrer">
                  <Send size={16} />
                  Atualizar cliente
                </a>
              </>
            ) : (
              <div className="ops-empty">Sem entrega selecionada.</div>
            )}
          </section>
        </aside>
      </div>
    </section>
  );
}
