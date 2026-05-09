import { Camera, Plus, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { FormField } from '../components/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', studioName: '', email: '', password: '', role: 'photographer' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') return;
    loadUsers();
  }, [user]);

  async function loadUsers() {
    setLoading(true);
    setError('');

    try {
      const data = await api('/users');
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createUser(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      await api('/users', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setMessage('Usuario criado com sucesso.');
      setForm({ name: '', studioName: '', email: '', password: '', role: 'photographer' });
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function removeUser(id) {
    if (!window.confirm('Deseja excluir este usuario?')) return;
    setError('');
    setMessage('');

    try {
      await api(`/users/${id}`, { method: 'DELETE' });
      setMessage('Usuario excluido.');
      await loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  if (!user) return <div className="center-screen">Carregando...</div>;
  if (user.role !== 'admin') return <Navigate to="/painel" replace />;

  return (
    <section className="page">
      <div className="page-title">
        <h1>Usuarios</h1>
        <p>Crie, liste e exclua contas de acesso. Apenas administradores veem esta tela.</p>
      </div>

      {(message || error) && <p className={error ? 'error' : 'success'}>{error || message}</p>}

      <div className="panel user-management-grid">
        <form className="panel form-panel" onSubmit={createUser}>
          <h2>Criar novo usuario</h2>

          <FormField label="Nome completo">
            <div className="input-icon">
              <User size={18} />
              <input
                required
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              />
            </div>
          </FormField>

          <FormField label="Estudio">
            <div className="input-icon">
              <Camera size={18} />
              <input
                value={form.studioName}
                onChange={(event) => setForm((current) => ({ ...current, studioName: event.target.value }))}
              />
            </div>
          </FormField>

          <FormField label="Email">
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </FormField>

          <FormField label="Senha">
            <input
              type="password"
              minLength="6"
              required
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            />
          </FormField>

          <FormField label="Perfil de acesso">
            <select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>
              <option value="photographer">Usuario comum</option>
              <option value="admin">Administrador</option>
            </select>
          </FormField>

          <button className="primary-button" type="submit" disabled={saving}>
            <Plus size={18} />
            Criar usuario
          </button>
        </form>

        <div className="panel">
          <h2>Usuarios cadastrados</h2>
          {loading ? (
            <p>Carregando usuarios...</p>
          ) : (
            <div className="user-table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Perfil</th>
                    <th>Criado em</th>
                    <th>Acao</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <button className="ghost-button danger" type="button" onClick={() => removeUser(item._id)}>
                          <Trash2 size={16} />
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
