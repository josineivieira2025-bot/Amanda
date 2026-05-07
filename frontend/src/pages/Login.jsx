import { Camera, Lock, Mail, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormField } from '../components/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      await login(form);
      navigate('/painel');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-screen">
      <section className="auth-wrap">
        <div className="auth-visual">
          <div className="auth-brand">
            <span className="brand-mark"><img src="/mel-fotografia-logo.jpeg" alt="Mel Fotografia" /></span>
            <strong>Mel Fotografia</strong>
          </div>
          <div className="auth-quote">
            <Sparkles size={20} />
            <p>Organize ensaios, eventos, orcamentos e entregas com a identidade da Mel Fotografia.</p>
          </div>
        </div>
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-heading">
            <span className="brand-mark soft"><img src="/mel-fotografia-logo.jpeg" alt="Mel Fotografia" /></span>
            <div>
              <p>Bem-vinda de volta</p>
              <h1>Entre na Mel Fotografia</h1>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <FormField label="Email">
            <div className="input-icon">
              <Mail size={18} />
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </FormField>
          <FormField label="Senha">
            <div className="input-icon">
              <Lock size={18} />
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </FormField>
          <button className="primary-button auth-submit">Entrar no painel</button>
          <p className="auth-switch">
            Ainda nao tem conta? <Link to="/register">Criar perfil profissional</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

