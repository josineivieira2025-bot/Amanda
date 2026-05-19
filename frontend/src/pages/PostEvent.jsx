import { Camera, CheckCircle2, Image, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const deliverySteps = [
  'Backup dos arquivos',
  'Prévia enviada',
  'Seleção do cliente',
  'Edição final',
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

  useEffect(() => {
    api('/events')
      .then((items) => {
        setEvents(items.filter((event) => ['em_andamento', 'finalizado', 'confirmado'].includes(event.status)));
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

  const progress = useMemo(() => {
    const total = events.length * deliverySteps.length;
    const finished = events.reduce((sum, event) => (
      sum + deliverySteps.filter((step) => done[storageKey(event._id, step)]).length
    ), 0);
    return { total, finished, percent: total ? Math.round((finished / total) * 100) : 0 };
  }, [done, events]);

  return (
    <section className="page postevent-page">
      <div className="module-hero">
        <div>
          <span className="hero-eyebrow rose">Pós-evento</span>
          <h1>Entrega e acompanhamento</h1>
          <p>Acompanhe backup, prévia, seleção, edição, galeria e entrega final por cliente.</p>
        </div>
        <div className="module-hero-card">
          <span>Andamento</span>
          <strong>{progress.percent}%</strong>
          <small>{progress.finished} de {progress.total} etapas concluídas</small>
        </div>
      </div>

      <div className="postevent-grid">
        {events.map((event) => {
          const finished = deliverySteps.filter((step) => done[storageKey(event._id, step)]).length;
          const phone = formatPhone(event.clientId?.phone);
          const text = `Oi! Passando para atualizar o andamento da sua entrega fotográfica. Já estamos organizando as próximas etapas com carinho.`;
          const whatsappUrl = `https://api.whatsapp.com/send?${new URLSearchParams({ ...(phone ? { phone } : {}), text })}`;

          return (
            <article className="postevent-card" key={event._id}>
              <div className="postevent-head">
                <div>
                  <strong>{event.clientId?.name || 'Cliente sem nome'}</strong>
                  <span>{event.date ? new Date(event.date).toLocaleDateString('pt-BR') : 'Data a confirmar'}</span>
                </div>
                <b>{finished}/{deliverySteps.length}</b>
              </div>

              <div className="postevent-progress"><i style={{ width: `${Math.round((finished / deliverySteps.length) * 100)}%` }} /></div>

              <div className="task-list">
                {deliverySteps.map((step) => (
                  <label className="task-check" key={step}>
                    <input checked={Boolean(done[storageKey(event._id, step)])} onChange={() => toggle(event._id, step)} type="checkbox" />
                    <span>{step}</span>
                  </label>
                ))}
              </div>

              <a className="mini-link-button" href={whatsappUrl} target="_blank" rel="noreferrer">
                <Send size={15} />
                Atualizar cliente
              </a>
            </article>
          );
        })}
      </div>

      {!events.length && (
        <div className="empty-state">
          <Image size={24} />
          <strong>Nenhuma entrega em andamento</strong>
          <p>Eventos confirmados, em andamento ou finalizados aparecem aqui.</p>
        </div>
      )}
    </section>
  );
}
