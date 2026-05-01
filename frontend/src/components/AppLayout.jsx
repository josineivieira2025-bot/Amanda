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
  { to: '/painel', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/painel/agenda', label: 'Agenda', icon: CalendarDays },
  { to: '/painel/clientes', label: 'Clientes', icon: Users },
  { to: '/painel/eventos', label: 'Eventos', icon: PartyPopper },
  { to: '/painel/galeria', label: 'Galeria', icon: Camera },
  { to: '/painel/financeiro', label: 'Financeiro', icon: CreditCard }
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <Link className="brand" to="/painel/configuracoes" onClick={() => setOpen(false)}>
          <span className="brand-icon">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.name || 'Perfil'} /> : <img src="/vida-em-foco-logo.jpeg" alt="Vida em Foco" />}
          </span>
          <div>
            <strong>{user?.studioName || 'Vida em Foco'}</strong>
            <span>{user?.name || 'Eternizando seus melhores momentos'}</span>
          </div>
        </Link>
        <div className="sidebar-note">
          <Sparkles size={15} />
          <span>Painel Vida em Foco</span>
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
            <span className="eyebrow">Vida em Foco</span>
            <strong>Gestao fotografica Vida em Foco</strong>
            <span>Agenda, clientes, orcamentos e memorias em um so lugar.</span>
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
          <NavLink key={item.to} to={item.to} end={item.to === '/painel'}>
            <item.icon size={19} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

