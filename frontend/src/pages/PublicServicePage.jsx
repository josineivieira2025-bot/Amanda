import { ArrowRight, Check, MapPin, MessageCircle } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { SeoMeta } from '../components/SeoMeta.jsx';
import { getServicePage, servicePages } from '../data/publicSite.js';

function whatsappHref(heading) {
  const phone = (import.meta.env.VITE_PUBLIC_WHATSAPP || '').replace(/\D/g, '');
  const text = encodeURIComponent(`Oi! Vim pela pagina "${heading}" e quero um orcamento da Vida em Foco Fotografia.`);
  return phone ? `https://wa.me/${phone}?text=${text}` : '/login';
}

export function PublicServicePage() {
  const { slug } = useParams();
  const page = getServicePage(slug);

  if (!page) {
    return <Navigate to="/" replace />;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: page.heading,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Vida em Foco Fotografia',
      areaServed: 'Rio de Janeiro'
    },
    description: page.description,
    areaServed: 'Rio de Janeiro'
  };

  return (
    <>
      <SeoMeta
        title={page.title}
        description={page.description}
        path={`/${page.slug}`}
        keywords={[
          page.heading,
          'fotografo no Rio de Janeiro',
          'ensaio fotografico no RJ',
          'fotografo profissional no Rio de Janeiro',
          'Vida em Foco Fotografia'
        ]}
        schema={schema}
      />

      <main>
        <section className="site-page-hero">
          <div className="site-section-inner site-page-hero-grid">
            <div>
              <span className="site-kicker">Pagina de servico</span>
              <h1>{page.heading}</h1>
              <p>{page.intro}</p>
              <div className="site-hero-actions">
                <a className="site-primary-button" href={whatsappHref(page.heading)} target="_blank" rel="noreferrer">
                  <MessageCircle size={18} />
                  Pedir orcamento
                </a>
                <Link className="site-ghost-button" to="/">
                  Voltar ao inicio
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            <div className="site-side-panel">
              <span className="site-side-panel-label">Atendimento</span>
              <strong>Rio de Janeiro</strong>
              <p>Fotografo profissional no Rio de Janeiro com linguagem visual delicada e comercialmente forte.</p>
              <div className="site-side-chip"><MapPin size={16} /> ensaio fotografico no RJ</div>
            </div>
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner site-content-grid">
            <div className="site-rich-copy">
              {page.sections.map((section) => (
                <article key={section.title} className="site-copy-block">
                  <h2>{section.title}</h2>
                  <p>{section.text}</p>
                </article>
              ))}
            </div>

            <aside className="site-checklist-card">
              <h2>O que esse servico inclui</h2>
              <div className="site-checklist">
                {page.highlights.map((item) => (
                  <div key={item} className="site-checklist-item">
                    <Check size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="site-band soft">
          <div className="site-section-inner">
            <div className="site-heading">
              <span className="site-kicker">Perguntas frequentes</span>
              <h2>Antes de contratar</h2>
            </div>
            <div className="site-faq-grid">
              {page.faq.map((item) => (
                <article className="site-faq-card" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner">
            <div className="site-heading">
              <span className="site-kicker">Outras paginas</span>
              <h2>Mais formas de encontrar a Vida em Foco</h2>
            </div>
            <div className="site-service-grid">
              {servicePages.filter((item) => item.slug !== page.slug).map((item) => (
                <article className="site-service-card compact" key={item.slug}>
                  <span>{item.shortTitle}</span>
                  <h3>{item.heading}</h3>
                  <p>{item.description}</p>
                  <Link to={`/${item.slug}`}>Abrir pagina</Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
