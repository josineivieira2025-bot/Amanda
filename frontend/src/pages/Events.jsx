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
  UserRound,
  X
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { EventModal } from '../components/EventModal.jsx';
import { FormField } from '../components/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { buildBudgetTemplateText } from '../data/budgetTemplates.js';

const eventTypes = [
  { value: 'aniversario_15', label: 'Ensaio 15 anos externo' },
  { value: 'aniversario_15_externo', label: 'Ensaio 15 anos externo' },
  { value: 'aniversario_15_estudio', label: 'Ensaio 15 anos estudio' },
  { value: 'aniversario_adulto', label: 'Aniversario adulto' },
  { value: 'aniversario_infantil', label: 'Aniversario infantil' },
  { value: 'casamento', label: 'Casamento civil + recepcao' },
  { value: 'cha_revelacao', label: 'Cha revelacao' },
  { value: 'cha_de_panela', label: 'Cha de panela' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'smash_the_cake', label: 'Smash the cake' },
  { value: 'newborn', label: 'Newborn' },
  { value: 'ensaio_infantil', label: 'Ensaio infantil' },
  { value: 'ensaio_casal', label: 'Ensaio casal externo' },
  { value: 'ensaio_casal_externo', label: 'Ensaio casal externo' },
  { value: 'ensaio_casal_estudio', label: 'Ensaio casal estudio' },
  { value: 'ensaio_casamento', label: 'Ensaio de casamento' },
  { value: 'ensaio_adulto', label: 'Ensaio adulto' },
  { value: 'ensaio_gestante', label: 'Ensaio gestante' },
  { value: 'ensaio_familia', label: 'Ensaio de familia' },
  { value: 'formatura_externo', label: 'Formatura externo' },
  { value: 'formatura_pacote_1', label: 'Formatura pacote 1' },
  { value: 'formatura_premium', label: 'Formatura premium' },
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
  followUpAt: '',
  location: '',
  price: '',
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
  const [formOpen, setFormOpen] = useState(false);
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
      const payload = { ...form, price: normalizePrice(form.price) };
      if (editingId) {
        await api(`/events/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await api('/events', { method: 'POST', body: JSON.stringify(payload) });
      }
      closeFormModal();
      load();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setSelectedEvent(null);
    setEditingId(null);
    setCopiedBudget(false);
    setForm(initial);
    setFormOpen(true);
  }

  function editEvent(event) {
    setSelectedEvent(null);
    setEditingId(event._id);
    setCopiedBudget(false);
    setForm({
      clientId: event.clientId?._id || event.clientId || '',
      type: event.type || initial.type,
      source: event.source || 'instagram',
      status: event.status || 'orcamento_pendente',
      date: event.date ? toDatetimeLocal(new Date(event.date)) : '',
      followUpAt: event.followUpAt ? toDatetimeLocal(new Date(event.followUpAt)) : '',
      location: event.location || '',
      price: event.price === 0 ? '0' : String(event.price || ''),
      notes: event.notes || ''
    });
    setFormOpen(true);
  }

  function closeFormModal() {
    setFormOpen(false);
    setEditingId(null);
    setForm(initial);
  }

  async function deleteEvent(event) {
    const confirmed = window.confirm(`Excluir orcamento/evento de ${event.clientId?.name || 'cliente'}?`);
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
    const number = formatWhatsAppPhone(client?.phone);
    const query = new URLSearchParams({
      ...(number ? { phone: number } : {}),
      text
    });

    return `https://api.whatsapp.com/send?${query.toString()}`;
  }

  function eventBudgetWhatsAppUrl(event) {
    return whatsappUrl(buildBudgetText(event, event.clientId), event.clientId);
  }

  async function sendBudgetWhatsApp() {
    try {
      const file = await createBudgetCardFile(budgetCard);

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Orcamento ${budgetCard.studioName}`,
          text: budgetText,
          files: [file]
        });
        return;
      }
    } catch (error) {
      console.error(error);
    }

    window.open(whatsappUrl(), '_blank', 'noopener,noreferrer');
    downloadBudgetCard();
  }

  function downloadBudgetCard(data = budgetCard) {
    const svg = buildBudgetCardSvg(data, `${window.location.origin}/vida-em-foco-logo.jpeg`);
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
        <button className="primary-button" type="button" onClick={openCreateModal}>
          <Plus size={18} />
          Novo atendimento
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

      <div className="panel">
        <div className="section-head compact-head">
          <div>
            <h2>Lista de atendimento</h2>
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
                <a
                  className="ghost-button whatsapp-button"
                  href={eventBudgetWhatsAppUrl(event)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(clickEvent) => clickEvent.stopPropagation()}
                >
                  <MessageCircle size={16} />
                  Enviar WhatsApp
                </a>
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

      {formOpen && (
        <div className="event-modal-backdrop" role="dialog" aria-modal="true">
          <form className="event-modal event-create-modal" onSubmit={submit}>
            <div className="event-modal-head">
              <div>
                <span><CalendarDays size={16} /> {editingId ? 'Editar atendimento' : 'Novo atendimento'}</span>
                <h2>{editingId ? 'Atualize os dados do orcamento' : 'Cadastrar novo atendimento'}</h2>
              </div>
              <button className="icon-button" type="button" onClick={closeFormModal} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <div className="event-create-grid">
              <div className="event-create-form">
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

                <FormField label="Proximo contato">
                  <input type="datetime-local" value={form.followUpAt} onChange={(e) => setForm({ ...form, followUpAt: e.target.value })} />
                </FormField>

                <FormField label="Local">
                  <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Ex.: salao, igreja, casa, estudio..." />
                </FormField>

                <FormField label="Valor do orcamento">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </FormField>

                <FormField label="Observacoes do atendimento">
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Ex.: pediu pelo Instagram, quer saber pacote, chamar de novo semana que vem..." />
                </FormField>
              </div>

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
                    <div className="budget-card-brand">
                      <div className="budget-card-logo">
                        <img src="/vida-em-foco-logo.jpeg" alt="Logo Mel Fotografia" />
                      </div>
                      <div>
                        <span>Mel Fotografia</span>
                        <small>Atendimento fotografico</small>
                      </div>
                    </div>
                    <div className="budget-card-title">
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
                  <button type="button" className="ghost-button" onClick={sendBudgetPreset}>
                    <MessageCircle size={16} />
                    Marcar orcamento enviado
                  </button>
                  <button type="button" className="ghost-button" onClick={() => copyBudget()}>
                    <Copy size={16} />
                    {copiedBudget ? 'Copiado' : 'Copiar orcamento'}
                  </button>
                  <button className="primary-button" type="button" onClick={sendBudgetWhatsApp}>
                    <MessageCircle size={16} />
                    Enviar WhatsApp
                  </button>
                  <button type="button" className="ghost-button full-action" onClick={() => downloadBudgetCard()}>
                    <Download size={16} />
                    Baixar cartao
                  </button>
                </div>
              </div>
            </div>

            <div className="event-modal-actions">
              <button className="ghost-button" type="button" onClick={closeFormModal}>
                Cancelar
              </button>
              <button className="primary-button" disabled={loading}>
                {loading ? 'Salvando...' : editingId ? 'Atualizar atendimento' : 'Salvar atendimento'}
              </button>
            </div>
          </form>
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

function formatMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function normalizePrice(value) {
  if (value === '' || value === null || value === undefined) return 0;
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildBudgetText(data, client) {
  return buildBudgetTemplateText(data, client, labels);
}

function formatWhatsAppPhone(value = '') {
  let digits = String(value).replace(/\D/g, '');
  if (!digits) return '';

  digits = digits.replace(/^00/, '').replace(/^0+/, '');

  let national = digits.startsWith('55') && digits.length > 11 ? digits.slice(2) : digits;

  if (national.length === 8 || national.length === 9) {
    national = `21${national}`;
  }

  if (national.length === 10 && /^[6-9]/.test(national.slice(2, 3))) {
    national = `${national.slice(0, 2)}9${national.slice(2)}`;
  }

  return national.length >= 10 ? `55${national}` : '';
}

function buildBudgetCardData(data, client, user) {
  const startDate = data.date ? new Date(data.date) : null;

  return {
    studioName: user?.studioName || 'Mel Fotografia',
    clientName: client?.name || 'Cliente',
    type: labels[data.type] || 'Servico fotografico',
    date: startDate ? format(startDate, 'dd/MM/yyyy') : 'A confirmar',
    time: startDate ? format(startDate, 'HH:mm') : 'A combinar',
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

function buildBudgetCardSvg(data, logoUrl = '') {
  const safe = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, escapeSvg(value)]));
  const safeLogoUrl = escapeSvg(logoUrl);

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
  <circle cx="194" cy="190" r="40" fill="#ffffff" opacity="0.96"/>
  ${safeLogoUrl ? `<image href="${safeLogoUrl}" x="154" y="150" width="80" height="80" preserveAspectRatio="xMidYMid slice" clip-path="circle(40px at 194px 190px)" />` : ''}
  <text x="254" y="180" font-family="Arial, sans-serif" font-size="30" fill="#8f526b" font-weight="800">Mel Fotografia</text>
  <text x="254" y="218" font-family="Arial, sans-serif" font-size="22" fill="#8b7280">Orcamento fotografico</text>
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

async function createBudgetCardFile(data) {
  const svg = buildBudgetCardSvg(data, `${window.location.origin}/vida-em-foco-logo.jpeg`);
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  try {
    const image = await new Promise((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = reject;
      nextImage.src = url;
    });

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Nao foi possivel gerar a imagem do cartao.');
    }
    context.drawImage(image, 0, 0);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) {
      throw new Error('Nao foi possivel converter o cartao em imagem.');
    }
    return new File([blob], `orcamento-${data.clientName.replace(/\s+/g, '-').toLowerCase()}.png`, { type: 'image/png' });
  } finally {
    URL.revokeObjectURL(url);
  }
}
