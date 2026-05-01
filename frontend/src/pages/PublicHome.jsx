import { ArrowRight, Camera, HeartHandshake, MapPin, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeoMeta } from '../components/SeoMeta.jsx';
import { homeHighlights, servicePages } from '../data/publicSite.js';

function whatsappHref() {
  const phone = (import.meta.env.VITE_PUBLIC_WHATSAPP || '').replace(/\D/g, '');
  const text = encodeURIComponent('Oi! Vim pelo site da Vida em Foco Fotografia e quero saber mais sobre um ensaio no Rio de Janeiro.');
  return phone ? `https://wa.me/${phone}?text=${text}` : '/login';
}

export function PublicHome() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Vida em Foco Fotografia',
    description:
      'Fotografo profissional no Rio de Janeiro para casamentos, ensaios de casal, ensaio gestante e ensaio infantil.',
    areaServed: 'Rio de Janeiro',
    image: '/vida-em-foco-logo.jpeg',
    telephone: import.meta.env.VITE_PUBLIC_WHATSAPP || undefined,
    url: `${import.meta.env.VITE_PUBLIC_SITE_URL || ''}/`
  };

  return (
    <>
      <SeoMeta
        title="Fotografo no Rio de Janeiro | Vida em Foco Fotografia"
        description="A Vida em Foco Fotografia e especializada em ensaios, casamentos e eventos no Rio de Janeiro, com atendimento sensivel e visual elegante."
        path="/"
        keywords={[
          'fotografo no Rio de Janeiro',
          'ensaio fotografico no RJ',
          'fotografo profissional no Rio de Janeiro',
          'Vida em Foco Fotografia',
          'casamento Rio de Janeiro'
        ]}
        schema={schema}
      />

      <main>
        <section className="site-hero">
          <div className="site-section-inner site-hero-grid">
            <div className="site-hero-copy">
              <span className="site-kicker">Fotografia com presenca e direcao</span>
              <h1>Fotografo no Rio de Janeiro | Vida em Foco Fotografia</h1>
              <p>
                A Vida em Foco Fotografia e especializada em ensaios, casamentos e eventos no Rio de Janeiro.
                O trabalho une sensibilidade, direcao leve e um atendimento pensado para transformar memórias em imagens elegantes.
              </p>
              <div className="site-badge-row">
                {homeHighlights.map((item) => (
                  <span key={item} className="site-badge">{item}</span>
                ))}
              </div>
              <div className="site-hero-actions">
                <a className="site-primary-button" href={whatsappHref()} target="_blank" rel="noreferrer">
                  <MessageCircle size={18} />
                  Falar no WhatsApp
                </a>
                <Link className="site-ghost-button" to="/fotografo-casamento-rio-de-janeiro">
                  Ver servicos
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="site-hero-card">
              <div className="site-hero-card-image">
                <img
                  src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80"
                  alt="Fotografo profissional no Rio de Janeiro registrando casal"
                />
              </div>
              <div className="site-hero-card-body">
                <span>Atendimento local no RJ</span>
                <strong>Casamentos, ensaios e eventos com identidade</strong>
                <p>
                  Para quem procura ensaio fotografico no RJ com direcao leve e experiencia organizada do primeiro contato ate a entrega.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner">
            <div className="site-heading">
              <span className="site-kicker">Servicos com pagina propria</span>
              <h2>Estrutura publica pensada para aparecer no Google</h2>
              <p>
                Cada servico recebeu uma URL propria com texto real, contexto e linguagem local para reforcar a autoridade da Vida em Foco Fotografia no Rio de Janeiro.
              </p>
            </div>

            <div className="site-service-grid">
              {servicePages.map((page) => (
                <article className="site-service-card" key={page.slug}>
                  <div className="site-service-card-head">
                    <span>{page.shortTitle}</span>
                    <Sparkles size={18} />
                  </div>
                  <h3>{page.heading}</h3>
                  <p>{page.description}</p>
                  <Link to={`/${page.slug}`}>Abrir pagina</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="site-band soft">
          <div className="site-section-inner site-proof-grid">
            <div className="site-proof-card">
              <MapPin size={20} />
              <strong>Presenca local</strong>
              <p>O site repete com naturalidade que a marca atende no Rio de Janeiro, reforcando o sinal geografico do negocio.</p>
            </div>
            <div className="site-proof-card">
              <HeartHandshake size={20} />
              <strong>Experiencia humana</strong>
              <p>Os textos falam com noivos, casais e familias, nao so com algoritmo. Isso melhora conversao e permanencia na pagina.</p>
            </div>
            <div className="site-proof-card">
              <Camera size={20} />
              <strong>Base para portfolio</strong>
              <p>As paginas ja estao prontas para receber fotos com nomes otimizados, como `fotografo-casamento-rio-de-janeiro.jpg`.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
