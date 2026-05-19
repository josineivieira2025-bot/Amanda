import {
  Banknote,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Receipt,
  Trash2,
  Wallet,
  WalletCards
} from 'lucide-react';
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

const statusLabels = {
  confirmado: 'Confirmado',
  em_andamento: 'Em andamento',
  finalizado: 'Finalizado'
};

const methodLabels = {
  pix: 'Pix',
  cartao: 'Cartao',
  dinheiro: 'Dinheiro',
  boleto: 'Boleto',
  transferencia: 'Transferencia'
};

const methods = Object.entries(methodLabels).map(([value, label]) => ({ value, label }));

function currentPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function parsePeriod(period) {
  const [year, month] = period.split('-');
  return { year, month };
}

function eventTitle(event) {
  return `${typeLabels[event.type] || event.type || 'Evento'} - ${event.clientId?.name || 'Cliente sem nome'}`;
}

export function Finance() {
  const [events, setEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [period, setPeriod] = useState(currentPeriod);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    eventId: '',
    amount: '',
    method: 'pix',
    paidAt: new Date().toISOString().slice(0, 10),
    notes: ''
  });

  function load() {
    const { month, year } = parsePeriod(period);
    const query = `month=${month}&year=${year}`;

    setLoading(true);
    Promise.all([
      api(`/payments?${query}`),
      api(`/payments/summary?${query}`)
    ])
      .then(([paymentItems, summaryData]) => {
        const periodEvents = summaryData.events || [];
        setEvents(periodEvents);
        setPayments(paymentItems);
        setSummary(summaryData);
        setForm((current) => ({
          ...current,
          eventId: periodEvents.some((event) => event._id === current.eventId)
            ? current.eventId
            : periodEvents[0]?._id || ''
        }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(load, [period]);

  const paid = summary?.paid || 0;
  const total = summary?.total || 0;
  const pending = summary?.pending || 0;
  const receivedThisMonth = summary?.receivedThisMonth || 0;
  const percent = total > 0 ? Math.min(Math.round((paid / total) * 100), 100) : 0;

  const selectedEvent = useMemo(
    () => events.find((event) => event._id === form.eventId),
    [events, form.eventId]
  );

  const summaryPaymentsByEvent = useMemo(() => {
    return (summary?.payments || []).reduce((groups, payment) => {
      const eventId = String(payment.eventId?._id || payment.eventId || '');
      groups[eventId] = (groups[eventId] || 0) + Number(payment.amount || 0);
      return groups;
    }, {});
  }, [summary?.payments]);

  const eventBalances = useMemo(() => {
    return (summary?.events || []).map((event) => {
      const paidValue = summaryPaymentsByEvent[String(event._id)] || 0;
      const totalValue = Number(event.price || 0);
      return {
        ...event,
        paidValue,
        pendingValue: Math.max(totalValue - paidValue, 0),
        progress: totalValue > 0 ? Math.min(Math.round((paidValue / totalValue) * 100), 100) : 0
      };
    });
  }, [summary?.events, summaryPaymentsByEvent]);

  const selectedPaid = selectedEvent ? summaryPaymentsByEvent[String(selectedEvent._id)] || 0 : 0;
  const selectedPending = selectedEvent ? Math.max(Number(selectedEvent.price || 0) - selectedPaid, 0) : 0;

  async function submit(event) {
    event.preventDefault();
    if (!form.eventId) return;

    try {
      await api('/payments', {
        method: 'POST',
        body: JSON.stringify({ ...form, amount: Number(form.amount || 0) })
      });
      setForm((current) => ({ ...current, amount: '', notes: '' }));
      load();
    } catch (error) {
      alert(error.message || 'Nao foi possivel registrar o pagamento.');
    }
  }

  async function deletePayment(payment) {
    const confirmed = window.confirm(`Excluir pagamento de ${money.format(payment.amount)}?`);
    if (!confirmed) return;
    await api(`/payments/${payment._id}`, { method: 'DELETE' });
    load();
  }

  return (
    <section className="page finance-page finance-pro-page">
      <div className="finance-hero finance-pro-hero">
        <div>
          <span className="hero-eyebrow rose">Financeiro</span>
          <h1>Caixa dos eventos fechados</h1>
          <p>
            Aqui entram somente eventos com status Confirmado, Em andamento ou Finalizado.
            Orcamentos pendentes e aguardando resposta ficam fora do financeiro.
          </p>
          <div className="hero-footer">
            <span className="hero-chip rose-chip"><CheckCircle2 size={16} /> {eventBalances.length} fechado(s) no periodo</span>
            <span className="hero-chip rose-chip"><WalletCards size={16} /> {money.format(receivedThisMonth)} recebido no mes</span>
          </div>
        </div>

        <div className="finance-progress-card finance-period-card">
          <span>Periodo</span>
          <input
            type="month"
            value={period}
            onChange={(event) => setPeriod(event.target.value || currentPeriod())}
            aria-label="Selecionar mes financeiro"
          />
          <strong>{percent}%</strong>
          <div className="finance-progress"><i style={{ width: `${percent}%` }} /></div>
          <small>{money.format(paid)} recebido de {money.format(total)} contratado</small>
        </div>
      </div>

      <div className="finance-metrics finance-pro-metrics">
        <div className="finance-metric">
          <DollarSign size={20} />
          <span>Contratado fechado</span>
          <strong>{money.format(total)}</strong>
          <small>Soma dos eventos fechados no periodo</small>
        </div>
        <div className="finance-metric success">
          <Wallet size={20} />
          <span>Recebido desses eventos</span>
          <strong>{money.format(paid)}</strong>
          <small>Entradas registradas nesses contratos</small>
        </div>
        <div className="finance-metric warning">
          <Receipt size={20} />
          <span>A receber</span>
          <strong>{money.format(pending)}</strong>
          <small>Saldo pendente dos eventos fechados</small>
        </div>
        <div className="finance-metric accent">
          <Banknote size={20} />
          <span>Entrou no mes</span>
          <strong>{money.format(receivedThisMonth)}</strong>
          <small>Pagamentos recebidos neste periodo</small>
        </div>
      </div>

      <div className="finance-workspace">
        <form className="panel form-panel finance-payment-panel" onSubmit={submit}>
          <div className="compact-head">
            <div>
              <h2>Novo pagamento</h2>
              <p>Registre entradas apenas em contratos fechados.</p>
            </div>
            <div className="section-icon"><CreditCard size={18} /></div>
          </div>

          <FormField label="Evento fechado">
            <select required value={form.eventId} onChange={(e) => setForm({ ...form, eventId: e.target.value })}>
              <option value="">Selecione</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {eventTitle(event)}
                </option>
              ))}
            </select>
          </FormField>

          {selectedEvent && (
            <div className="finance-selected-event finance-selected-event-pro">
              <div>
                <span>Valor do contrato</span>
                <strong>{money.format(selectedEvent.price || 0)}</strong>
              </div>
              <div>
                <span>Ja pago</span>
                <strong>{money.format(selectedPaid)}</strong>
              </div>
              <div>
                <span>Falta receber</span>
                <strong>{money.format(selectedPending)}</strong>
              </div>
            </div>
          )}

          <FormField label="Valor recebido">
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0,00"
            />
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

          <button className="primary-button" disabled={!events.length}>Registrar pagamento</button>
        </form>

        <div className="finance-side-stack">
          <div className="panel finance-balance-panel">
            <div className="compact-head">
              <div>
                <h2>Saldos por evento</h2>
                <p>Somente contratos fechados do periodo selecionado.</p>
              </div>
              <CalendarDays size={20} />
            </div>

            <div className="finance-balance-list">
              {loading ? (
                <div className="empty-state">
                  <strong>Carregando financeiro</strong>
                  <p>Buscando contratos e pagamentos.</p>
                </div>
              ) : eventBalances.length ? (
                eventBalances.map((event) => (
                  <article className="finance-balance-card" key={event._id}>
                    <div className="finance-balance-head">
                      <div>
                        <strong>{event.clientId?.name || 'Cliente sem nome'}</strong>
                        <span>{typeLabels[event.type] || event.type} - {statusLabels[event.status] || event.status}</span>
                      </div>
                      <b>{money.format(event.price || 0)}</b>
                    </div>
                    <div className="finance-balance-progress">
                      <i style={{ width: `${event.progress}%` }} />
                    </div>
                    <div className="finance-balance-foot">
                      <span>Pago: {money.format(event.paidValue)}</span>
                      <span>Falta: {money.format(event.pendingValue)}</span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <strong>Nenhum evento fechado nesse mes</strong>
                  <p>Quando um atendimento virar Confirmado, Em andamento ou Finalizado, ele aparece aqui.</p>
                </div>
              )}
            </div>
          </div>

          <div className="panel">
            <div className="compact-head">
              <div>
                <h2>Pagamentos do periodo</h2>
                <p>Historico de entradas registradas no mes selecionado.</p>
              </div>
            </div>

            <div className="payment-list finance-payment-list">
              {payments.map((payment) => (
                <article className="payment-card finance-payment-card" key={payment._id}>
                  <div>
                    <span>{payment.eventId?.clientId?.name || 'Cliente sem nome'}</span>
                    <strong>{money.format(payment.amount)}</strong>
                    <small>
                      {methodLabels[payment.method] || payment.method} - {new Date(payment.paidAt).toLocaleDateString('pt-BR')}
                    </small>
                  </div>
                  <button className="icon-button danger-button" type="button" onClick={() => deletePayment(payment)} aria-label="Excluir pagamento">
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
              {payments.length === 0 && (
                <div className="empty-state">
                  <strong>Nenhum pagamento registrado nesse periodo</strong>
                  <p>Registre uma entrada ou altere o mes para consultar pagamentos antigos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
