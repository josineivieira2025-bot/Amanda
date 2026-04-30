import { format } from 'date-fns';
import { CalendarDays, Save, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { FormField } from './FormField.jsx';

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

function toDatetimeLocal(value) {
  if (!value) return '';
  return format(new Date(value), "yyyy-MM-dd'T'HH:mm");
}

function eventToForm(event) {
  return {
    clientId: event.clientId?._id || event.clientId || '',
    type: event.type || 'aniversario_infantil',
    source: event.source || 'instagram',
    status: event.status || 'orcamento_pendente',
    date: toDatetimeLocal(event.date),
    endDate: toDatetimeLocal(event.endDate),
    followUpAt: toDatetimeLocal(event.followUpAt),
    location: event.location || '',
    price: Number(event.price || 0),
    notes: event.notes || ''
  };
}

export function EventModal({ event, open, onClose, onSaved }) {
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !event) return;
    setForm(eventToForm(event));
    api('/clients').then(setClients).catch(console.error);
  }, [open, event]);

  if (!open || !event || !form) return null;

  async function submit(submitEvent) {
    submitEvent.preventDefault();
    setSaving(true);
    try {
      await api(`/events/${event._id}`, { method: 'PUT', body: JSON.stringify(form) });
      onSaved?.();
      onClose?.();
    } finally {
      setSaving(false);
    }
  }

  async function destroy() {
    const confirmed = window.confirm('Excluir este evento/orcamento?');
    if (!confirmed) return;
    await api(`/events/${event._id}`, { method: 'DELETE' });
    onSaved?.();
    onClose?.();
  }

  return (
    <div className="event-modal-backdrop" role="dialog" aria-modal="true">
      <form className="event-modal" onSubmit={submit}>
        <div className="event-modal-head">
          <div>
            <span><CalendarDays size={16} /> Evento</span>
            <h2>{event.clientId?.name || 'Cliente sem nome'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <div className="event-modal-grid">
          <FormField label="Cliente">
            <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
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

          <FormField label="Inicio">
            <input type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </FormField>

          <FormField label="Final">
            <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </FormField>

          <FormField label="Proximo contato">
            <input type="datetime-local" value={form.followUpAt} onChange={(e) => setForm({ ...form, followUpAt: e.target.value })} />
          </FormField>

          <FormField label="Valor">
            <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </FormField>
        </div>

        <FormField label="Local">
          <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </FormField>

        <FormField label="Observacoes">
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </FormField>

        <div className="event-modal-actions">
          <button className="ghost-button danger-button" type="button" onClick={destroy}>
            <Trash2 size={17} />
            Excluir
          </button>
          <button className="primary-button" disabled={saving}>
            <Save size={17} />
            {saving ? 'Salvando...' : 'Salvar alteracoes'}
          </button>
        </div>
      </form>
    </div>
  );
}
