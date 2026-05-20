import { Banknote, CreditCard, DollarSign, Receipt, Trash2, Wallet } from 'lucide-react';
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

function OpsMetric({ icon: Icon, label, value, helper, tone = '' }) {
  return (
    <div className={`ops-metric ${tone}`}>
      <Icon size={18} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </div>
  );
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
    <section className="page ops-page finance-page">
      <div className="ops-header">
        <div>
          <span className="hero-eyebrow rose">Financeiro</span>
          <h1>Caixa dos eventos fechados</h1>
          <p>Somente contratos confirmados, em andamento ou finalizados entram no financeiro.</p>
        </div>
        <div className="ops-header-control">
          <span>Periodo</span>
          <input
            type="month"
            value={period}
            onChange={(event) => setPeriod(event.target.value || currentPeriod())}
            aria-label="Selecionar mes financeiro"
          />
        </div>
      </div>

      <div className="ops-metrics-grid four">
        <OpsMetric icon={DollarSign} label="Contratado" value={money.format(total)} helper="Total fechado no periodo" />
        <OpsMetric icon={Wallet} label="Recebido" value={money.format(paid)} helper="Entradas desses contratos" tone="success" />
        <OpsMetric icon={Receipt} label="A receber" value={money.format(pending)} helper="Saldo pendente" tone="warning" />
        <OpsMetric icon={Banknote} label="Entrou no mes" value={money.format(receivedThisMonth)} helper="Pagamentos recebidos" />
      </div>

      <div className="ops-workspace finance-ledger">
        <section className="ops-section finance-ledger-main">
          <div className="ops-section-head">
            <div>
              <h2>Eventos fechados</h2>
              <p>Tabela de contratos do periodo com saldo e progresso de pagamento.</p>
            </div>
          </div>

          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Evento</th>
                  <th>Status</th>
                  <th>Contrato</th>
                  <th>Pago</th>
                  <th>Saldo</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {eventBalances.map((event) => (
                  <tr key={event._id}>
                    <td>{event.clientId?.name || 'Cliente sem nome'}</td>
                    <td>{typeLabels[event.type] || event.type || 'Evento'}</td>
                    <td>{statusLabels[event.status] || event.status}</td>
                    <td>{money.format(event.price || 0)}</td>
                    <td>{money.format(event.paidValue)}</td>
                    <td>{money.format(event.pendingValue)}</td>
                    <td>{event.progress}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!eventBalances.length && !loading && (
              <div className="ops-empty">Nenhum evento fechado no periodo selecionado.</div>
            )}
          </div>
        </section>

        <aside className="ops-inspector">
          <form className="ops-section ops-form-panel" onSubmit={submit}>
            <div className="ops-section-head">
              <div>
                <h2>Registrar pagamento</h2>
                <p>Lancamento rapido em contrato fechado.</p>
              </div>
              <CreditCard size={18} />
            </div>

            <FormField label="Evento fechado">
              <select required value={form.eventId} onChange={(e) => setForm({ ...form, eventId: e.target.value })}>
                <option value="">Selecione</option>
                {events.map((event) => (
                  <option key={event._id} value={event._id}>{eventTitle(event)}</option>
                ))}
              </select>
            </FormField>

            {selectedEvent && (
              <div className="ops-mini-ledger">
                <span>Contrato <strong>{money.format(selectedEvent.price || 0)}</strong></span>
                <span>Pago <strong>{money.format(selectedPaid)}</strong></span>
                <span>Saldo <strong>{money.format(selectedPending)}</strong></span>
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
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Entrada, restante, parcelamento..." />
            </FormField>

            <button className="primary-button" disabled={!events.length}>Registrar pagamento</button>
          </form>

          <section className="ops-section">
            <div className="ops-section-head">
              <div>
                <h2>Pagamentos</h2>
                <p>Entradas registradas no periodo.</p>
              </div>
            </div>
            <div className="ops-list">
              {payments.map((payment) => (
                <div className="ops-list-row" key={payment._id}>
                  <div>
                    <strong>{payment.eventId?.clientId?.name || 'Cliente sem nome'}</strong>
                    <span>{methodLabels[payment.method] || payment.method} - {new Date(payment.paidAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <b>{money.format(payment.amount)}</b>
                  <button className="icon-button danger-button" type="button" onClick={() => deletePayment(payment)} aria-label="Excluir pagamento">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {!payments.length && <div className="ops-empty">Nenhum pagamento registrado.</div>}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
