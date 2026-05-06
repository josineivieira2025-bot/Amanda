import { BookOpen, Package, Plus, Save, Sparkles, Tag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { FormField } from '../components/FormField.jsx';

function formatMoney(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function Catalog() {
  const [services, setServices] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api('/catalog')
      .then((items) => {
        setServices(items);
        setSelectedSlug(items[0]?.slug || '');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const selectedService = useMemo(
    () => services.find((item) => item.slug === selectedSlug) || services[0] || null,
    [services, selectedSlug]
  );

  function updateServiceField(slug, field, value) {
    setMessage('');
    setError('');
    setServices((current) =>
      current.map((service) => (service.slug === slug ? { ...service, [field]: value } : service))
    );
  }

  function updatePackageField(slug, packageId, field, value) {
    setMessage('');
    setError('');
    setServices((current) =>
      current.map((service) =>
        service.slug === slug
          ? {
              ...service,
              packages: service.packages.map((item) =>
                item.id === packageId ? { ...item, [field]: field === 'name' ? value : Number(value) } : item
              )
            }
          : service
      )
    );
  }

  function updatePackageDetails(slug, packageId, value) {
    const details = value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);

    setMessage('');
    setError('');
    setServices((current) =>
      current.map((service) =>
        service.slug === slug
          ? {
              ...service,
              packages: service.packages.map((item) => (item.id === packageId ? { ...item, details } : item))
            }
          : service
      )
    );
  }

  function updateExtraField(slug, extraId, field, value) {
    setMessage('');
    setError('');
    setServices((current) =>
      current.map((service) =>
        service.slug === slug
          ? {
              ...service,
              extras: service.extras.map((item) =>
                item.id === extraId ? { ...item, [field]: field === 'name' ? value : Number(value) } : item
              )
            }
          : service
      )
    );
  }

  async function saveCatalog() {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const updated = await api('/catalog', {
        method: 'PUT',
        body: JSON.stringify({ services })
      });
      setServices(updated);
      setMessage('Catalogo atualizado com sucesso. O site publico passa a usar esses valores.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="page">
        <div className="page-title">
          <h1>Catalogo</h1>
          <p>Carregando servicos e pacotes do site publico.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-title row-title">
        <div>
          <h1>Catalogo</h1>
          <p>Edite servicos, pacotes e extras do site publico.</p>
        </div>
        <button className="primary-button catalog-save-button" type="button" onClick={saveCatalog} disabled={saving}>
          <Save size={18} />
          {saving ? 'Salvando...' : 'Salvar catalogo'}
        </button>
      </div>

      {(message || error) && <p className={error ? 'error settings-alert' : 'success settings-alert'}>{error || message}</p>}

      <div className="catalog-grid">
        <div className="panel catalog-sidebar">
          <div className="compact-head">
            <div>
              <h2>Servicos do site</h2>
              <p>Escolha um servico para editar valores e descricoes curtas.</p>
            </div>
            <span className="badge">{services.length}</span>
          </div>

          <select
            className="catalog-service-select"
            value={selectedService?.slug || selectedSlug}
            onChange={(event) => setSelectedSlug(event.target.value)}
          >
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </select>

          <div className="catalog-service-list">
            {services.map((service) => (
              <button
                key={service.slug}
                type="button"
                className={service.slug === selectedService?.slug ? 'catalog-service-item active' : 'catalog-service-item'}
                onClick={() => setSelectedSlug(service.slug)}
              >
                <strong>{service.name}</strong>
                <span>{service.summary}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedService && (
          <div className="catalog-editor">
            <div className="panel form-panel">
              <div className="compact-head">
                <div>
                  <h2><BookOpen size={18} /> Dados do servico</h2>
                  <p>Essas informacoes alimentam o catalogo publico e o simulador.</p>
                </div>
              </div>

              <FormField label="Nome do servico">
                <input
                  value={selectedService.name}
                  onChange={(event) => updateServiceField(selectedService.slug, 'name', event.target.value)}
                />
              </FormField>

              <FormField label="Resumo curto">
                <textarea
                  value={selectedService.summary}
                  onChange={(event) => updateServiceField(selectedService.slug, 'summary', event.target.value)}
                />
              </FormField>
            </div>

            <div className="catalog-columns">
              <div className="panel">
                <div className="compact-head">
                  <div>
                    <h2><Package size={18} /> Pacotes</h2>
                    <p>Edite nome, valor, duracao, prazo de entrega e os itens mostrados no simulador.</p>
                  </div>
                </div>

                <div className="catalog-card-list">
                  {selectedService.packages.map((item) => (
                    <div className="catalog-card" key={item.id}>
                      <div className="catalog-card-head">
                        <strong>{item.name}</strong>
                        <span>{formatMoney(item.price)}</span>
                      </div>

                      <div className="catalog-card-grid">
                        <FormField label="Nome">
                          <input
                            value={item.name}
                            onChange={(event) => updatePackageField(selectedService.slug, item.id, 'name', event.target.value)}
                          />
                        </FormField>

                        <FormField label="Valor">
                          <input
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(event) => updatePackageField(selectedService.slug, item.id, 'price', event.target.value)}
                          />
                        </FormField>

                        <FormField label="Horas">
                          <input
                            type="number"
                            min="0"
                            value={item.hours}
                            onChange={(event) => updatePackageField(selectedService.slug, item.id, 'hours', event.target.value)}
                          />
                        </FormField>

                        <FormField label="Entrega em dias">
                          <input
                            type="number"
                            min="0"
                            value={item.deliveryDays}
                            onChange={(event) => updatePackageField(selectedService.slug, item.id, 'deliveryDays', event.target.value)}
                          />
                        </FormField>

                        <FormField label="Itens do pacote">
                          <textarea
                            value={item.details.join('\n')}
                            onChange={(event) => updatePackageDetails(selectedService.slug, item.id, event.target.value)}
                          />
                        </FormField>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="compact-head">
                  <div>
                    <h2><Tag size={18} /> Extras</h2>
                    <p>Edite os complementos que aparecem no simulador publico.</p>
                  </div>
                </div>

                <div className="catalog-card-list">
                  {selectedService.extras.map((item) => (
                    <div className="catalog-card" key={item.id}>
                      <div className="catalog-card-head">
                        <strong>{item.name}</strong>
                        <span>{formatMoney(item.price)}</span>
                      </div>

                      <div className="catalog-card-grid compact">
                        <FormField label="Nome do extra">
                          <input
                            value={item.name}
                            onChange={(event) => updateExtraField(selectedService.slug, item.id, 'name', event.target.value)}
                          />
                        </FormField>

                        <FormField label="Valor">
                          <input
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(event) => updateExtraField(selectedService.slug, item.id, 'price', event.target.value)}
                          />
                        </FormField>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="panel catalog-highlight">
              <span><Sparkles size={16} /> Publicacao do site</span>
              <strong>Esses valores passam a alimentar a simulacao publica.</strong>
              <p>Quando voce salva aqui, os novos pacotes e extras ficam disponiveis para os clientes no site publico e para os orcamentos que entrarem pelo simulador.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
