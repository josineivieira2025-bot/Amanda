import {
  ArrowRight,
  HeartHandshake,
  ImagePlus,
  MapPin,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeoMeta } from '../components/SeoMeta.jsx';
import { getServiceRoute, homeCollections, serviceContent } from '../data/publicSite.js';

function whatsappHref() {
  const phone = (import.meta.env.VITE_PUBLIC_WHATSAPP || '').replace(/\D/g, '');
  const text = encodeURIComponent(
    'Oi! Vim pelo site da Mel Fotografia e quero ajuda para escolher um ensaio ou evento.'
  );
  return phone ? `https://wa.me/${phone}?text=${text}` : '/';
}

export function PublicHome() {
  return (
    <>
      <SeoMeta
        title="Fotografo no Rio de Janeiro | Mel Fotografia RJ"
        description="Fotografo no Rio de Janeiro para casamentos, ensaio gestante RJ, ensaio infantil RJ e ensaio casal RJ com atendimento acolhedor e simulacao online."
        path="/"
        keywords={[
          'fotografo no rio de janeiro',
          'fotografo profissional no rio de janeiro',
          'ensaio fotografico no rj',
          'fotografo de casamento rj',
          'ensaio gestante rj',
          'ensaio infantil rj',
          'ensaio casal rj'
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Mel Fotografia RJ',
          image: '/vida-em-foco-logo.jpeg',
          telephone: import.meta.env.VITE_PUBLIC_WHATSAPP || undefined,
          url: import.meta.env.VITE_PUBLIC_SITE_URL || undefined,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Rio de Janeiro',
            addressRegion: 'RJ',
            addressCountry: 'BR'
          },
          areaServed: 'Rio de Janeiro',
          description:
            'Fotografo no Rio de Janeiro especializado em casamentos, ensaio gestante RJ, ensaio infantil RJ, ensaio casal RJ e eventos.'
        }}
      />

      <style>{`
        :root {
          --bg: #fffaf8;
          --surface: rgba(255,255,255,0.82);
          --surface-strong: #ffffff;
          --text: #201a1a;
          --muted: #6f6364;
          --line: rgba(60, 38, 38, 0.08);
          --primary: #8d5c63;
          --primary-dark: #74464d;
          --accent: #f3e4e6;
          --shadow-sm: 0 10px 30px rgba(39, 24, 24, 0.06);
          --shadow-md: 0 22px 60px rgba(39, 24, 24, 0.10);
          --radius-sm: 14px;
          --radius-md: 24px;
          --radius-lg: 32px;
          --container: 1180px;
        }

        * {
          box-sizing: border-box;
        }

        .public-home {
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at top left, rgba(243, 228, 230, 0.9), transparent 30%),
            radial-gradient(circle at top right, rgba(255, 240, 236, 0.75), transparent 25%),
            var(--bg);
        }

        .public-home img {
          display: block;
          max-width: 100%;
        }

        .public-home a {
          text-decoration: none;
        }

        .site-section-inner {
          width: min(var(--container), calc(100% - 32px));
          margin: 0 auto;
        }

        .site-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(141, 92, 99, 0.12);
          color: var(--primary-dark);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .site-hero {
          padding: 56px 0 36px;
        }

        .site-hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 42px;
          align-items: center;
        }

        .site-hero-copy h1 {
          margin: 18px 0 18px;
          font-size: clamp(2.2rem, 5vw, 4.8rem);
          line-height: 1.03;
          letter-spacing: -0.01em;
          font-weight: 700;
          color: #1f1718;
        }

        .site-hero-copy p {
          margin: 0;
          font-size: 1.06rem;
          line-height: 1.8;
          color: var(--muted);
          max-width: 58ch;
        }

        .site-badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 26px;
        }

        .site-badge {
          display: inline-flex;
          align-items: center;
          padding: 10px 14px;
          min-height: 38px;
          border-radius: 999px;
          background: rgba(255,255,255,0.72);
          border: 1px solid var(--line);
          color: #4d3d3f;
          font-size: 0.92rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .site-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 28px;
        }

        .site-primary-button,
        .site-ghost-button,
        .site-service-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 52px;
          padding: 0 18px;
          border-radius: 14px;
          font-weight: 700;
          transition: all 0.25s ease;
        }

        .site-primary-button {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: #fff;
          box-shadow: 0 16px 36px rgba(141, 92, 99, 0.28);
        }

        .site-primary-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 42px rgba(141, 92, 99, 0.34);
        }

        .site-ghost-button {
          background: rgba(255,255,255,0.75);
          border: 1px solid var(--line);
          color: #2f2526;
          backdrop-filter: blur(10px);
        }

        .site-ghost-button:hover {
          transform: translateY(-2px);
          background: #fff;
          box-shadow: var(--shadow-sm);
        }

        .site-hero-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 24px;
        }

        .site-highlight-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #5b4e50;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .site-highlight-item svg {
          color: var(--primary);
        }

        .site-hero-card {
          overflow: hidden;
          border-radius: var(--radius-lg);
          background: var(--surface);
          border: 1px solid var(--line);
          box-shadow: var(--shadow-md);
          backdrop-filter: blur(14px);
        }

        .site-hero-card-image {
          aspect-ratio: 4 / 4.8;
          overflow: hidden;
        }

        .site-hero-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .site-hero-card:hover .site-hero-card-image img {
          transform: scale(1.04);
        }

        .site-hero-card-body {
          padding: 24px;
          display: grid;
          gap: 10px;
        }

        .site-hero-card-body span {
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--primary-dark);
        }

        .site-hero-card-body strong {
          font-size: 1.28rem;
          line-height: 1.3;
        }

        .site-hero-card-body p {
          margin: 0;
          color: var(--muted);
          line-height: 1.7;
        }

        .site-band {
          padding: 70px 0;
        }

        .site-band.soft {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0) 0%,
            rgba(243,228,230,0.45) 100%
          );
        }

        .site-heading {
          max-width: 760px;
          margin-bottom: 34px;
        }

        .site-heading h2 {
          margin: 16px 0 12px;
          font-size: clamp(1.8rem, 3vw, 3rem);
          line-height: 1.08;
          letter-spacing: -0.03em;
        }

        .site-heading p {
          margin: 0;
          color: var(--muted);
          line-height: 1.8;
          font-size: 1rem;
        }

        .site-service-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .site-service-card {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 260px;
          padding: 24px;
          border-radius: var(--radius-md);
          border: 1px solid var(--line);
          background: rgba(255,255,255,0.8);
          box-shadow: var(--shadow-sm);
          transition: all 0.25s ease;
        }

        .site-service-card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 5px;
          background: linear-gradient(90deg, #b57c91, #d59a2d);
        }

        .site-service-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: rgba(141, 92, 99, 0.18);
        }

        .site-service-card span {
          display: inline-flex;
          width: fit-content;
          padding: 7px 12px;
          border-radius: 999px;
          background: var(--accent);
          color: var(--primary-dark);
          font-size: 0.82rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .site-service-card h3 {
          margin: 0 0 12px;
          font-size: 1.28rem;
          line-height: 1.35;
          color: #8b3f5f;
        }

        .site-service-card p {
          margin: 0 0 22px;
          color: var(--muted);
          line-height: 1.75;
          flex: 1;
        }

        .site-service-card a {
          width: fit-content;
          min-height: 42px;
          padding: 10px 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, #a46843 0%, #8b3f5f 100%);
          color: #fff;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 14px 24px rgba(139, 63, 95, 0.18);
        }

        .site-service-card a:hover {
          transform: translateX(4px);
        }

        .site-proof-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .site-proof-card {
          padding: 26px;
          border-radius: var(--radius-md);
          background: rgba(255,255,255,0.82);
          border: 1px solid var(--line);
          box-shadow: var(--shadow-sm);
        }

        .site-proof-card svg {
          color: var(--primary);
          margin-bottom: 14px;
        }

        .site-proof-card strong {
          display: block;
          font-size: 1.1rem;
          margin-bottom: 10px;
        }

        .site-proof-card p {
          margin: 0;
          color: var(--muted);
          line-height: 1.75;
        }

        @media (max-width: 1024px) {
          .site-hero-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }

          .site-service-grid,
          .site-proof-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .site-hero-card-image {
            aspect-ratio: 16 / 11;
          }
        }

        @media (max-width: 768px) {
          .site-hero {
            padding: 30px 0 22px;
          }

          .site-band {
            padding: 52px 0;
          }

          .site-section-inner {
            width: min(var(--container), calc(100% - 20px));
          }

          .site-hero-copy h1 {
            margin-top: 14px;
            font-size: clamp(2rem, 9vw, 3rem);
            line-height: 1.06;
          }

          .site-hero-copy p,
          .site-heading p,
          .site-service-card p,
          .site-proof-card p {
            font-size: 0.97rem;
            line-height: 1.72;
          }

          .site-hero-actions {
            flex-direction: column;
          }

          .site-primary-button,
          .site-ghost-button {
            width: 100%;
          }

          .site-service-grid,
          .site-proof-grid {
            grid-template-columns: 1fr;
          }

          .site-service-card,
          .site-proof-card {
            padding: 20px;
          }

          .site-hero-card {
            border-radius: 24px;
          }

          .site-hero-card-image {
            aspect-ratio: 4 / 4.2;
          }

          .site-badge-row,
          .site-hero-highlights {
            gap: 10px;
          }
        }
      `}</style>

      <main className="public-home">
        <section className="site-hero">
          <div className="site-section-inner site-hero-grid">
            <div className="site-hero-copy">
              <span className="site-kicker">Fotografo no Rio de Janeiro</span>

              <h1>Mel Fotografia RJ para ensaios, casamentos e eventos no Rio de Janeiro</h1>

              <p>
                A Mel Fotografia atende clientes no Rio de Janeiro com uma proposta delicada,
                elegante e clara para quem busca ensaio fotografico no RJ, fotografia de
                casamento e registros afetivos em diferentes fases da vida.
              </p>

              <div className="site-badge-row">
                <span className="site-badge">Fotografo profissional no Rio de Janeiro</span>
                <span className="site-badge">Ensaio fotografico no RJ</span>
                <span className="site-badge">Casamento, gestante, infantil e casal</span>
              </div>

              <div className="site-hero-actions">
                <a className="site-primary-button" href={whatsappHref()} target="_blank" rel="noreferrer">
                  <MessageCircle size={18} />
                  Falar no WhatsApp
                </a>

                <Link className="site-ghost-button" to="/fotografo-no-rio-de-janeiro">
                  Conhecer mais
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="site-hero-highlights">
                <div className="site-highlight-item">
                  <Sparkles size={18} />
                  <span>Atendimento acolhedor</span>
                </div>

                <div className="site-highlight-item">
                  <ImagePlus size={18} />
                  <span>Ensaios com direcao leve</span>
                </div>

                <div className="site-highlight-item">
                  <MapPin size={18} />
                  <span>Rio de Janeiro e regiao</span>
                </div>
              </div>
            </div>

            <div className="site-hero-card">
              <div className="site-hero-card-image">
                <img
                  src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1400&q=80"
                  alt="fotografo no rio de janeiro registrando casal em ensaio fotografico"
                />
              </div>

              <div className="site-hero-card-body">
                <span>Uma experiencia leve desde o primeiro contato</span>
                <strong>Escolha com calma, compare e imagine seu dia</strong>
                <p>
                  O site ajuda voce a visualizar possibilidades, entender faixas de investimento
                  e pedir um orcamento com mais seguranca.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner">
            <div className="site-heading">
              <span className="site-kicker">Ensaios e eventos no RJ</span>
              <h2>Escolha o tipo de ensaio ou evento que faz sentido para voce</h2>
              <p>
                Cada pagina foi pensada para ajudar voce a explorar estilos, entender opcoes e
                solicitar um orcamento de um jeito mais pratico e inspirador com a Mel Fotografia
                no Rio de Janeiro.
              </p>
            </div>

            <div className="site-service-grid">
              {homeCollections.map((item) => (
                <article className="site-service-card" key={item.slug}>
                  <div>
                    <span>{item.title}</span>
                    <h3>{item.cardTitle || serviceContent[item.slug]?.heroTitle || item.title}</h3>
                    <p>{item.text}</p>
                  </div>

                  <Link to={getServiceRoute(item.slug)}>
                    Simule seu orcamento Gratis
                    <ArrowRight size={16} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="site-band soft">
          <div className="site-section-inner">
            <div className="site-proof-grid">
              <article className="site-proof-card">
                <Sparkles size={20} />
                <strong>Pacotes mais claros</strong>
                <p>
                  Voce entende melhor as possibilidades antes mesmo de conversar sobre os detalhes finais.
                </p>
              </article>

              <article className="site-proof-card">
                <ImagePlus size={20} />
                <strong>Escolha mais personalizada</strong>
                <p>
                  Data, local, extras e estilo desejado podem ser informados de um jeito simples em um unico pedido.
                </p>
              </article>

              <article className="site-proof-card">
                <HeartHandshake size={20} />
                <strong>Atendimento mais atencioso</strong>
                <p>
                  Com mais contexto sobre o que voce imagina, o retorno fica mais proximo, util e alinhado ao seu momento.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
