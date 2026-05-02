import {
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  PartyPopper,
  Sparkles,
  Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/painel', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/painel/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/painel/clientes', label: 'Clientes', icon: Users },
  { to: '/painel/eventos', label: 'Eventos', icon: PartyPopper },
  { to: '/painel/catalogo', label: 'Catalogo', icon: BookOpen },
  { to: '/painel/galeria', label: 'Galeria', icon: Camera },
  { to: '/painel/financeiro', label: 'Financeiro', icon: CreditCard }
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api('/events').then(setEvents).catch(console.error);
  }, []);

  const siteNotifications = useMemo(
    () =>
      events
        .filter((event) => event.source === 'site' && event.status === 'orcamento_pendente')
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)),
    [events]
  );

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <Link className="brand" to="/painel/configuracoes" onClick={() => setOpen(false)}>
          <span className="brand-icon">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.name || 'Perfil'} /> : <img src="/vida-em-foco-logo.jpeg" alt="Mel Fotografia" />}
          </span>
          <div>
            <strong>{user?.studioName || 'Mel Fotografia'}</strong>
            <span>{user?.name || 'Eternizando seus melhores momentos'}</span>
          </div>
        </Link>
        <div className="sidebar-note">
          <Sparkles size={15} />
          <span>Painel Mel Fotografia</span>
        </div>
        <nav>
          <span className="nav-label">Menu principal</span>
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/painel'} onClick={() => setOpen(false)}>
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="ghost-button logout" onClick={logout}>
          <LogOut size={18} />
          Sair
        </button>
      </aside>
      {open && <button className="sidebar-backdrop mobile-only" type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" />}
      <main className="main">
        <header className="topbar">
          <button className="icon-button mobile-only" onClick={() => setOpen((value) => !value)} aria-label="Menu">
            <Menu size={20} />
          </button>
          <div className="topbar-copy">
            <span className="eyebrow">Mel Fotografia</span>
            <strong>Gestao fotografica Mel Fotografia</strong>
            <span>Agenda, clientes, orcamentos e memorias em um so lugar.</span>
          </div>
          <div className="topbar-actions">
            <button
              className={notificationOpen ? 'icon-button active topbar-bell' : 'icon-button topbar-bell'}
              aria-label="Notificacoes"
              type="button"
              onClick={() => setNotificationOpen((value) => !value)}
            >
              <Bell size={18} />
              {siteNotifications.length > 0 ? <span className="topbar-bell-badge">{siteNotifications.length}</span> : null}
            </button>
            {notificationOpen && (
              <div className="topbar-notifications">
                <div className="topbar-notifications-head">
                  <strong>Novos orcamentos do site</strong>
                  <span>{siteNotifications.length} pendente(s)</span>
                </div>

                <div className="topbar-notifications-list">
                  {siteNotifications.length ? (
                    siteNotifications.slice(0, 6).map((event) => (
                      <Link
                        key={event._id}
                        className="topbar-notification-card"
                        to="/painel/eventos"
                        onClick={() => setNotificationOpen(false)}
                      >
                        <strong>{event.clientId?.name || 'Cliente sem nome'}</strong>
                        <span>{event.location || 'Local a confirmar'}</span>
                        <small>
                          Recebido{' '}
                          {formatDistanceToNow(new Date(event.createdAt || event.date), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </small>
                      </Link>
                    ))
                  ) : (
                    <div className="topbar-notification-empty">
                      <strong>Nenhum novo orçamento do site</strong>
                      <span>Quando chegar uma nova simulacao pendente, ela aparece aqui.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>
        <Outlet />
      </main>
      <nav className="bottom-nav mobile-only" aria-label="Navegacao principal">
        {links.slice(0, 5).map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/painel'}>
            <item.icon size={19} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

