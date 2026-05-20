import { Edit, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';
import { FormField } from '../components/FormField.jsx';

export function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', tags: '' });
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  function load() {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (tagFilter) query.set('tag', tagFilter);

    api(`/clients?${query.toString()}`)
      .then((items) => {
        setClients(items);
        setSelectedClient((current) => {
          if (!current) return items[0] || null;
          return items.find((client) => client._id === current._id) || items[0] || null;
        });
      })
      .catch(console.error);
  }

  useEffect(load, [search, tagFilter]);

  const allTags = useMemo(
    () => Array.from(new Set(clients.flatMap((client) => client.tags || []))).sort(),
    [clients]
  );

  async function submit(event) {
    event.preventDefault();
    if (editingId) {
      await api(`/clients/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
    } else {
      await api('/clients', { method: 'POST', body: JSON.stringify(form) });
    }
    closeForm();
    load();
  }

  function openForm() {
    setEditingId(null);
    setForm({ name: '', phone: '', email: '', tags: '' });
    setFormOpen(true);
  }

  function editClient(client) {
    setSelectedClient(client);
    setEditingId(client._id);
    setForm({
      name: client.name || '',
      phone: client.phone || '',
      email: client.email || '',
      tags: (client.tags || []).join(', ')
    });
    setFormOpen(true);
  }

  function closeForm() {
    setEditingId(null);
    setForm({ name: '', phone: '', email: '', tags: '' });
    setFormOpen(false);
  }

  async function deleteClient(client) {
    const confirmed = window.confirm(`Excluir cliente ${client.name}?`);
    if (!confirmed) return;
    await api(`/clients/${client._id}`, { method: 'DELETE' });
    if (selectedClient?._id === client._id) setSelectedClient(null);
    load();
  }

  return (
    <section className="page ops-page">
      <div className="ops-header">
        <div>
          <span className="hero-eyebrow rose">Clientes</span>
          <h1>Base de clientes</h1>
          <p>CRM simples para localizar contatos, etiquetas e historico de relacionamento.</p>
        </div>
        <button className="primary-button" type="button" onClick={openForm}>
          <Plus size={18} />
          Novo cliente
        </button>
      </div>

      <div className="ops-workspace clients-crm">
        <section className="ops-section clients-table-section">
          <div className="ops-toolbar">
            <div className="search-box">
              <Search size={18} />
              <input placeholder="Buscar cliente" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
              <option value="">Todas as etiquetas</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div className="ops-table-wrap">
            <table className="ops-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>Email</th>
                  <th>Etiquetas</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client._id}
                    className={selectedClient?._id === client._id ? 'selected-row' : ''}
                    onClick={() => setSelectedClient(client)}
                  >
                    <td>{client.name}</td>
                    <td>{client.phone || '-'}</td>
                    <td>{client.email || '-'}</td>
                    <td>
                      <div className="tag-list">
                        {(client.tags || []).map((tag) => (
                          <span key={`${client._id}-${tag}`} className="tag-pill">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions" onClick={(event) => event.stopPropagation()}>
                        <button className="icon-button" type="button" onClick={() => editClient(client)} aria-label="Editar cliente">
                          <Edit size={16} />
                        </button>
                        <button className="icon-button danger-button" type="button" onClick={() => deleteClient(client)} aria-label="Excluir cliente">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {clients.length === 0 && (
              <div className="ops-empty">Nenhum cliente encontrado.</div>
            )}
          </div>
        </section>

        <aside className="ops-inspector">
          <section className="ops-section">
            <div className="ops-section-head">
              <div>
                <h2>Detalhe do cliente</h2>
                <p>Resumo rapido do contato selecionado.</p>
              </div>
            </div>

            {selectedClient ? (
              <div className="client-inspector">
                <strong>{selectedClient.name}</strong>
                <span>{selectedClient.phone || 'Telefone nao informado'}</span>
                <span>{selectedClient.email || 'Email nao informado'}</span>
                <div className="tag-list">
                  {(selectedClient.tags || []).map((tag) => (
                    <span key={`${selectedClient._id}-detail-${tag}`} className="tag-pill">{tag}</span>
                  ))}
                </div>
                <button className="ghost-button" type="button" onClick={() => editClient(selectedClient)}>
                  <Edit size={16} />
                  Editar dados
                </button>
              </div>
            ) : (
              <div className="ops-empty">Selecione um cliente na lista.</div>
            )}
          </section>
        </aside>
      </div>

      {formOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <form className="panel modal-card ops-modal-card" onSubmit={submit}>
            <div className="compact-head">
              <div>
                <h2>{editingId ? 'Editar cliente' : 'Novo cliente'}</h2>
                <p>{editingId ? 'Atualize os dados do cliente.' : 'Cadastre um novo cliente rapidamente.'}</p>
              </div>
              <button className="icon-button" type="button" onClick={closeForm} aria-label="Fechar">
                <X size={16} />
              </button>
            </div>

            <div className="ops-form-grid">
              <FormField label="Nome">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </FormField>
              <FormField label="Telefone">
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </FormField>
              <FormField label="Email">
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </FormField>
              <FormField label="Etiquetas">
                <input
                  placeholder="Ex.: noiva, casamento, urgente"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
                <small>Separe as etiquetas por virgula.</small>
              </FormField>
            </div>

            <div className="modal-actions">
              <button className="ghost-button" type="button" onClick={closeForm}>
                Cancelar
              </button>
              <button className="primary-button" type="submit">
                {editingId ? 'Atualizar cliente' : 'Salvar cliente'}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
