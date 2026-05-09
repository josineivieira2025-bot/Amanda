import { ArrowRight, CalendarDays, Lock, Mail, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

          <div className="auth-visual-copy">
            <span className="auth-badge"><Sparkles size={14} /> Studio manager premium</span>
            <h2>Seu estudio mais elegante, organizado e pronto para encantar.</h2>
            <p>
              Controle agenda, clientes, orcamentos, galerias e financeiro em uma experiencia mais bonita, leve e profissional.
            </p>

            <div className="auth-feature-list">
              <div className="auth-feature-item">
                <CalendarDays size={18} />
                <span>Agenda clara para nao perder nenhum momento especial</span>
              </div>
              <div className="auth-feature-item">
                <MessageCircle size={18} />
                <span>Follow-up dos leads com mais carinho e velocidade</span>
              </div>
              <div className="auth-feature-item">
                <ShieldCheck size={18} />
                <span>Painel seguro para a rotina do seu estudio fotografico</span>
              </div>
            </div>
          </div>

          <div className="auth-quote auth-quote-luxe">
            <Sparkles size={20} />
            <p>Organize ensaios, eventos, orcamentos e entregas com uma identidade sofisticada e acolhedora.</p>
          </div>
        </div>

        <form className="auth-card" onSubmit={submit}>
          <div className="auth-heading">
            <span className="brand-mark soft"><img src="/mel-fotografia-logo.jpeg" alt="Mel Fotografia" /></span>
            <div>
              <p>Painel exclusivo</p>
              <h1>Entre na Mel Fotografia</h1>
            </div>
          </div>

          <p className="auth-description">
            Acesse sua operacao completa com uma experiencia refinada para acompanhar agenda, vendas e entregas num so lugar.
          </p>

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

          <button className="primary-button auth-submit">
            Entrar no painel
            <ArrowRight size={18} />
          </button>

          <div className="auth-footnote">
            <ShieldCheck size={16} />
            <span>Acesso protegido para voce cuidar do estudio com tranquilidade.</span>
          </div>
        </form>
      </section>
    </div>
  );
}

