import { Menu, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { publicNavLinks } from '../data/publicSite.js';

function whatsappHref() {
  const phone = (import.meta.env.VITE_PUBLIC_WHATSAPP || '').replace(/\D/g, '');
  return phone ? `https://wa.me/${phone}` : '/';
}

export function PublicSiteLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

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
            {publicNavLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            <a className="site-nav-outline" href={whatsappHref()} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
              <MessageCircle size={16} />
              WhatsApp
            </a>
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
              Ensaios, casamentos e eventos com uma experiencia leve, elegante e pensada para facilitar sua escolha.
            </p>
          </div>
          <div className="site-footer-links">
            {publicNavLinks.map((link) => (
              <Link key={link.to} to={link.to}>{link.label}</Link>
            ))}
            <a href={whatsappHref()} target="_blank" rel="noreferrer">
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
