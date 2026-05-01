import { Camera, Menu, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/servicos/casamento', label: 'Casamentos' },
  { to: '/servicos/gestante', label: 'Gestante' },
  { to: '/servicos/casal', label: 'Casal' },
  { to: '/servicos/evento-infantil', label: 'Eventos' }
];

function whatsappHref() {
  const phone = (import.meta.env.VITE_PUBLIC_WHATSAPP || '').replace(/\D/g, '');
  return phone ? `https://wa.me/${phone}` : '/';
}

export function PublicSiteLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="public-site">
      <header className="site-header">
        <div className="site-header-inner">
          <Link className="site-brand" to="/" onClick={() => setOpen(false)}>
            <span className="site-brand-mark">
              <img src="/vida-em-foco-logo.jpeg" alt="Vida em Foco Fotografia" />
            </span>
            <div>
              <strong>Vida em Foco Fotografia</strong>
              <span>Ensaios, casamentos e eventos com simulacao online</span>
            </div>
          </Link>

          <button className="site-menu-button site-mobile-only" type="button" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu">
            <Menu size={20} />
          </button>

          <nav className={`site-nav ${open ? 'is-open' : ''}`}>
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            <a className="site-nav-outline" href={whatsappHref()} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <Link className="site-nav-cta" to="/login" onClick={() => setOpen(false)}>
              Entrar no painel
            </Link>
          </nav>
        </div>
        {open && <button className="site-nav-backdrop site-mobile-only" type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" />}
      </header>

      <Outlet />

      <footer className="site-footer">
        <div className="site-section-inner site-footer-grid">
          <div>
            <strong>Vida em Foco Fotografia</strong>
            <p>
              O cliente escolhe o tipo de evento, monta a simulacao e o pedido cai direto no ERP para atendimento e acompanhamento.
            </p>
          </div>
          <div className="site-footer-links">
            {links.map((link) => (
              <Link key={link.to} to={link.to}>{link.label}</Link>
            ))}
            <a href={whatsappHref()} target="_blank" rel="noreferrer">
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <Link to="/login">
              <Camera size={16} />
              Painel ERP
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
