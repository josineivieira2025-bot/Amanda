import { Camera, KeyRound, Save, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormField } from '../components/FormField.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { imageFileToDataUrl } from '../utils/images.js';

export function Settings() {
  const { user, updateProfile, changePassword } = useAuth();
  const [profile, setProfile] = useState({ name: '', studioName: '', avatarUrl: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setProfile({
      name: user?.name || '',
      studioName: user?.studioName || '',
      avatarUrl: user?.avatarUrl || ''
    });
  }, [user]);

  async function saveProfile(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    try {
      await updateProfile(profile);
      setMessage('Perfil atualizado com sucesso.');
    } catch (err) {
      setError(err.message);
    }
  }

  async function attachAvatar(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setMessage('');
    try {
      const avatarUrl = await imageFileToDataUrl(file, 700, 0.88);
      setProfile((current) => ({ ...current, avatarUrl }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function savePassword(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password.newPassword !== password.confirmPassword) {
      setError('A nova senha e a confirmacao precisam ser iguais.');
      return;
    }

    try {
      await changePassword({
        currentPassword: password.currentPassword,
        newPassword: password.newPassword
      });
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage('Senha alterada com sucesso.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="page ops-page">
      <div className="ops-header">
        <div>
          <span className="hero-eyebrow rose">Configuracoes</span>
          <h1>Perfil e seguranca</h1>
          <p>Identidade do estudio, foto de perfil e senha da conta.</p>
        </div>
      </div>

      {(message || error) && <p className={error ? 'error settings-alert' : 'success settings-alert'}>{error || message}</p>}

      <div className="ops-workspace settings-workspace">
        <form className="ops-section" onSubmit={saveProfile}>
          <div className="ops-section-head">
            <div>
              <h2>Perfil do estudio</h2>
              <p>Informacoes exibidas no painel.</p>
            </div>
          </div>

          <div className="settings-profile-row">
            <div className="settings-avatar">
              {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Foto de perfil" /> : <Camera size={34} />}
            </div>
            <label className="file-upload compact">
              <Camera size={19} />
              <div>
                <strong>Alterar foto</strong>
                <span>Escolha uma imagem do computador.</span>
              </div>
              <input type="file" accept="image/*" onChange={attachAvatar} />
            </label>
          </div>

          <div className="ops-form-grid">
            <FormField label="Nome">
              <div className="input-icon settings-input">
                <UserRound size={18} />
                <input required value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
            </FormField>
            <FormField label="Nome do estudio">
              <div className="input-icon settings-input">
                <Camera size={18} />
                <input value={profile.studioName} onChange={(e) => setProfile({ ...profile, studioName: e.target.value })} />
              </div>
            </FormField>
          </div>

          <button className="primary-button">
            <Save size={18} />
            Salvar perfil
          </button>
        </form>

        <form className="ops-section" onSubmit={savePassword}>
          <div className="ops-section-head">
            <div>
              <h2>Alterar senha</h2>
              <p>Use uma senha com pelo menos seis caracteres.</p>
            </div>
            <KeyRound size={18} />
          </div>
          <FormField label="Senha atual">
            <input type="password" required value={password.currentPassword} onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })} />
          </FormField>
          <FormField label="Nova senha">
            <input type="password" minLength="6" required value={password.newPassword} onChange={(e) => setPassword({ ...password, newPassword: e.target.value })} />
          </FormField>
          <FormField label="Confirmar nova senha">
            <input type="password" minLength="6" required value={password.confirmPassword} onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })} />
          </FormField>
          <button className="primary-button">
            <KeyRound size={18} />
            Atualizar senha
          </button>
        </form>
      </div>
    </section>
  );
}
