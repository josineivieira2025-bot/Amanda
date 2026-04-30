import { CreditCard, DollarSign, Receipt, Trash2, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { FormField } from '../components/FormField.jsx';

const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const typeLabels = {
  aniversario_15: 'Aniversario de 15',
  aniversario_adulto: 'Aniversario adulto',
  aniversario_infantil: 'Aniversario infantil',
  casamento: 'Casamento',
  cha_revelacao: 'Cha revelacao',
  cha_de_panela: 'Cha de panela',
  corporativo: 'Corporativo',
  smash_the_cake: 'Smash the cake',
  newborn: 'Newborn',
  ensaio_infantil: 'Ensaio infantil',
  ensaio_casal: 'Ensaio de casal',
  ensaio_casamento: 'Ensaio de casamento',
  ensaio_adulto: 'Ensaio adulto',
  ensaio_gestante: 'Ensaio gestante',
  ensaio_familia: 'Ensaio de familia',
  outro: 'Outro'
};

const methods = [
  { value: 'pix', label: 'Pix' },
  { value: 'cartao', label: 'Cartao' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'boleto', label: 'Boleto' },
  { value: 'transferencia', label: 'Transferencia' }
];

export function Finance() {
  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState({
    eventId: '',
    amount: 0,
    method: 'pix',
    paidAt: new Date().toISOString().slice(0, 10),
    notes: ''
  });

  function load() {
    api('/events').then((items) => {
      setEvents(items);
      setForm((current) => ({ ...current, eventId: current.eventId || items[0]?._id || '' }));
    }).catch(console.error);
    api('/payments').then(setPayments).catch(console.error);
    api('/payments/summary').then(setSummary).catch(console.error);
  }

  useEffect(load, []);

  const paid = summary?.paid || 0;
  const total = summary?.total || 0;
  const pending = summary?.pending || 0;
  const percent = total > 0 ? Math.min(Math.round((paid / total) * 100), 100) : 0;

  const selectedEvent = useMemo(
    () => events.find((event) => event._id === form.eventId),
    [events, form.eventId]
  );

  async function submit(event) {
    event.preventDefault();
    await api('/payments', { method: 'POST', body: JSON.stringify(form) });
    setForm((current) => ({ ...current, amount: 0, notes: '' }));
    load();
  }

  async function deletePayment(payment) {
    const confirmed = window.confirm(`Excluir pagamento de ${money.format(payment.amount)}?`);
    if (!confirmed) return;
    await api(`/payments/${payment._id}`, { method: 'DELETE' });
    load();
  }

  return (
    <section className="page finance-page">
      <div className="finance-hero">
        <div>
          <span className="hero-eyebrow rose">Financeiro</span>
          <h1>Controle financeiro</h1>
          <p>Registre pagamentos, veja o que ja entrou e acompanhe pendencias do mes com clareza.</p>
        </div>
        <div className="finance-progress-card">
          <span>Recebido no mes</span>
          <strong>{percent}%</strong>
          <div className="finance-progress"><i style={{ width: `${percent}%` }} /></div>
          <small>{money.format(paid)} de {money.format(total)}</small>
        </div>
      </div>

      <div className="finance-metrics">
        <div className="finance-metric">
          <DollarSign size={20} />
          <span>Contratado</span>
          <strong>{money.format(total)}</strong>
        </div>
        <div className="finance-metric success">
          <Wallet size={20} />
          <span>Pago</span>
          <strong>{money.format(paid)}</strong>
        </div>
        <div className="finance-metric warning">
          <Receipt size={20} />
          <span>Pendente</span>
          <strong>{money.format(pending)}</strong>
        </div>
      </div>

      <div className="split finance-split">
        <form className="panel form-panel" onSubmit={submit}>
          <div className="compact-head">
            <div>
              <h2>Novo pagamento</h2>
              <p>Lance entradas e acompanhe o saldo por evento.</p>
            </div>
            <div className="section-icon"><CreditCard size={18} /></div>
          </div>

          <FormField label="Evento">
            <select required value={form.eventId} onChange={(e) => setForm({ ...form, eventId: e.target.value })}>
              <option value="">Selecione</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {typeLabels[event.type] || event.type} - {event.clientId?.name}
                </option>
              ))}
            </select>
          </FormField>

          {selectedEvent && (
            <div className="finance-selected-event">
              <span>Valor do evento</span>
              <strong>{money.format(selectedEvent.price || 0)}</strong>
            </div>
          )}

          <FormField label="Valor recebido">
            <input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} />
          </FormField>

          <div className="form-duo">
            <FormField label="Forma">
              <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                {methods.map((method) => <option key={method.value} value={method.value}>{method.label}</option>)}
              </select>
            </FormField>
            <FormField label="Pago em">
              <input type="date" value={form.paidAt} onChange={(e) => setForm({ ...form, paidAt: e.target.value })} />
            </FormField>
          </div>

          <FormField label="Observacao">
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Ex.: entrada, restante, parcelamento..." />
          </FormField>

          <button className="primary-button">Registrar pagamento</button>
        </form>

        <div className="panel">
          <div className="compact-head">
            <div>
              <h2>Pagamentos recentes</h2>
              <p>Historico de entradas registradas.</p>
            </div>
          </div>

          <div className="payment-list">
            {payments.map((payment) => (
              <article className="payment-card" key={payment._id}>
                <div>
                  <span>{typeLabels[payment.eventId?.type] || payment.eventId?.type || 'Evento'}</span>
                  <strong>{money.format(payment.amount)}</strong>
                  <small>{payment.method} - {new Date(payment.paidAt).toLocaleDateString('pt-BR')}</small>
                </div>
                <button className="icon-button danger-button" type="button" onClick={() => deletePayment(payment)} aria-label="Excluir pagamento">
                  <Trash2 size={16} />
                </button>
              </article>
            ))}
            {payments.length === 0 && (
              <div className="empty-state">
                <strong>Nenhum pagamento registrado</strong>
                <p>Quando um cliente pagar entrada ou restante, registre aqui.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
