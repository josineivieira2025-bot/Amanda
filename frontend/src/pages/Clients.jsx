import { Edit, Plus, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { FormField } from '../components/FormField.jsx';

export function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', tags: '' });
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  function load() {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (tagFilter) query.set('tag', tagFilter);

    api(`/clients?${query.toString()}`).then(setClients).catch(console.error);
  }

  useEffect(load, [search, tagFilter]);

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
    setForm({ name: '', phone: '', email: '' });
    setFormOpen(true);
  }

  function editClient(client) {
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
    setForm({ name: '', phone: '', email: '' });
    setFormOpen(false);
  }

  async function deleteClient(client) {
    const confirmed = window.confirm(`Excluir cliente ${client.name}?`);
    if (!confirmed) return;
    await api(`/clients/${client._id}`, { method: 'DELETE' });
    load();
  }

  return (
    <section className="page">
      <div className="page-title row-title">
        <div>
          <h1>Clientes</h1>
          <p>Cadastro, busca e histórico por relacionamento.</p>
        </div>
        <button className="primary-button" type="button" onClick={openForm}>
          <Plus size={18} />
          Novo cliente
        </button>
      </div>

      <div className="panel">
        <div className="filters-row">
          <div className="search-box">
            <Search size={18} />
            <input placeholder="Buscar cliente" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="filter-select" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
            <option value="">Filtrar por etiqueta</option>
            {Array.from(new Set(clients.flatMap((client) => client.tags || []))).sort().map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Etiquetas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td data-label="Nome">{client.name}</td>
                  <td data-label="Telefone">{client.phone}</td>
                  <td data-label="Email">{client.email}</td>
                  <td data-label="Etiquetas">
                    <div className="tag-list">
                      {(client.tags || []).map((tag) => (
                        <span key={`${client._id}-${tag}`} className="tag-pill">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td data-label="Ações">
                    <div className="table-actions">
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
            <div className="empty-state">
              <strong>Nenhum cliente encontrado</strong>
              <p>Adicione um novo cliente para aparecer na lista.</p>
            </div>
          )}
        </div>
      </div>

      {formOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <form className="panel modal-card" onSubmit={submit}>
            <div className="compact-head">
              <div>
                <h2>{editingId ? 'Editar cliente' : 'Novo cliente'}</h2>
                <p>{editingId ? 'Atualize os dados do cliente.' : 'Cadastre um novo cliente rapidamente.'}</p>
              </div>
              <button className="icon-button" type="button" onClick={closeForm} aria-label="Fechar">
                <X size={16} />
              </button>
            </div>

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
              <small>Separe as etiquetas por vírgula.</small>
            </FormField>

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
