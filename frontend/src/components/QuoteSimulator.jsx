import { CalendarDays, Check, Clock3, MapPin, MessageCircle, PartyPopper, Phone, Sparkles, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { quoteFormDefaults } from '../data/publicSite.js';

function formatMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function buildInitialState(initialServiceSlug) {
  return { ...quoteFormDefaults, serviceSlug: initialServiceSlug || '' };
}

export function QuoteSimulator({ catalog = [], initialServiceSlug = '', compact = false }) {
  const [form, setForm] = useState(buildInitialState(initialServiceSlug));
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm((current) => ({
      ...current,
      serviceSlug: initialServiceSlug || current.serviceSlug || catalog[0]?.slug || ''
    }));
  }, [catalog, initialServiceSlug]);

  const service = useMemo(
    () => catalog.find((item) => item.slug === form.serviceSlug) || catalog[0] || null,
    [catalog, form.serviceSlug]
  );

  const selectedPackage = useMemo(
    () => service?.packages.find((item) => item.id === form.packageId) || service?.packages[0] || null,
    [service, form.packageId]
  );

  const selectedExtras = useMemo(
    () => service?.extras.filter((item) => form.extraIds.includes(item.id)) || [],
    [form.extraIds, service]
  );

  const total = useMemo(() => {
    const base = Number(selectedPackage?.price || 0);
    return base + selectedExtras.reduce((sum, item) => sum + Number(item.price || 0), 0);
  }, [selectedExtras, selectedPackage]);

  useEffect(() => {
    if (!service || form.packageId) return;
    setForm((current) => ({ ...current, packageId: service.packages[0]?.id || '' }));
  }, [form.packageId, service]);

  function updateField(field, value) {
    setDone(null);
    setError('');
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleExtra(extraId) {
    setDone(null);
    setError('');
    setForm((current) => ({
      ...current,
      extraIds: current.extraIds.includes(extraId)
        ? current.extraIds.filter((item) => item !== extraId)
        : [...current.extraIds, extraId]
    }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!service || !selectedPackage) return;

    try {
      setLoading(true);
      const payload = {
        ...form,
        packageId: selectedPackage.id,
        serviceSlug: service.slug,
        pricePreview: total
      };
      const response = await api('/public/quote-request', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setDone(response);
      setForm(buildInitialState(initialServiceSlug || service.slug));
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setLoading(false);
    }
  }

  if (!catalog.length) {
    return <div className="site-loading-card">Carregando simulador...</div>;
  }

  return (
    <form className={`quote-simulator ${compact ? 'compact' : ''}`} onSubmit={submit}>
      <div className="quote-header">
        <div>
          <span className="site-kicker">Simulador</span>
          <h2>Monte seu orcamento</h2>
          <p>Escolha o tipo de evento, pacote, extras e envie tudo direto para o atendimento da Vida em Foco.</p>
        </div>
        <div className="quote-price-card">
          <span>Estimativa atual</span>
          <strong>{formatMoney(total)}</strong>
          <small>{selectedPackage ? `${selectedPackage.name} • ${selectedPackage.hours}h` : 'Escolha um pacote'}</small>
        </div>
      </div>

      {done && (
        <div className="success">
          {done.message} Sua simulacao ja entrou no ERP para acompanhamento.
        </div>
      )}
      {error && <div className="error">{error}</div>}

      <div className="quote-grid">
        <div className="quote-main">
          <div className="quote-section">
            <h3><PartyPopper size={18} /> Escolha o servico</h3>
            <div className="service-picker">
              {catalog.map((item) => (
                <button
                  key={item.slug}
                  className={item.slug === service?.slug ? 'service-tile active' : 'service-tile'}
                  type="button"
                  onClick={() => updateField('serviceSlug', item.slug)}
                >
                  <strong>{item.name}</strong>
                  <span>{item.summary}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="quote-section">
            <h3><Sparkles size={18} /> Selecione o pacote</h3>
            <div className="package-grid">
              {service?.packages.map((item) => (
                <button
                  key={item.id}
                  className={item.id === selectedPackage?.id ? 'package-card active' : 'package-card'}
                  type="button"
                  onClick={() => updateField('packageId', item.id)}
                >
                  <span>{item.name}</span>
                  <strong>{formatMoney(item.price)}</strong>
                  <small>{item.hours} horas • entrega em ate {item.deliveryDays} dias</small>
                </button>
              ))}
            </div>
          </div>

          <div className="quote-section">
            <h3><Check size={18} /> Extras opcionais</h3>
            <div className="extras-grid">
              {service?.extras.map((item) => (
                <label key={item.id} className={form.extraIds.includes(item.id) ? 'extra-chip active' : 'extra-chip'}>
                  <input
                    type="checkbox"
                    checked={form.extraIds.includes(item.id)}
                    onChange={() => toggleExtra(item.id)}
                  />
                  <span>{item.name}</span>
                  <strong>{formatMoney(item.price)}</strong>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="quote-sidebar">
          <div className="quote-section">
            <h3><UserRound size={18} /> Seus dados</h3>
            <div className="quote-form-grid">
              <label className="quote-field">
                <span>Nome</span>
                <input required value={form.name} onChange={(event) => updateField('name', event.target.value)} />
              </label>
              <label className="quote-field">
                <span>Email</span>
                <input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} />
              </label>
              <label className="quote-field">
                <span>WhatsApp</span>
                <input required value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
              </label>
              <label className="quote-field">
                <span>Local do evento</span>
                <div className="quote-input-icon">
                  <MapPin size={16} />
                  <input required value={form.location} onChange={(event) => updateField('location', event.target.value)} />
                </div>
              </label>
              <label className="quote-field">
                <span>Data desejada</span>
                <div className="quote-input-icon">
                  <CalendarDays size={16} />
                  <input type="datetime-local" required value={form.eventDate} onChange={(event) => updateField('eventDate', event.target.value)} />
                </div>
              </label>
              <label className="quote-field">
                <span>Horario final</span>
                <div className="quote-input-icon">
                  <Clock3 size={16} />
                  <input type="datetime-local" value={form.eventEndDate} onChange={(event) => updateField('eventEndDate', event.target.value)} />
                </div>
              </label>
              <label className="quote-field">
                <span>Quantidade de convidados</span>
                <input value={form.guestCount} onChange={(event) => updateField('guestCount', event.target.value)} />
              </label>
              <label className="quote-field">
                <span>Como prefere contato?</span>
                <select value={form.contactPreference} onChange={(event) => updateField('contactPreference', event.target.value)}>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="ligacao">Ligacao</option>
                  <option value="email">Email</option>
                </select>
              </label>
              <label className="quote-field full">
                <span>Conte mais sobre o que voce imagina</span>
                <textarea value={form.message} onChange={(event) => updateField('message', event.target.value)} placeholder="Estilo das fotos, horario, local, referencias ou qualquer detalhe importante." />
              </label>
            </div>
          </div>

          <div className="quote-summary">
            <div className="quote-summary-row">
              <span>Pacote</span>
              <strong>{selectedPackage?.name || '-'}</strong>
            </div>
            {selectedExtras.map((item) => (
              <div className="quote-summary-row extra" key={item.id}>
                <span>{item.name}</span>
                <strong>{formatMoney(item.price)}</strong>
              </div>
            ))}
            <div className="quote-summary-total">
              <span>Total estimado</span>
              <strong>{formatMoney(total)}</strong>
            </div>
            <button className="site-primary-button" disabled={loading}>
              <MessageCircle size={18} />
              {loading ? 'Enviando...' : 'Enviar simulacao'}
            </button>
            <small>A simulacao entra no atendimento da Vida em Foco e aparece no ERP para acompanhamento.</small>
          </div>
        </div>
      </div>
    </form>
  );
}
