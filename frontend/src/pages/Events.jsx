
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
  SlidersHorizontal,
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
import './Events.css';

const eventTypes = [
  { value: 'aniversario_15', label: 'Ensaio 15 anos externo' },
  { value: 'aniversario_15_externo', label: 'Ensaio 15 anos externo' },
  { value: 'aniversario_15_estudio', label: 'Ensaio 15 anos estúdio' },
  { value: 'aniversario_adulto', label: 'Aniversário adulto' },
  { value: 'aniversario_infantil', label: 'Aniversário infantil' },
  { value: 'casamento', label: 'Casamento civil + recepção' },
  { value: 'cha_revelacao', label: 'Chá revelação' },
  { value: 'cha_de_panela', label: 'Chá de panela' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'smash_the_cake', label: 'Smash the cake' },
  { value: 'newborn', label: 'Newborn' },
  { value: 'ensaio_infantil', label: 'Ensaio infantil' },
  { value: 'ensaio_casal', label: 'Ensaio casal externo' },
  { value: 'ensaio_casal_externo', label: 'Ensaio casal externo' },
  { value: 'ensaio_casal_estudio', label: 'Ensaio casal estúdio' },
  { value: 'ensaio_casamento', label: 'Ensaio de casamento' },
  { value: 'ensaio_adulto', label: 'Ensaio adulto' },
  { value: 'ensaio_gestante', label: 'Ensaio gestante' },
  { value: 'ensaio_familia', label: 'Ensaio de família' },
  { value: 'formatura_externo', label: 'Formatura externo' },
  { value: 'formatura_pacote_1', label: 'Formatura pacote 1' },
  { value: 'formatura_premium', label: 'Formatura premium' },
  { value: 'outro', label: 'Outro' }
];

const statuses = [
  { value: 'orcamento_pendente', label: 'Orçamento pendente' },
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
  { value: 'indicacao', label: 'Indicação' },
  { value: 'site', label: 'Site' },
  { value: 'cliente_antigo', label: 'Cliente antigo' },
  { value: 'outro', label: 'Outro' }
];

const eventTags = [
  { value: '', label: 'Sem etiqueta' },
  { value: 'cliente_problema', label: 'Cliente problema' },
  { value: 'cliente_critico', label: 'Cliente crítico' },
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

function toDatetimeLocal(date) {
  return format(date, "yyyy-MM-dd'T'HH:mm");
}

function normalizeStatus(status = '') {
  return status === 'aguardando_resposta' ? 'orcamento_enviado' : status;
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
  const [tagFilter, setTagFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedBudget, setCopiedBudget] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const statusCounts = useMemo(() => {
    return events.reduce((counts, event) => {
      const status = normalizeStatus(event.status);
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, { all: events.length });
  }, [events]);

  const typeCounts = useMemo(() => {
    return events.reduce((counts, event) => {
      counts[event.type] = (counts[event.type] || 0) + 1;
      return counts;
    }, {});
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => (statusFilter ? normalizeStatus(event.status) === statusFilter : true))
      .filter((event) => (tagFilter ? event.tag === tagFilter : true))
      .filter((event) => (typeFilter ? event.type === typeFilter : true));
  }, [events, statusFilter, tagFilter, typeFilter]);

  function load() {
    api('/events').then(setEvents).catch(console.error);
    api('/clients').then(setClients).catch(console.error);
  }

  useEffect(() => {
    load();
  }, []);

  function clearFilters() {
    setStatusFilter('');
    setTagFilter('');
    setTypeFilter('');
    setFiltersOpen(false);
  }

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
      notes:
        current.notes ||
        'Orçamento enviado. Se não responder até amanhã, chamar perguntando se viu e se posso ajudar em algo.'
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
          title: `Orçamento ${budgetCard.studioName}`,
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
    <section className="events-page">
      <div className="events-shell">
        <header className="events-hero">
          <div className="events-hero__glow events-hero__glow--1" />
          <div className="events-hero__glow events-hero__glow--2" />

          <div className="events-hero__content">
            <div className="events-hero__eyebrow">
              <Sparkles size={16} />
              Gestão premium de atendimento
            </div>

            <div className="events-hero__head">
              <div>
                <h1>Eventos & Orçamentos</h1>
                <p>
                  Organize atendimentos, filtre leads, acompanhe follow-up e envie orçamentos com uma
                  experiência muito mais bonita e profissional.
                </p>
              </div>

              <button className="primary-button hero-button" type="button" onClick={openCreateModal}>
                <Plus size={18} />
                Novo atendimento
              </button>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span>Total</span>
                <strong>{events.length}</strong>
              </div>
              <div className="hero-stat">
                <span>Pendentes</span>
                <strong>{statusCounts.orcamento_pendente || 0}</strong>
              </div>
              <div className="hero-stat">
                <span>Enviados</span>
                <strong>{statusCounts.orcamento_enviado || 0}</strong>
              </div>
              <div className="hero-stat">
                <span>Confirmados</span>
                <strong>{statusCounts.confirmado || 0}</strong>
              </div>
            </div>
          </div>
        </header>

        <div className="events-dashboard">
          <main className="events-main">
            <section className="surface-panel event-types-panel">
              <div className="section-head section-head--space">
                <div>
                  <span className="section-kicker">
                    <Sparkles size={15} />
                    Tipos de evento
                  </span>
                  <h2>Visão rápida do funil</h2>
                  <p>Escolha um tipo para focar nos atendimentos daquele serviço.</p>
                </div>
              </div>

              <div className="type-filter-grid">
                <button
                  type="button"
                  className={`type-filter-card ${!typeFilter ? 'active' : ''}`}
                  onClick={clearFilters}
                >
                  <span>Todos</span>
                  <strong>{events.length}</strong>
                </button>

                {eventTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    className={`type-filter-card ${typeFilter === type.value ? 'active' : ''}`}
                    onClick={() => setTypeFilter(type.value)}
                  >
                    <span>{type.label}</span>
                    <strong>{typeCounts[type.value] || 0}</strong>
                  </button>
                ))}
              </div>
            </section>

            <section className="surface-panel">
              <div className="section-head section-head--space">
                <div>
                  <span className="section-kicker">
                    <DollarSign size={15} />
                    Lista principal
                  </span>
                  <h2>Atendimentos</h2>
                  <p>Veja quem precisa de resposta, orçamento, acompanhamento ou fechamento.</p>
                </div>

                <div className="list-tools">
                  <div className="active-filters">
                    {statusFilter && (
                      <button className="filter-pill" type="button" onClick={() => setStatusFilter('')}>
                        {labels[statusFilter] || statusFilter}
                        <X size={14} />
                      </button>
                    )}
                    {tagFilter && (
                      <button className="filter-pill" type="button" onClick={() => setTagFilter('')}>
                        {labels[tagFilter] || tagFilter}
                        <X size={14} />
                      </button>
                    )}
                    {typeFilter && (
                      <button className="filter-pill" type="button" onClick={() => setTypeFilter('')}>
                        {labels[typeFilter] || typeFilter}
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="filter-menu">
                    <button
                      className="icon-button filter-menu__trigger"
                      type="button"
                      onClick={() => setFiltersOpen((open) => !open)}
                      aria-label="Abrir filtros"
                      aria-expanded={filtersOpen}
                    >
                      <SlidersHorizontal size={18} />
                    </button>

                    {filtersOpen && (
                      <div className="filter-popover">
                        <div className="filter-popover__head">
                          <div>
                            <span>Filtros</span>
                            <strong>Status e prioridades</strong>
                          </div>
                          <button className="icon-button icon-button--small" type="button" onClick={() => setFiltersOpen(false)} aria-label="Fechar filtros">
                            <X size={16} />
                          </button>
                        </div>

                        <div className="filter-group">
                          <h3>Status</h3>
                          <div className="status-filter-grid">
                            {statuses.map((status) => (
                              <button
                                key={status.value}
                                type="button"
                                className={`status-filter-card ${statusFilter === status.value ? 'active' : ''}`}
                                onClick={() => setStatusFilter(status.value)}
                              >
                                <span>{status.label}</span>
                                <strong>{statusCounts[status.value] || 0}</strong>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="filter-group">
                          <h3>Prioridades</h3>
                          <div className="tag-card-grid premium-tag-grid">
                            {eventTags.slice(1).map((tag) => (
                              <button
                                key={tag.value}
                                type="button"
                                className={`tag-card ${tagFilter === tag.value ? 'active' : ''}`}
                                onClick={() => setTagFilter(tag.value)}
                              >
                                {tag.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button className="soft-button full-width" type="button" onClick={clearFilters}>
                          Limpar filtros
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lead-list premium-lead-list">
                {filteredEvents.map((event) => (
                  <article className="lead-card premium-lead-card" key={event._id} onClick={() => setSelectedEvent(event)}>
                    <div className="lead-card__accent" />

                    <div className="lead-card-top">
                      <div className="lead-card-title-wrap">
                        <div className="lead-card-pill-row">
                          <span className="event-type-pill">{labels[event.type] || event.type}</span>
                          {event.tag && <span className="event-tag-pill">{labels[event.tag] || event.tag}</span>}
                        </div>
                        <h3>{event.clientId?.name || 'Cliente sem nome'}</h3>
                        <p className="lead-card-subtitle">
                          {labels[event.source] || event.source || 'Origem não informada'}
                        </p>
                      </div>

                      <span className={`badge ${statusClass(event.status)}`}>
                        {labels[normalizeStatus(event.status)] || event.status}
                      </span>
                    </div>

                    <div className="lead-meta premium-meta">
                      <span><Instagram size={16} /> {labels[event.source] || event.source || 'Origem não informada'}</span>
                      <span><CalendarDays size={16} /> {event.date ? format(new Date(event.date), 'dd/MM/yyyy HH:mm') : 'Sem data'}</span>
                      <span><Clock size={16} /> {event.endDate ? format(new Date(event.endDate), 'HH:mm') : 'Sem horário final'}</span>
                      <span><MapPin size={16} /> {event.location || 'Local não informado'}</span>
                      <span><DollarSign size={16} /> {Number(event.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      <span><UserRound size={16} /> {event.followUpAt ? `Chamar ${format(new Date(event.followUpAt), 'dd/MM HH:mm')}` : 'Sem follow-up'}</span>
                    </div>

                    <p className={event.notes ? 'event-notes premium-notes' : 'event-notes premium-notes muted'}>
                      {event.notes || 'Sem observações adicionais.'}
                    </p>

                    <div className="event-actions premium-actions">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          editEvent(event);
                        }}
                      >
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

                      <button
                        type="button"
                        className="ghost-button"
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          copyLink(event);
                        }}
                      >
                        <Copy size={16} />
                        {copiedId === event._id ? 'Link copiado' : 'Copiar link'}
                      </button>

                      <button
                        type="button"
                        className="ghost-button danger-button"
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          deleteEvent(event);
                        }}
                      >
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  </article>
                ))}

                {filteredEvents.length === 0 && (
                  <div className="empty-state premium-empty">
                    <Sparkles size={24} />
                    <strong>Nenhum atendimento nesse filtro</strong>
                    <p>Cadastre um novo lead ou limpe os filtros para ver tudo novamente.</p>
                  </div>
                )}
              </div>
            </section>
          </main>

          <aside className="events-sidebar">
            <div className="surface-panel sidebar-panel sticky-panel">
              <div className="section-head">
                <div>
                  <span className="section-kicker">
                    <Clock size={15} />
                    Filtros
                  </span>
                  <h2>Status</h2>
                  <p>Filtre rapidamente o estágio do atendimento.</p>
                </div>
              </div>

              <div className="status-filter-grid">
                {statuses.map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    className={`status-filter-card ${statusFilter === status.value ? 'active' : ''}`}
                    onClick={() => setStatusFilter(status.value)}
                  >
                    <span>{status.label}</span>
                    <strong>{statusCounts[status.value] || 0}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="surface-panel sidebar-panel sticky-panel sticky-panel--offset">
              <div className="section-head">
                <div>
                  <span className="section-kicker">
                    <Sparkles size={15} />
                    Etiquetas
                  </span>
                  <h2>Prioridades</h2>
                  <p>Destaque clientes importantes e casos sensíveis.</p>
                </div>
              </div>

              <div className="tag-card-grid premium-tag-grid">
                {eventTags.slice(1).map((tag) => (
                  <button
                    key={tag.value}
                    type="button"
                    className={`tag-card ${tagFilter === tag.value ? 'active' : ''}`}
                    onClick={() => setTagFilter(tag.value)}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              <button className="soft-button full-width" type="button" onClick={clearFilters}>
                Limpar filtros
              </button>
            </div>
          </aside>
        </div>
      </div>

      {formOpen && (
        <div className="event-modal-backdrop premium-backdrop" role="dialog" aria-modal="true">
          <form className="event-modal premium-modal" onSubmit={submit}>
            <div className="event-modal-head premium-modal-head">
              <div>
                <span className="modal-kicker">
                  <CalendarDays size={16} />
                  {editingId ? 'Editar atendimento' : 'Novo atendimento'}
                </span>
                <h2>{editingId ? 'Atualize os dados do orçamento' : 'Cadastrar novo atendimento'}</h2>
                <p>Preencha os dados e gere a mensagem pronta para enviar à cliente.</p>
              </div>

              <button className="icon-button" type="button" onClick={closeFormModal} aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <div className="event-create-grid premium-create-grid">
              <div className="event-create-form premium-form">
                <FormField label="Cliente">
                  <select required value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                    <option value="">Selecione</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Tipo de evento ou ensaio">
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <optgroup label="Eventos">
                      {eventTypes.slice(0, 6).map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Ensaios e outros">
                      {eventTypes.slice(6).map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </FormField>

                <div className="form-duo">
                  <FormField label="Origem">
                    <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
                      {sources.map((source) => (
                        <option key={source.value} value={source.value}>
                          {source.label}
                        </option>
                      ))}
                    </select>
                  </FormField>

                  <FormField label="Status">
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </FormField>
                </div>

                <FormField label="Etiqueta">
                  <select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
                    {eventTags.map((tag) => (
                      <option key={tag.value} value={tag.value}>
                        {tag.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <div className="form-duo">
                  <FormField label="Data e horário de início">
                    <input
                      type="datetime-local"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                  </FormField>

                  <FormField label="Próximo contato">
                    <input
                      type="datetime-local"
                      value={form.followUpAt}
                      onChange={(e) => setForm({ ...form, followUpAt: e.target.value })}
                    />
                  </FormField>
                </div>

                <FormField label="Local">
                  <input
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Ex.: salão, igreja, casa, estúdio..."
                  />
                </FormField>

                <FormField label="Valor do orçamento">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </FormField>

                <FormField label="Observações do atendimento">
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Ex.: pediu pelo Instagram, quer saber pacote, chamar de novo semana que vem..."
                  />
                </FormField>
              </div>

              <div className="budget-preview premium-preview">
                <div className="budget-preview-head premium-preview-head">
                  <div>
                    <strong>Orçamento pronto</strong>
                    <span>Mensagem e cartão prontos para compartilhar.</span>
                  </div>
                  <Sparkles size={18} />
                </div>

                <div className="budget-card premium-budget-card">
                  <div className="budget-card-top">
                    <div className="budget-card-brand">
                      <div className="budget-card-logo">
                        <img src="/vida-em-foco-logo.jpeg" alt="Logo Mel Fotografia" />
                      </div>
                      <div>
                        <span>{budgetCard.studioName}</span>
                        <small>Atendimento fotográfico</small>
                      </div>
                    </div>
                    <div className="budget-card-title">
                      <span>Proposta</span>
                      <strong>Orçamento fotográfico</strong>
                    </div>
                  </div>

                  <div className="budget-card-client">
                    <span>Cliente</span>
                    <strong>{budgetCard.clientName}</strong>
                  </div>

                  <div className="budget-card-grid">
                    <div><span>Serviço</span><strong>{budgetCard.type}</strong></div>
                    <div><span>Data</span><strong>{budgetCard.date}</strong></div>
                    <div><span>Horário</span><strong>{budgetCard.time}</strong></div>
                    <div><span>Local</span><strong>{budgetCard.location}</strong></div>
                  </div>

                  <div className="budget-card-price">
                    <span>Investimento</span>
                    <strong>{budgetCard.price}</strong>
                  </div>
                </div>

                <pre className="budget-message">{budgetText}</pre>

                <div className="budget-actions premium-budget-actions">
                  <button type="button" className="ghost-button" onClick={sendBudgetPreset}>
                    <MessageCircle size={16} />
                    Marcar como enviado
                  </button>

                  <button type="button" className="ghost-button" onClick={() => copyBudget()}>
                    <Copy size={16} />
                    {copiedBudget ? 'Copiado' : 'Copiar orçamento'}
                  </button>

                  <button className="primary-button" type="button" onClick={sendBudgetWhatsApp}>
                    <MessageCircle size={16} />
                    Enviar WhatsApp
                  </button>

                  <button type="button" className="soft-button full-action" onClick={() => downloadBudgetCard()}>
                    <Download size={16} />
                    Baixar cartão
                  </button>
                </div>
              </div>
            </div>

            <div className="event-modal-actions premium-modal-actions">
              <button className="soft-button" type="button" onClick={closeFormModal}>
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
    type: labels[data.type] || 'Serviço fotográfico',
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
      <stop offset="0%" stop-color="#fff7fb"/>
      <stop offset="48%" stop-color="#f5e5ee"/>
      <stop offset="100%" stop-color="#6b3750"/>
    </linearGradient>
    <linearGradient id="rose" x1="0" x2="1">
      <stop offset="0%" stop-color="#d89ab5"/>
      <stop offset="100%" stop-color="#91506e"/>
    </linearGradient>
  </defs>
  <rect width="1080" height="1350" rx="72" fill="url(#bg)"/>
  <circle cx="920" cy="180" r="190" fill="#ffffff" opacity="0.25"/>
  <circle cx="130" cy="1180" r="260" fill="#ffffff" opacity="0.18"/>
  <rect x="90" y="96" width="900" height="1158" rx="54" fill="#fffdfd" opacity="0.96"/>
  <rect x="130" y="136" width="820" height="108" rx="32" fill="#fff2f7"/>
  <circle cx="194" cy="190" r="40" fill="#ffffff" opacity="0.96"/>
  ${safeLogoUrl ? `<image href="${safeLogoUrl}" x="154" y="150" width="80" height="80" preserveAspectRatio="xMidYMid slice" clip-path="circle(40px at 194px 190px)" />` : ''}
  <text x="254" y="180" font-family="Arial, sans-serif" font-size="30" fill="#8f526b" font-weight="800">${safe.studioName}</text>
  <text x="254" y="218" font-family="Arial, sans-serif" font-size="22" fill="#8b7280">Orçamento fotográfico</text>
  <rect x="130" y="304" width="820" height="174" rx="36" fill="url(#rose)"/>
  <text x="170" y="365" font-family="Arial, sans-serif" font-size="24" fill="#ffeef4">Cliente</text>
  <text x="170" y="425" font-family="Arial, sans-serif" font-size="52" fill="#ffffff" font-weight="800">${safe.clientName}</text>
  <text x="130" y="570" font-family="Arial, sans-serif" font-size="24" fill="#8b7280" font-weight="700">Serviço</text>
  <text x="130" y="615" font-family="Arial, sans-serif" font-size="38" fill="#3f2b34" font-weight="800">${safe.type}</text>
  <text x="130" y="705" font-family="Arial, sans-serif" font-size="24" fill="#8b7280" font-weight="700">Data</text>
  <text x="130" y="750" font-family="Arial, sans-serif" font-size="36" fill="#3f2b34" font-weight="800">${safe.date}</text>
  <text x="580" y="705" font-family="Arial, sans-serif" font-size="24" fill="#8b7280" font-weight="700">Horário</text>
  <text x="580" y="750" font-family="Arial, sans-serif" font-size="34" fill="#3f2b34" font-weight="800">${safe.time}</text>
  <text x="130" y="840" font-family="Arial, sans-serif" font-size="24" fill="#8b7280" font-weight="700">Local</text>
  <text x="130" y="886" font-family="Arial, sans-serif" font-size="34" fill="#3f2b34" font-weight="800">${safe.location}</text>
  <rect x="130" y="982" width="820" height="150" rx="34" fill="#fff2f7"/>
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
      throw new Error('Não foi possível gerar a imagem do cartão.');
    }
    context.drawImage(image, 0, 0);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) {
      throw new Error('Não foi possível converter o cartão em imagem.');
    }

    return new File([blob], `orcamento-${data.clientName.replace(/\s+/g, '-').toLowerCase()}.png`, {
      type: 'image/png'
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
