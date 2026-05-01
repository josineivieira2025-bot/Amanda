import { Check, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { QuoteSimulator } from '../components/QuoteSimulator.jsx';
import { SeoMeta } from '../components/SeoMeta.jsx';
import { getServiceContent } from '../data/publicSite.js';

export function PublicServicePage() {
  const { slug } = useParams();
  const content = getServiceContent(slug);
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    api('/public/quote-catalog').then(setCatalog).catch(console.error);
  }, []);

  const service = useMemo(() => catalog.find((item) => item.slug === slug), [catalog, slug]);

  if (!content) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SeoMeta
        title={content.seoTitle}
        description={content.seoDescription}
        path={content.route}
        keywords={['Vida em Foco Fotografia', content.heroTitle, 'simulacao de orcamento', service?.name || slug]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service?.name || content.heroTitle,
          description: content.seoDescription,
          provider: {
            '@type': 'LocalBusiness',
            name: 'Vida em Foco Fotografia'
          }
        }}
      />

      <main>
        <section className="site-page-hero">
          <div className="site-section-inner site-page-hero-grid">
            <div>
              <span className="site-kicker">{content.eyebrow}</span>
              <h1>{content.heroTitle}</h1>
              <p>{content.heroText}</p>
              <div className="service-bullet-list">
                {content.bullets.map((item) => (
                  <div className="service-bullet-item" key={item}>
                    <Check size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="site-hero-card">
              <div className="site-hero-card-image short">
                <img src={content.image} alt={content.heroTitle} />
              </div>
              <div className="site-hero-card-body">
                <span>Como funciona</span>
                <strong>Voce escolhe o pacote e envia</strong>
                <p>
                  A simulacao ja vai com valor estimado, extras e detalhes importantes para o atendimento responder mais rapido.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner">
            <div className="site-inline-steps">
              <div>
                <span>1</span>
                <strong>Escolha o pacote</strong>
                <p>Veja a estrutura de investimento que melhor combina com o momento.</p>
              </div>
              <div>
                <span>2</span>
                <strong>Adicione extras</strong>
                <p>Personalize com album, video, maquiagem ou outros complementos do servico.</p>
              </div>
              <div>
                <span>3</span>
                <strong>Envie a simulacao</strong>
                <p>Seu pedido entra no ERP da Vida em Foco para acompanhamento e retorno.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-band soft">
          <div className="site-section-inner">
            <QuoteSimulator catalog={catalog} initialServiceSlug={slug} compact />
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner site-service-nav">
            <span className="site-kicker">Continue navegando</span>
            <div className="site-service-nav-links">
              {catalog.filter((item) => item.slug !== slug).map((item) => (
                <Link key={item.slug} to={`/servicos/${item.slug}`}>
                  <span>{item.name}</span>
                  <ChevronRight size={16} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
