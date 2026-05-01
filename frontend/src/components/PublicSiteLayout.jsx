import { Camera, MapPin, Menu, MessageCircle, Search, Star } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

const menuLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/fotografo-casamento-rio-de-janeiro', label: 'Casamento' },
  { to: '/ensaio-infantil-rj', label: 'Infantil' },
  { to: '/ensaio-gestante-rj', label: 'Gestante' },
  { to: '/ensaio-casal-rj', label: 'Casal' }
];

function whatsappHref() {
  const phone = (import.meta.env.VITE_PUBLIC_WHATSAPP || '').replace(/\D/g, '');
  return phone ? `https://wa.me/${phone}` : 'https://wa.me/';
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
              <span>Fotografo no Rio de Janeiro</span>
            </div>
          </Link>

          <button className="site-menu-button site-mobile-only" type="button" onClick={() => setOpen((value) => !value)} aria-label="Abrir menu">
            <Menu size={20} />
          </button>

          <nav className={`site-nav ${open ? 'is-open' : ''}`}>
            {menuLinks.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            <Link className="site-nav-cta" to="/login" onClick={() => setOpen(false)}>Entrar no painel</Link>
          </nav>
        </div>
        {open && <button className="site-nav-backdrop site-mobile-only" type="button" onClick={() => setOpen(false)} aria-label="Fechar menu" />}
      </header>

      <Outlet />

      <section className="site-presence">
        <div className="site-section-inner site-presence-grid">
          <div className="site-presence-copy">
            <span className="site-kicker">Google e proximidade</span>
            <h2>Vida em Foco Fotografia no Rio de Janeiro</h2>
            <p>
              Para fortalecer a presenca local, o site agora fala com clareza que a Vida em Foco e uma referencia
              para quem busca fotografo no Rio de Janeiro, ensaio fotografico no RJ e fotografo profissional no Rio de Janeiro.
            </p>
          </div>
          <div className="site-presence-card">
            <div className="site-presence-row"><Search size={18} /><span>Nome: Vida em Foco Fotografia</span></div>
            <div className="site-presence-row"><MapPin size={18} /><span>Cidade: Rio de Janeiro</span></div>
            <div className="site-presence-row"><Camera size={18} /><span>Fotos profissionais e paginas separadas por servico</span></div>
            <div className="site-presence-row"><MessageCircle size={18} /><span>WhatsApp pronto para receber contatos</span></div>
            <div className="site-presence-row"><Star size={18} /><span>Espaco ideal para reforcar avaliacoes no Google Business Profile</span></div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-section-inner site-footer-grid">
          <div>
            <strong>Vida em Foco Fotografia</strong>
            <p>Fotografo no Rio de Janeiro com foco em casamento, familia, casal e ensaios autorais.</p>
          </div>
          <div className="site-footer-links">
            {menuLinks.map((link) => (
              <Link key={link.to} to={link.to}>{link.label}</Link>
            ))}
            <a href={whatsappHref()} target="_blank" rel="noreferrer">WhatsApp</a>
            <Link to="/login">Painel ERP</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
