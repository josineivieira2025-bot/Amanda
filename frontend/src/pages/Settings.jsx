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
    <section className="page">
      <div className="page-title">
        <h1>Configuracoes</h1>
        <p>Atualize a identidade do estudio, foto de perfil e seguranca da conta.</p>
      </div>

      {(message || error) && <p className={error ? 'error settings-alert' : 'success settings-alert'}>{error || message}</p>}

      <div className="settings-grid">
        <form className="panel settings-profile" onSubmit={saveProfile}>
          <div className="settings-avatar">
            {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Foto de perfil" /> : <Camera size={34} />}
          </div>
          <div>
            <h2>Perfil da fotografa</h2>
            <p>Essa informacao aparece no topo do sistema e no card lateral.</p>
          </div>

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

          <FormField label="Foto de perfil">
            <label className="file-upload">
              <Camera size={19} />
              <div>
                <strong>Anexar foto</strong>
                <span>Escolha uma imagem do computador.</span>
              </div>
              <input type="file" accept="image/*" onChange={attachAvatar} />
            </label>
          </FormField>

          <button className="primary-button">
            <Save size={18} />
            Salvar perfil
          </button>
        </form>

        <form className="panel form-panel" onSubmit={savePassword}>
          <h2>Alterar senha</h2>
          <FormField label="Senha atual">
            <div className="input-icon settings-input">
              <KeyRound size={18} />
              <input
                type="password"
                required
                value={password.currentPassword}
                onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
              />
            </div>
          </FormField>
          <FormField label="Nova senha">
            <input
              type="password"
              minLength="6"
              required
              value={password.newPassword}
              onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
            />
          </FormField>
          <FormField label="Confirmar nova senha">
            <input
              type="password"
              minLength="6"
              required
              value={password.confirmPassword}
              onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
            />
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
