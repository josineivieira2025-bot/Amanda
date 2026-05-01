import { Check, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { QuoteSimulator } from '../components/QuoteSimulator.jsx';
import { SeoMeta } from '../components/SeoMeta.jsx';
import { getServiceContent, getServiceRoute, resolveServiceKey } from '../data/publicSite.js';

export function PublicServicePage({ slugOverride = '' }) {
  const params = useParams();
  const routeSlug = slugOverride || params.slug;
  const content = getServiceContent(routeSlug);
  const serviceKey = content?.serviceSlug || resolveServiceKey(routeSlug);
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    api('/public/quote-catalog').then(setCatalog).catch(console.error);
  }, []);

  const service = useMemo(() => catalog.find((item) => item.slug === serviceKey), [catalog, serviceKey]);

  if (!content) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SeoMeta
        title={content.seoTitle}
        description={content.seoDescription}
        path={content.seoRoute}
        keywords={content.seoKeywords}
        image={content.image}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service?.name || content.heroTitle,
          description: content.seoDescription,
          areaServed: {
            '@type': 'City',
            name: 'Rio de Janeiro'
          },
          provider: {
            '@type': 'LocalBusiness',
            name: 'Vida em Foco Fotografia RJ'
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
                <img src={content.image} alt={content.imageAlt} />
              </div>
              <div className="site-hero-card-body">
                <span>SEO local no Rio de Janeiro</span>
                <strong>Servico pensado para quem busca fotografia no RJ</strong>
                <p>Esta pagina foi otimizada para explicar melhor o servico, mostrar possibilidades e facilitar o pedido de orcamento.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner">
            <div className="site-heading">
              <span className="site-kicker">Servico no Rio de Janeiro</span>
              <h2>Como funciona {service?.name || content.eyebrow} no Rio de Janeiro</h2>
            </div>
            <div className="site-copy-block">
              <span className="site-kicker">Fotografia no RJ</span>
              <h2>{content.seoTitle}</h2>
              {content.seoIntro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner">
            <div className="site-heading">
              <span className="site-kicker">Etapas</span>
              <h2>Veja como voce pode montar seu pedido</h2>
            </div>
            <div className="site-inline-steps">
              <div>
                <span>1</span>
                <strong>Veja as opcoes</strong>
                <p>Veja a estrutura de investimento que melhor combina com o momento.</p>
              </div>
              <div>
                <span>2</span>
                <strong>Personalize</strong>
                <p>Personalize com album, video, maquiagem ou outros complementos do servico.</p>
              </div>
              <div>
                <span>3</span>
                <strong>Solicite seu orcamento</strong>
                <p>Envie seu pedido e receba um retorno mais alinhado ao estilo, data e formato que voce imaginou.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-band soft">
          <div className="site-section-inner">
            <QuoteSimulator catalog={catalog} initialServiceSlug={serviceKey} compact showServicePicker={false} />
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner site-service-nav">
            <span className="site-kicker">Continue navegando</span>
            <h2>Veja outros ensaios e servicos relacionados</h2>
            <div className="site-service-nav-links">
              {content.relatedServices.map((item) => (
                <Link key={item.slug} to={getServiceRoute(item.slug)}>
                  <span>{item.label}</span>
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
