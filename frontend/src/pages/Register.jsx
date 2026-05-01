import { Camera, Lock, Mail, Sparkles, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormField } from '../components/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', studioName: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      await register(form);
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
            <span className="brand-mark"><img src="/vida-em-foco-logo.jpeg" alt="Vida em Foco" /></span>
            <strong>Vida em Foco</strong>
          </div>
          <div className="auth-quote">
            <Sparkles size={20} />
            <p>Um sistema pensado para transformar cada contato, orcamento e entrega em uma experiencia bonita e organizada.</p>
          </div>
        </div>
        <form className="auth-card" onSubmit={submit}>
          <div className="auth-heading">
            <span className="brand-mark soft"><img src="/vida-em-foco-logo.jpeg" alt="Vida em Foco" /></span>
            <div>
              <p>Comece seu painel</p>
              <h1>Crie seu acesso Vida em Foco</h1>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <FormField label="Nome">
            <div className="input-icon">
              <UserRound size={18} />
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </FormField>
          <FormField label="Estudio">
            <div className="input-icon">
              <Camera size={18} />
              <input value={form.studioName} onChange={(e) => setForm({ ...form, studioName: e.target.value })} />
            </div>
          </FormField>
          <FormField label="Email">
            <div className="input-icon">
              <Mail size={18} />
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </FormField>
          <FormField label="Senha">
            <div className="input-icon">
              <Lock size={18} />
              <input type="password" minLength="6" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </FormField>
          <button className="primary-button auth-submit">Cadastrar estudio</button>
          <p className="auth-switch">
            Ja tem conta? <Link to="/login">Entrar no painel</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

