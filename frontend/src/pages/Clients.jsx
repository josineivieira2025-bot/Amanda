import { Edit, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { FormField } from '../components/FormField.jsx';

export function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  function load() {
    api(`/clients?search=${encodeURIComponent(search)}`).then(setClients).catch(console.error);
  }

  useEffect(load, [search]);

  async function submit(event) {
    event.preventDefault();
    if (editingId) {
      await api(`/clients/${editingId}`, { method: 'PUT', body: JSON.stringify(form) });
    } else {
      await api('/clients', { method: 'POST', body: JSON.stringify(form) });
    }
    cancelEdit();
    load();
  }

  function editClient(client) {
    setEditingId(client._id);
    setForm({ name: client.name || '', phone: client.phone || '', email: client.email || '' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ name: '', phone: '', email: '' });
  }

  async function deleteClient(client) {
    const confirmed = window.confirm(`Excluir cliente ${client.name}?`);
    if (!confirmed) return;
    await api(`/clients/${client._id}`, { method: 'DELETE' });
    load();
  }

  return (
    <section className="page two-column">
      <div>
        <div className="page-title">
          <h1>Clientes</h1>
          <p>Cadastro, busca e historico por relacionamento.</p>
        </div>
        <div className="panel">
          <div className="search-box">
            <Search size={18} />
            <input placeholder="Buscar cliente" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nome</th><th>Telefone</th><th>Email</th><th>Acoes</th></tr></thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client._id}>
                    <td>{client.name}</td>
                    <td>{client.phone}</td>
                    <td>{client.email}</td>
                    <td>
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
          </div>
        </div>
      </div>
      <form className="panel form-panel" onSubmit={submit}>
        <div className="compact-head">
          <h2>{editingId ? 'Editar cliente' : 'Novo cliente'}</h2>
          {editingId && (
            <button className="icon-button" type="button" onClick={cancelEdit} aria-label="Cancelar edicao">
              <X size={16} />
            </button>
          )}
        </div>
        <FormField label="Nome"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
        <FormField label="Telefone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></FormField>
        <FormField label="Email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
        <button className="primary-button">{editingId ? 'Atualizar cliente' : 'Salvar cliente'}</button>
      </form>
    </section>
  );
}
