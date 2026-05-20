import { addDays, format } from 'date-fns';
import { CalendarDays, Copy, Edit, MessageCircle, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { EventModal } from '../components/EventModal.jsx';
import { FormField } from '../components/FormField.jsx';
import './Events.css';

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
  { value: 'orcamento_enviado', label: 'Orcamento enviado / aguardando resposta' },
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

const eventTags = [
  { value: '', label: 'Sem etiqueta' },
  { value: 'cliente_problema', label: 'Cliente problema' },
  { value: 'cliente_critico', label: 'Cliente critico' },
  { value: 'cliente_prioridade', label: 'Cliente prioridade' },
  { value: 'cliente_antigo', label: 'Cliente antigo' },
  { value: 'cliente_novo', label: 'Cliente novo' },
  { value: 'cliente_importante', label: 'Cliente importante' },
  { value: 'cliente_recorrente', label: 'Cliente recorrente' }
];

const labels = Object.fromEntries([...eventTypes, ...statuses, ...sources, ...eventTags].map((item) => [item.value, item.label]));
labels.aguardando_resposta = labels.orcamento_enviado;

const initial = {
  clientId: '',
  type: 'aniversario_infantil',
  source: 'instagram',
  status: 'orcamento_pendente',
  tag: '',
  date: '',
  followUpAt: '',
  location: '',
  price: '',
  notes: ''
};

function normalizeStatus(status = '') {
  return status === 'aguardando_resposta' ? 'orcamento_enviado' : status;
}

function toDatetimeLocal(date) {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

function normalizePrice(value) {
  if (value === '' || value === null || value === undefined) return 0;
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPhone(value = '') {
  let digits = String(value).replace(/\D/g, '');
  if (!digits) return '';
  if (!digits.startsWith('55')) digits = `55${digits}`;
  return digits;
}

function buildMessage(event) {
  const name = event.clientId?.name?.split(' ')[0] || 'tudo bem';
  return `Oi, ${name}! Passando para acompanhar seu atendimento fotografico. Posso tirar duvidas ou ajustar a proposta para sua data.`;
}

function whatsappUrl(event) {
  const phone = formatPhone(event.clientId?.phone);
  const query = new URLSearchParams({
    ...(phone ? { phone } : {}),
    text: buildMessage(event)
  });
  return `https://api.whatsapp.com/send?${query.toString()}`;
}

function OpsMetric({ label, value, helper }) {
  return (
    <div className="ops-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </div>
  );
}

export function Events() {
  const [events, setEvents] = useState([]);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(initial);
  const [formOpen, setFormOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  function load() {
    api('/events').then(setEvents).catch(console.error);
    api('/clients').then(setClients).catch(console.error);
  }

  useEffect(() => {
    load();
  }, []);

  const statusCounts = useMemo(() => {
    return events.reduce((counts, event) => {
      const status = normalizeStatus(event.status);
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, { all: events.length });
  }, [events]);

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events
      .filter((event) => (statusFilter ? normalizeStatus(event.status) === statusFilter : true))
      .filter((event) => (tagFilter ? event.tag === tagFilter : true))
      .filter((event) => (typeFilter ? event.type === typeFilter : true))
      .filter((event) => {
        if (!term) return true;
        return `${event.clientId?.name || ''} ${event.location || ''} ${event.type || ''}`.toLowerCase().includes(term);
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events, search, statusFilter, tagFilter, typeFilter]);

  function clearFilters() {
    setStatusFilter('');
    setTagFilter('');
    setTypeFilter('');
    setSearch('');
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
    setForm(initial);
    setFormOpen(true);
  }

  function editEvent(event) {
    setSelectedEvent(null);
    setEditingId(event._id);
    setForm({
      clientId: event.clientId?._id || event.clientId || '',
      type: event.type || initial.type,
      source: event.source || 'instagram',
      status: normalizeStatus(event.status) || 'orcamento_pendente',
      tag: event.tag || '',
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
    const confirmed = window.confirm(`Excluir atendimento de ${event.clientId?.name || 'cliente'}?`);
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

  function markBudgetSent() {
    setForm((current) => ({
      ...current,
      status: 'orcamento_enviado',
      followUpAt: toDatetimeLocal(addDays(new Date(), 1)),
      notes: current.notes || 'Orcamento enviado. Retornar amanha caso nao responda.'
    }));
  }

  return (
    <section className="page ops-page events-page">
      <div className="ops-header">
        <div>
          <span className="hero-eyebrow rose">Eventos</span>
          <h1>Atendimentos e orcamentos</h1>
          <p>Lista CRM para acompanhar leads, status, follow-up e fechamento sem excesso de cards.</p>
        </div>
        <button className="primary-button" type="button" onClick={openCreateModal}>
          <Plus size={18} />
          Novo atendimento
        </button>
      </div>

      <div className="ops-metrics-grid four">
        <OpsMetric label="Total" value={events.length} helper="Atendimentos cadastrados" />
        <OpsMetric label="Pendentes" value={statusCounts.orcamento_pendente || 0} helper="Ainda precisam de orcamento" />
        <OpsMetric label="Enviados" value={statusCounts.orcamento_enviado || 0} helper="Aguardando resposta" />
        <OpsMetric label="Confirmados" value={statusCounts.confirmado || 0} helper="Contratos fechados" />
      </div>

      <section className="ops-section">
        <div className="ops-toolbar events-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input placeholder="Buscar cliente, local ou tipo" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">Todos os status</option>
            {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
          </select>
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="">Todos os tipos</option>
            {eventTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
          <select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)}>
            <option value="">Todas as etiquetas</option>
            {eventTags.slice(1).map((tag) => <option key={tag.value} value={tag.value}>{tag.label}</option>)}
          </select>
          <button className="ghost-button" type="button" onClick={clearFilters}>Limpar</button>
        </div>

        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Status</th>
                <th>Origem</th>
                <th>Valor</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event._id} onClick={() => setSelectedEvent(event)}>
                  <td>{event.clientId?.name || 'Cliente sem nome'}</td>
                  <td>{labels[event.type] || event.type}</td>
                  <td>{event.date ? format(new Date(event.date), 'dd/MM/yyyy HH:mm') : 'Sem data'}</td>
                  <td><span className={`badge ${normalizeStatus(event.status)}`}>{labels[normalizeStatus(event.status)] || event.status}</span></td>
                  <td>{labels[event.source] || event.source || '-'}</td>
                  <td>{Number(event.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td>
                    <div className="table-actions" onClick={(clickEvent) => clickEvent.stopPropagation()}>
                      <button className="icon-button" type="button" onClick={() => editEvent(event)} aria-label="Editar">
                        <Edit size={16} />
                      </button>
                      <a className="icon-button" href={whatsappUrl(event)} target="_blank" rel="noreferrer" aria-label="WhatsApp">
                        <MessageCircle size={16} />
                      </a>
                      <button className="icon-button" type="button" onClick={() => copyLink(event)} aria-label="Copiar link">
                        <Copy size={16} />
                      </button>
                      <button className="icon-button danger-button" type="button" onClick={() => deleteEvent(event)} aria-label="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEvents.length === 0 && <div className="ops-empty">Nenhum atendimento encontrado.</div>}
          {copiedId && <div className="ops-toast">Link copiado.</div>}
        </div>
      </section>

      {formOpen && (
        <div className="event-modal-backdrop" role="dialog" aria-modal="true">
          <form className="event-modal ops-modal-card" onSubmit={submit}>
            <div className="event-modal-head">
              <div>
                <span>{editingId ? 'Editar atendimento' : 'Novo atendimento'}</span>
                <h2>{editingId ? 'Atualizar dados' : 'Cadastrar atendimento'}</h2>
              </div>
              <button className="icon-button" type="button" onClick={closeFormModal} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <div className="ops-form-grid">
              <FormField label="Cliente">
                <select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                  <option value="">Selecione</option>
                  {clients.map((client) => <option key={client._id} value={client._id}>{client.name}</option>)}
                </select>
              </FormField>
              <FormField label="Tipo">
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {eventTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </FormField>
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
              <FormField label="Etiqueta">
                <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
                  {eventTags.map((tag) => <option key={tag.value} value={tag.value}>{tag.label}</option>)}
                </select>
              </FormField>
              <FormField label="Data e horario">
                <input type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </FormField>
              <FormField label="Proximo contato">
                <input type="datetime-local" value={form.followUpAt} onChange={(e) => setForm({ ...form, followUpAt: e.target.value })} />
              </FormField>
              <FormField label="Valor">
                <input type="number" min="0" step="0.01" inputMode="decimal" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </FormField>
              <FormField label="Local">
                <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </FormField>
              <FormField label="Observacoes">
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </FormField>
            </div>

            <div className="event-modal-actions">
              <button className="ghost-button" type="button" onClick={markBudgetSent}>
                Marcar orcamento enviado
              </button>
              <button className="ghost-button" type="button" onClick={closeFormModal}>
                Cancelar
              </button>
              <button className="primary-button" disabled={loading}>
                {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Salvar'}
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
