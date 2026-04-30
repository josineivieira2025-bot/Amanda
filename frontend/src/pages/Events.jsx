import { addDays, format } from 'date-fns';
import {
  CalendarDays,
  Clock,
  Copy,
  Download,
  DollarSign,
  Edit,
  Instagram,
  MapPin,
  MessageCircle,
  Plus,
  Sparkles,
  Trash2,
  X,
  UserRound
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { EventModal } from '../components/EventModal.jsx';
import { FormField } from '../components/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const eventTypes = [
  { value: 'aniversario_15', label: 'Aniversario de 15' },
  { value: 'aniversario_adulto', label: 'Aniversario adulto' },
  { value: 'aniversario_infantil', label: 'Aniversario infantil' },
  { value: 'casamento', label: 'Casamento' },
  { value: 'cha_revelacao', label: 'Cha revelacao' },
  { value: 'cha_de_panela', label: 'Cha de panela' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'smash_the_cake', label: 'Smash the cake' },
  { value: 'newborn', label: 'Newborn' },
  { value: 'ensaio_infantil', label: 'Ensaio infantil' },
  { value: 'ensaio_casal', label: 'Ensaio de casal' },
  { value: 'ensaio_casamento', label: 'Ensaio de casamento' },
  { value: 'ensaio_adulto', label: 'Ensaio adulto' },
  { value: 'ensaio_gestante', label: 'Ensaio gestante' },
  { value: 'ensaio_familia', label: 'Ensaio de familia' },
  { value: 'outro', label: 'Outro' }
];

const statuses = [
  { value: 'orcamento_pendente', label: 'Orcamento pendente' },
  { value: 'orcamento_enviado', label: 'Orcamento enviado' },
  { value: 'aguardando_resposta', label: 'Aguardando resposta' },
  { value: 'cliente_problema', label: 'Cliente problema' },
  { value: 'agendado', label: 'Agendado' },
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cancelado', label: 'Cancelado' }
];

const sources = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'indicacao', label: 'Indicacao' },
  { value: 'site', label: 'Site' },
  { value: 'cliente_antigo', label: 'Cliente antigo' },
  { value: 'outro', label: 'Outro' }
];

const labels = Object.fromEntries([...eventTypes, ...statuses, ...sources].map((item) => [item.value, item.label]));

const initial = {
  clientId: '',
  type: 'aniversario_infantil',
  source: 'instagram',
  status: 'orcamento_pendente',
  date: '',
  endDate: '',
  followUpAt: '',
  location: '',
  price: 0,
  notes: ''
};

function toDatetimeLocal(date) {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

function statusClass(status = '') {
  if (['agendado', 'confirmado', 'finalizado'].includes(status)) return 'success';
  if (['orcamento_pendente', 'orcamento_enviado', 'aguardando_resposta'].includes(status)) return 'warning';
  if (['cliente_problema', 'cancelado'].includes(status)) return 'danger';
  return 'info';
}

export function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(initial);
  const [statusFilter, setStatusFilter] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedBudget, setCopiedBudget] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  function load() {
    api('/events').then(setEvents).catch(console.error);
    api('/clients').then(setClients).catch(console.error);
  }

  useEffect(load, []);

  const stats = useMemo(() => {
    const waiting = events.filter((event) => event.status === 'aguardando_resposta').length;
    const pending = events.filter((event) => event.status === 'orcamento_pendente').length;
    const instagram = events.filter((event) => event.source === 'instagram').length;
    const followUps = events.filter((event) => {
      if (!event.followUpAt) return false;
      return new Date(event.followUpAt) <= addDays(new Date(), 1);
    }).length;

    return { waiting, pending, instagram, followUps };
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!statusFilter) return events;
    return events.filter((event) => event.status === statusFilter);
  }, [events, statusFilter]);

  const selectedClient = useMemo(
    () => clients.find((client) => client._id === form.clientId),
    [clients, form.clientId]
  );

  const budgetText = useMemo(() => buildBudgetText(form, selectedClient), [form, selectedClient]);
  const budgetCard = useMemo(
    () => buildBudgetCardData(form, selectedClient, user),
    [form, selectedClient, user]
  );

  function sendBudgetPreset() {
    setForm((current) => ({
      ...current,
      status: 'orcamento_enviado',
      followUpAt: toDatetimeLocal(addDays(new Date(), 1)),
      notes: current.notes || 'Orcamento enviado. Se nao responder ate amanha, chamar perguntando se viu e se posso ajudar em algo.'
    }));
  }

  async function submit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await api(`/events/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
      } else {
        await api('/events', { method: 'POST', body: JSON.stringify(form) });
      }
      cancelEdit();
      load();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function editEvent(event) {
    setEditingId(event._id);
    setForm({
      clientId: event.clientId?._id || event.clientId || '',
      type: event.type || initial.type,
      source: event.source || 'instagram',
      status: event.status || 'orcamento_pendente',
      date: event.date ? toDatetimeLocal(new Date(event.date)) : '',
      endDate: event.endDate ? toDatetimeLocal(new Date(event.endDate)) : '',
      followUpAt: event.followUpAt ? toDatetimeLocal(new Date(event.followUpAt)) : '',
      location: event.location || '',
      price: Number(event.price || 0),
      notes: event.notes || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(initial);
  }

  async function deleteEvent(event) {
    const confirmed = window.confirm(`Excluir orçamento/evento de ${event.clientId?.name || 'cliente'}?`);
    if (!confirmed) return;
    await api(`/events/${event._id}`, { method: 'DELETE' });
    load();
  }

  async function copyLink(event) {
    const url = `${window.location.origin}/client/${event.clientAccessToken}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(event._id);
    setTimeout(() => setCopiedId(null), 1800);
  }

  async function copyBudget(text = budgetText) {
    await navigator.clipboard.writeText(text);
    setCopiedBudget(true);
    setTimeout(() => setCopiedBudget(false), 1800);
  }

  function whatsappUrl(text = budgetText, client = selectedClient) {
    const phone = (client?.phone || '').replace(/\D/g, '');
    const number = phone.length >= 10 ? `55${phone}` : '';
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  }

  function downloadBudgetCard(data = budgetCard) {
    const svg = buildBudgetCardSvg(data);
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orcamento-${data.clientName.replace(/\s+/g, '-').toLowerCase()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="page">
      <div className="page-title row-title">
        <div>
          <h1>Eventos e orcamentos</h1>
          <p>Controle pedidos que chegam pelo Instagram, envio de orcamento e follow-up semanal.</p>
        </div>
        <button className="ghost-button" type="button" onClick={sendBudgetPreset}>
          <MessageCircle size={18} />
          Marcar orcamento enviado
        </button>
      </div>

      <div className="metrics">
        <div className="metric-card tone-amber">
          <span>Orcamento pendente</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className="metric-card tone-amber">
          <span>Aguardando resposta</span>
          <strong>{stats.waiting}</strong>
        </div>
        <div className="metric-card">
          <span>Vieram do Instagram</span>
          <strong>{stats.instagram}</strong>
        </div>
        <div className="metric-card tone-green">
          <span>Follow-up ate amanha</span>
          <strong>{stats.followUps}</strong>
        </div>
      </div>

      <div className="split lead-split">
        <form className="panel form-panel" onSubmit={submit}>
          <div className="section-head compact-head">
            <div>
              <h2>{editingId ? 'Editar atendimento' : 'Novo atendimento'}</h2>
              <p>Preencha data, local, horarios e origem do pedido.</p>
            </div>
            {editingId ? (
              <button className="icon-button" type="button" onClick={cancelEdit} aria-label="Cancelar edicao">
                <X size={16} />
              </button>
            ) : (
              <div className="section-icon"><Plus size={18} /></div>
            )}
          </div>

          <FormField label="Cliente">
            <select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
              <option value="">Selecione</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>{client.name}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Tipo de evento ou ensaio">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <optgroup label="Eventos">
                {eventTypes.slice(0, 6).map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </optgroup>
              <optgroup label="Ensaios e outros">
                {eventTypes.slice(6).map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
              </optgroup>
            </select>
          </FormField>

          <div className="form-duo">
            <FormField label="Origem">
              <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                {sources.map((source) => <option key={source.value} value={source.value}>{source.label}</option>)}
              </select>
            </FormField>

            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
            </FormField>
          </div>

          <FormField label="Data e horario de inicio">
            <input type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </FormField>

          <FormField label="Horario final">
            <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </FormField>

          <FormField label="Proximo contato">
            <input type="datetime-local" value={form.followUpAt} onChange={(e) => setForm({ ...form, followUpAt: e.target.value })} />
          </FormField>

          <FormField label="Local">
            <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ex.: salao, igreja, casa, estudio..." />
          </FormField>

          <FormField label="Valor do orcamento">
            <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </FormField>

          <FormField label="Observacoes do atendimento">
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Ex.: pediu pelo Instagram, quer saber pacote, chamar de novo semana que vem..." />
          </FormField>

          <div className="budget-preview">
            <div className="budget-preview-head">
              <div>
                <strong>Orcamento pronto</strong>
                <span>Mensagem para copiar e enviar para a cliente.</span>
              </div>
              <Sparkles size={18} />
            </div>

            <div className="budget-card">
              <div className="budget-card-top">
                <div>
                  <span>{budgetCard.studioName}</span>
                  <strong>Orcamento fotografico</strong>
                </div>
                <Sparkles size={20} />
              </div>
              <div className="budget-card-client">
                <span>Cliente</span>
                <strong>{budgetCard.clientName}</strong>
              </div>
              <div className="budget-card-grid">
                <div><span>Servico</span><strong>{budgetCard.type}</strong></div>
                <div><span>Data</span><strong>{budgetCard.date}</strong></div>
                <div><span>Horario</span><strong>{budgetCard.time}</strong></div>
                <div><span>Local</span><strong>{budgetCard.location}</strong></div>
              </div>
              <div className="budget-card-price">
                <span>Investimento</span>
                <strong>{budgetCard.price}</strong>
              </div>
            </div>

            <pre>{budgetText}</pre>
            <div className="budget-actions">
              <button type="button" className="ghost-button" onClick={() => copyBudget()}>
                <Copy size={16} />
                {copiedBudget ? 'Copiado' : 'Copiar orcamento'}
              </button>
              <a className="primary-button" href={whatsappUrl()} target="_blank" rel="noreferrer">
                <MessageCircle size={16} />
                Enviar WhatsApp
              </a>
              <button type="button" className="ghost-button full-action" onClick={() => downloadBudgetCard()}>
                <Download size={16} />
                Baixar cartao
              </button>
            </div>
          </div>

          <button className="primary-button" disabled={loading}>{loading ? 'Salvando...' : editingId ? 'Atualizar atendimento' : 'Salvar atendimento'}</button>
        </form>

        <div className="panel">
          <div className="section-head compact-head">
            <div>
              <h2>Funil de atendimento</h2>
              <p>Veja quem precisa receber mensagem, quem esta aguardando e quem ja fechou.</p>
            </div>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">Todos os status</option>
              {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
            </select>
          </div>

          <div className="lead-list">
            {filteredEvents.map((event) => (
              <article className="lead-card clickable-card" key={event._id} onClick={() => setSelectedEvent(event)}>
                <div className="lead-card-top">
                  <div>
                    <span className="event-type-pill">{labels[event.type] || event.type}</span>
                    <h3>{event.clientId?.name || 'Cliente sem nome'}</h3>
                  </div>
                  <span className={`badge ${statusClass(event.status)}`}>{labels[event.status] || event.status}</span>
                </div>

                <div className="lead-meta">
                  <span><Instagram size={16} />{labels[event.source] || event.source || 'Origem nao informada'}</span>
                  <span><CalendarDays size={16} />{format(new Date(event.date), 'dd/MM/yyyy HH:mm')}</span>
                  <span><Clock size={16} />{event.endDate ? format(new Date(event.endDate), 'HH:mm') : 'Sem horario final'}</span>
                  <span><MapPin size={16} />{event.location}</span>
                  <span><DollarSign size={16} />{Number(event.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  <span><UserRound size={16} />{event.followUpAt ? `Chamar ${format(new Date(event.followUpAt), 'dd/MM HH:mm')}` : 'Sem follow-up'}</span>
                </div>

                <p className={event.notes ? 'event-notes' : 'event-notes muted'}>
                  {event.notes || 'Sem observacoes adicionais.'}
                </p>

                <div className="event-actions">
                  <button type="button" className="ghost-button" onClick={(clickEvent) => { clickEvent.stopPropagation(); editEvent(event); }}>
                    <Edit size={16} />
                    Editar
                  </button>
                  <button type="button" className="ghost-button" onClick={(clickEvent) => { clickEvent.stopPropagation(); copyBudget(buildBudgetText(event, event.clientId)); }}>
                    <MessageCircle size={16} />
                    Copiar orcamento
                  </button>
                  <button type="button" className="ghost-button" onClick={(clickEvent) => { clickEvent.stopPropagation(); copyLink(event); }}>
                    <Copy size={16} />
                    {copiedId === event._id ? 'Link copiado' : 'Copiar link do cliente'}
                  </button>
                  <button type="button" className="ghost-button danger-button" onClick={(clickEvent) => { clickEvent.stopPropagation(); deleteEvent(event); }}>
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </div>
              </article>
            ))}

            {filteredEvents.length === 0 && (
              <div className="empty-state">
                <Sparkles size={20} />
                <strong>Nenhum atendimento nesse filtro</strong>
                <p>Quando cadastrar um pedido de orcamento, ele aparece aqui para acompanhar.</p>
              </div>
            )}
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

function formatMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatWhen(value) {
  if (!value) return 'data a confirmar';
  return format(new Date(value), 'dd/MM/yyyy HH:mm');
}

function buildBudgetText(data, client) {
  const clientName = client?.name || 'tudo bem';
  const type = labels[data.type] || 'Evento';
  const start = formatWhen(data.date);
  const end = data.endDate ? format(new Date(data.endDate), 'HH:mm') : 'horario final a combinar';
  const location = data.location || 'local a confirmar';
  const price = formatMoney(data.price);

  return [
    `Oi, ${clientName}! Tudo bem?`,
    '',
    `Segue o orcamento para ${type}:`,
    '',
    `Data e inicio: ${start}`,
    `Horario final: ${end}`,
    `Local: ${location}`,
    `Investimento: ${price}`,
    '',
    'Se fizer sentido para voce, posso deixar essa data pre-reservada enquanto alinhamos os detalhes.',
    'Qualquer duvida ou ajuste que precisar, estou a disposicao.'
  ].join('\n');
}

function buildBudgetCardData(data, client, user) {
  const startDate = data.date ? new Date(data.date) : null;
  const endDate = data.endDate ? new Date(data.endDate) : null;

  return {
    studioName: user?.studioName || 'Amanda Fotografia',
    clientName: client?.name || 'Cliente',
    type: labels[data.type] || 'Servico fotografico',
    date: startDate ? format(startDate, 'dd/MM/yyyy') : 'A confirmar',
    time: startDate ? `${format(startDate, 'HH:mm')} ate ${endDate ? format(endDate, 'HH:mm') : 'combinar'}` : 'A combinar',
    location: data.location || 'Local a confirmar',
    price: formatMoney(data.price)
  };
}

function escapeSvg(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildBudgetCardSvg(data) {
  const safe = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, escapeSvg(value)]));

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#fff7f8"/>
      <stop offset="48%" stop-color="#f5e4ea"/>
      <stop offset="100%" stop-color="#6f3d51"/>
    </linearGradient>
    <linearGradient id="rose" x1="0" x2="1">
      <stop offset="0%" stop-color="#c98fa5"/>
      <stop offset="100%" stop-color="#8f526b"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1350" rx="72" fill="url(#bg)"/>
  <circle cx="910" cy="170" r="190" fill="#ffffff" opacity="0.25"/>
  <circle cx="120" cy="1160" r="260" fill="#ffffff" opacity="0.18"/>
  <rect x="90" y="96" width="900" height="1158" rx="54" fill="#fffdfc" opacity="0.94"/>
  <rect x="130" y="136" width="820" height="108" rx="32" fill="#fff2f5"/>
  <text x="170" y="183" font-family="Arial, sans-serif" font-size="30" fill="#8f526b" font-weight="700">${safe.studioName}</text>
  <text x="170" y="222" font-family="Arial, sans-serif" font-size="22" fill="#8b7280">Orcamento fotografico</text>
  <rect x="130" y="304" width="820" height="174" rx="36" fill="url(#rose)"/>
  <text x="170" y="365" font-family="Arial, sans-serif" font-size="24" fill="#ffeef4">Cliente</text>
  <text x="170" y="425" font-family="Arial, sans-serif" font-size="52" fill="#ffffff" font-weight="800">${safe.clientName}</text>
  <text x="130" y="570" font-family="Arial, sans-serif" font-size="24" fill="#8b7280" font-weight="700">Servico</text>
  <text x="130" y="615" font-family="Arial, sans-serif" font-size="38" fill="#3f2b34" font-weight="800">${safe.type}</text>
  <text x="130" y="705" font-family="Arial, sans-serif" font-size="24" fill="#8b7280" font-weight="700">Data</text>
  <text x="130" y="750" font-family="Arial, sans-serif" font-size="36" fill="#3f2b34" font-weight="800">${safe.date}</text>
  <text x="580" y="705" font-family="Arial, sans-serif" font-size="24" fill="#8b7280" font-weight="700">Horario</text>
  <text x="580" y="750" font-family="Arial, sans-serif" font-size="34" fill="#3f2b34" font-weight="800">${safe.time}</text>
  <text x="130" y="840" font-family="Arial, sans-serif" font-size="24" fill="#8b7280" font-weight="700">Local</text>
  <text x="130" y="886" font-family="Arial, sans-serif" font-size="34" fill="#3f2b34" font-weight="800">${safe.location}</text>
  <rect x="130" y="982" width="820" height="150" rx="34" fill="#fff2f5"/>
  <text x="170" y="1038" font-family="Arial, sans-serif" font-size="24" fill="#8b7280" font-weight="700">Investimento</text>
  <text x="170" y="1098" font-family="Arial, sans-serif" font-size="54" fill="#8f526b" font-weight="900">${safe.price}</text>
  <text x="130" y="1200" font-family="Arial, sans-serif" font-size="22" fill="#8b7280">Validade e detalhes podem ser alinhados pelo atendimento.</text>
</svg>`;
}
