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

function storageKey(userId, suffix) {
  return `photo_erp_${suffix}_${userId || 'guest'}`;
}

export function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [seenNotificationIds, setSeenNotificationIds] = useState([]);
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState([]);

  useEffect(() => {
    api('/events').then(setEvents).catch(console.error);
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    try {
      const seen = JSON.parse(localStorage.getItem(storageKey(user._id, 'seen_notifications')) || '[]');
      const dismissed = JSON.parse(localStorage.getItem(storageKey(user._id, 'dismissed_notifications')) || '[]');
      setSeenNotificationIds(Array.isArray(seen) ? seen : []);
      setDismissedNotificationIds(Array.isArray(dismissed) ? dismissed : []);
    } catch {
      setSeenNotificationIds([]);
      setDismissedNotificationIds([]);
    }
  }, [user?._id]);

  const siteNotifications = useMemo(
    () =>
      events
        .filter((event) => event.source === 'site' && event.status === 'orcamento_pendente')
        .filter((event) => !dismissedNotificationIds.includes(event._id))
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)),
    [dismissedNotificationIds, events]
  );

  const unreadCount = useMemo(
    () => siteNotifications.filter((event) => !seenNotificationIds.includes(event._id)).length,
    [seenNotificationIds, siteNotifications]
  );

  useEffect(() => {
    if (!notificationOpen || !siteNotifications.length || !user?._id) return;

    const nextSeen = Array.from(new Set([...seenNotificationIds, ...siteNotifications.map((event) => event._id)]));
    setSeenNotificationIds(nextSeen);
    localStorage.setItem(storageKey(user._id, 'seen_notifications'), JSON.stringify(nextSeen));
  }, [notificationOpen, seenNotificationIds, siteNotifications, user?._id]);

  function dismissNotification(eventId) {
    if (!user?._id) return;
    const nextDismissed = Array.from(new Set([...dismissedNotificationIds, eventId]));
    setDismissedNotificationIds(nextDismissed);
    localStorage.setItem(storageKey(user._id, 'dismissed_notifications'), JSON.stringify(nextDismissed));
  }

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <Link className="brand" to="/painel/configuracoes" onClick={() => setOpen(false)}>
          <span className="brand-icon">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.name || 'Perfil'} /> : <img src="/mel-fotografia-logo.jpeg" alt="Mel Fotografia" />}
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
              {unreadCount > 0 ? <span className="topbar-bell-badge">{unreadCount}</span> : null}
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
                      <div key={event._id} className="topbar-notification-card">
                        <Link
                          className="topbar-notification-link"
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
                        <button
                          className="topbar-notification-remove"
                          type="button"
                          onClick={() => dismissNotification(event._id)}
                        >
                          Apagar
                        </button>
                      </div>
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

