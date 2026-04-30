import {
  Bell,
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
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/eventos', label: 'Eventos', icon: PartyPopper },
  { to: '/galeria', label: 'Galeria', icon: Camera },
  { to: '/financeiro', label: 'Financeiro', icon: CreditCard }
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <Link className="brand" to="/configuracoes" onClick={() => setOpen(false)}>
          <span className="brand-icon">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.name || 'Perfil'} /> : <Camera size={24} />}
          </span>
          <div>
            <strong>{user?.studioName || 'Photo ERP'}</strong>
            <span>{user?.name || 'Estudio fotografico'}</span>
          </div>
        </Link>
        <div className="sidebar-note">
          <Sparkles size={15} />
          <span>Painel da fotografa</span>
        </div>
        <nav>
          <span className="nav-label">Menu principal</span>
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setOpen(false)}>
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
            <span className="eyebrow">Amanda Fotografia</span>
            <strong>Gestao fotografica</strong>
            <span>Agenda, clientes, fotos e financeiro em um so lugar.</span>
          </div>
          <div className="topbar-actions">
            <span className="status-pill">Online</span>
            <button className="icon-button" aria-label="Notificacoes">
              <Bell size={18} />
            </button>
          </div>
        </header>
        <Outlet />
      </main>
      <nav className="bottom-nav mobile-only" aria-label="Navegacao principal">
        {links.slice(0, 5).map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}>
            <item.icon size={19} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
