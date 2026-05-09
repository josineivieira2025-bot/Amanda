import { Check, ChevronRight, MapPin, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import { QuoteSimulator } from '../components/QuoteSimulator.jsx';
import { SeoMeta } from '../components/SeoMeta.jsx';
import { getServiceContent, getServiceRoute, resolveServiceKey } from '../data/publicSite.js';

const pageStyles = `
  :root {
    --mel-bg: #f8fff9;
    --mel-bg-soft: #edf8ef;
    --mel-card: rgba(255,255,255,0.84);
    --mel-card-strong: #ffffff;
    --mel-text: #1f3427;
    --mel-muted: #526b59;
    --mel-line: rgba(47, 112, 66, 0.10);
    --mel-primary: #76bd86;
    --mel-primary-dark: #2f7042;
    --mel-accent: #dff3e4;
    --mel-accent-2: #edf9ef;
    --mel-shadow-sm: 0 12px 30px rgba(45, 92, 57, 0.06);
    --mel-shadow-md: 0 20px 60px rgba(45, 92, 57, 0.10);
    --mel-shadow-lg: 0 28px 80px rgba(45, 92, 57, 0.14);
    --mel-radius-sm: 14px;
    --mel-radius-md: 24px;
    --mel-radius-lg: 34px;
    --mel-container: 1180px;
  }

  * {
    box-sizing: border-box;
  }

  .mel-service-page {
    color: var(--mel-text);
    background:
      radial-gradient(circle at top left, rgba(210, 239, 217, 0.95), transparent 32%),
      radial-gradient(circle at top right, rgba(235, 250, 238, 0.82), transparent 28%),
      linear-gradient(180deg, #f8fff9 0%, #edf8ef 100%);
    overflow: hidden;
  }

  .mel-service-page img {
    display: block;
    max-width: 100%;
  }

  .mel-service-page a {
    text-decoration: none;
  }

  .mel-container {
    width: min(var(--mel-container), calc(100% - 32px));
    margin: 0 auto;
  }

  .mel-kicker {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 36px;
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(143, 207, 157, 0.22);
    color: var(--mel-primary-dark);
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .mel-section {
    padding: 72px 0;
    position: relative;
  }

  .mel-section-soft {
    background:
      linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(223,243,228,0.55) 100%);
  }

  .mel-hero {
    padding: 48px 0 38px;
  }

  .mel-hero-grid {
    display: grid;
    grid-template-columns: 1.08fr 0.92fr;
    gap: 38px;
    align-items: center;
  }

  .mel-hero-copy {
    max-width: 680px;
  }

  .mel-hero-copy h1 {
    margin: 18px 0 18px;
    font-size: clamp(2.2rem, 5vw, 4.5rem);
    line-height: 1.02;
    letter-spacing: -0.045em;
    font-weight: 800;
    color: #1f3427;
  }

  .mel-hero-copy p {
    margin: 0;
    color: var(--mel-muted);
    font-size: 1.06rem;
    line-height: 1.82;
    max-width: 58ch;
  }

  .mel-bullet-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 28px;
  }

  .mel-bullet-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 18px;
    background: rgba(255,255,255,0.72);
    border: 1px solid var(--mel-line);
    box-shadow: var(--mel-shadow-sm);
    backdrop-filter: blur(10px);
  }

  .mel-bullet-item svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: var(--mel-primary);
  }

  .mel-bullet-item span {
    color: #36523e;
    font-size: 0.95rem;
    line-height: 1.55;
    font-weight: 600;
  }

  .mel-hero-card {
    overflow: hidden;
    border-radius: var(--mel-radius-lg);
    background: rgba(255,255,255,0.78);
    border: 1px solid var(--mel-line);
    box-shadow: var(--mel-shadow-lg);
    backdrop-filter: blur(14px);
  }

  .mel-hero-image {
    position: relative;
    aspect-ratio: 4 / 4.6;
    overflow: hidden;
  }

  .mel-hero-image.short {
    aspect-ratio: 4 / 4.3;
  }

  .mel-hero-image::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(32, 19, 20, 0.14) 100%);
    pointer-events: none;
  }

  .mel-hero-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s ease;
  }

  .mel-hero-card:hover .mel-hero-image img {
    transform: scale(1.04);
  }

  .mel-hero-body {
    padding: 24px;
    display: grid;
    gap: 10px;
  }

  .mel-hero-body span {
    color: var(--mel-primary-dark);
    font-size: 0.82rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .mel-hero-body strong {
    font-size: 1.28rem;
    line-height: 1.3;
    color: #1f1718;
  }

  .mel-hero-body p {
    margin: 0;
    color: var(--mel-muted);
    line-height: 1.72;
  }

  .mel-hero-floating {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 18px;
  }

  .mel-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 38px;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.75);
    border: 1px solid var(--mel-line);
    color: #4d3f41;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .mel-heading {
    max-width: 760px;
    margin-bottom: 28px;
  }

  .mel-heading.center {
    text-align: center;
    margin-inline: auto;
  }

  .mel-heading h2 {
    margin: 16px 0 10px;
    font-size: clamp(1.8rem, 3.2vw, 3rem);
    line-height: 1.08;
    letter-spacing: -0.035em;
    color: #1f1718;
  }

  .mel-heading p {
    margin: 0;
    color: var(--mel-muted);
    line-height: 1.8;
  }

  .mel-overview-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 24px;
    align-items: start;
  }

  .mel-copy-card,
  .mel-info-card,
  .mel-step-card,
  .mel-related-card,
  .mel-quote-shell {
    border: 1px solid var(--mel-line);
    background: rgba(255,255,255,0.80);
    border-radius: var(--mel-radius-md);
    box-shadow: var(--mel-shadow-sm);
    backdrop-filter: blur(10px);
  }

  .mel-copy-card {
    padding: 28px;
  }

  .mel-copy-card h3 {
    margin: 14px 0 14px;
    font-size: 1.5rem;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .mel-copy-card p {
    margin: 0 0 14px;
    color: var(--mel-muted);
    line-height: 1.82;
    font-size: 1rem;
  }

  .mel-side-stack {
    display: grid;
    gap: 16px;
  }

  .mel-info-card {
    padding: 20px;
  }

  .mel-info-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--mel-accent);
    color: var(--mel-primary-dark);
    margin-bottom: 12px;
  }

  .mel-info-card strong {
    display: block;
    font-size: 1rem;
    margin-bottom: 8px;
    color: #241c1d;
  }

  .mel-info-card p {
    margin: 0;
    color: var(--mel-muted);
    line-height: 1.72;
    font-size: 0.96rem;
  }

  .mel-steps-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  .mel-step-card {
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  .mel-step-number {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--mel-primary), var(--mel-primary-dark));
    color: white;
    font-weight: 800;
    font-size: 1rem;
    margin-bottom: 16px;
    box-shadow: 0 14px 30px rgba(47, 112, 66, 0.22);
  }

  .mel-step-card strong {
    display: block;
    font-size: 1.12rem;
    margin-bottom: 10px;
    color: #21191a;
  }

  .mel-step-card p {
    margin: 0;
    color: var(--mel-muted);
    line-height: 1.72;
  }

  .mel-quote-wrap {
    position: relative;
  }

  .mel-quote-shell {
    padding: 20px;
    border-radius: 30px;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.78) 100%);
    box-shadow: var(--mel-shadow-md);
  }

  .mel-quote-head {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: 20px;
    margin-bottom: 18px;
  }

  .mel-quote-head h2 {
    margin: 14px 0 0;
    font-size: clamp(1.6rem, 2.5vw, 2.4rem);
    line-height: 1.1;
    letter-spacing: -0.03em;
  }

  .mel-quote-head p {
    margin: 10px 0 0;
    color: var(--mel-muted);
    line-height: 1.7;
    max-width: 620px;
  }

  .mel-related-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 18px;
  }

  .mel-related-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    min-height: 92px;
    padding: 18px 18px;
    color: #231b1c;
    transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  }

  .mel-related-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--mel-shadow-md);
    border-color: rgba(47, 112, 66, 0.16);
  }

  .mel-related-card span {
    font-weight: 700;
    line-height: 1.45;
  }

  .mel-related-card svg {
    flex-shrink: 0;
    color: var(--mel-primary-dark);
  }

  @media (max-width: 1080px) {
    .mel-hero-grid,
    .mel-overview-grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .mel-steps-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .mel-hero-image,
    .mel-hero-image.short {
      aspect-ratio: 16 / 10;
    }
  }

  @media (max-width: 768px) {
    .mel-container {
      width: min(var(--mel-container), calc(100% - 20px));
    }

    .mel-section {
      padding: 52px 0;
    }

    .mel-hero {
      padding: 28px 0 22px;
    }

    .mel-hero-copy h1 {
      font-size: clamp(2rem, 9vw, 3.1rem);
      line-height: 1.05;
      margin-top: 14px;
    }

    .mel-hero-copy p,
    .mel-copy-card p,
    .mel-info-card p,
    .mel-step-card p,
    .mel-quote-head p {
      font-size: 0.97rem;
      line-height: 1.74;
    }

    .mel-bullet-grid,
    .mel-steps-grid,
    .mel-related-grid {
      grid-template-columns: 1fr;
    }

    .mel-copy-card,
    .mel-step-card,
    .mel-info-card {
      padding: 20px;
    }

    .mel-hero-card {
      border-radius: 24px;
    }

    .mel-hero-body {
      padding: 20px;
    }

    .mel-quote-shell {
      padding: 16px;
      border-radius: 24px;
    }

    .mel-quote-head {
      flex-direction: column;
      align-items: start;
      gap: 8px;
    }

    .mel-hero-floating {
      gap: 8px;
    }

    .mel-chip {
      font-size: 0.86rem;
    }
  }
`;

export function PublicServicePage({ slugOverride = '' }) {
  const params = useParams();
  const routeSlug = slugOverride || params.slug;
  const content = getServiceContent(routeSlug);
  const serviceKey = content?.serviceSlug || resolveServiceKey(routeSlug);
  const [catalog, setCatalog] = useState([]);
  const [catalogLoaded, setCatalogLoaded] = useState(false);

  useEffect(() => {
    api('/public/quote-catalog')
      .then((response) => setCatalog(Array.isArray(response) ? response : []))
      .catch((error) => {
        console.error(error);
        setCatalog([]);
      })
      .finally(() => setCatalogLoaded(true));
  }, []);

  const service = useMemo(
    () => (Array.isArray(catalog) ? catalog.find((item) => item.slug === serviceKey) : undefined),
    [catalog, serviceKey]
  );

  if (!content && catalogLoaded && !service) {
    return <Navigate to="/" replace />;
  }

  const pageContent = content || {
    eyebrow: service?.name || 'Servico',
    seoTitle: `${service?.name || 'Servico fotografico'} no Rio de Janeiro | Mel Fotografia RJ`,
    seoDescription: service?.summary || 'Servico fotografico no Rio de Janeiro com simulacao online de orcamento.',
    seoRoute: getServiceRoute(service?.slug || routeSlug),
    seoKeywords: [service?.name || 'fotografia no rio de janeiro'],
    heroTitle: service?.name || 'Servico fotografico no Rio de Janeiro',
    heroText: service?.summary || 'Monte seu orcamento online e envie seu pedido com os detalhes principais.',
    image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1400&q=80',
    imageAlt: service?.name || 'fotografia no rio de janeiro',
    bullets: [
      'Pacotes configurados no catalogo',
      'Extras opcionais para personalizar',
      'Simulacao online com retorno pelo atendimento'
    ],
    seoIntro: [
      service?.summary || 'Esse servico foi configurado no catalogo da Mel Fotografia para facilitar a simulacao de orcamento no site publico.',
      'Voce pode comparar pacotes, escolher extras e enviar uma solicitacao com data, local e preferencias.',
      'Depois do envio, a equipe retorna com disponibilidade, orientacao e proximos passos.'
    ],
    relatedServices: catalog.filter((item) => item.slug !== service?.slug).slice(0, 3).map((item) => ({
      slug: item.slug,
      label: item.name
    }))
  };

  const heroTitle = content ? pageContent.heroTitle : service?.name || pageContent.heroTitle;
  const heroText = content ? pageContent.heroText : service?.summary || pageContent.heroText;

  return (
    <>
      <SeoMeta
        title={pageContent.seoTitle}
        description={pageContent.seoDescription}
        path={pageContent.seoRoute}
        keywords={pageContent.seoKeywords}
        image={pageContent.image}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: heroTitle,
          description: pageContent.seoDescription,
          areaServed: {
            '@type': 'City',
            name: 'Rio de Janeiro'
          },
          provider: {
            '@type': 'LocalBusiness',
            name: 'Mel Fotografia RJ'
          }
        }}
      />

      <style>{pageStyles}</style>

      <main className="mel-service-page">
        <section className="mel-section mel-hero">
          <div className="mel-container mel-hero-grid">
            <div className="mel-hero-copy">
              <span className="mel-kicker">{pageContent.eyebrow}</span>

              <h1>{heroTitle}</h1>

              <p>{heroText}</p>

              <div className="mel-bullet-grid">
                {pageContent.bullets.map((item) => (
                  <div className="mel-bullet-item" key={item}>
                    <Check size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mel-hero-floating">
                <span className="mel-chip">
                  <MapPin size={16} />
                  Rio de Janeiro
                </span>
                <span className="mel-chip">
                  <Sparkles size={16} />
                  Atendimento acolhedor
                </span>
                <span className="mel-chip">
                  <MessageCircle size={16} />
                  Pedido mais facil
                </span>
              </div>
            </div>

            <aside className="mel-hero-card">
              <div className="mel-hero-image short">
                <img src={pageContent.image} alt={pageContent.imageAlt} />
              </div>

              <div className="mel-hero-body">
                <span>SEO local no Rio de Janeiro</span>
                <strong>Servico pensado para quem busca fotografia no RJ</strong>
                <p>
                  Esta pagina foi otimizada para explicar melhor o servico, mostrar
                  possibilidades e facilitar o pedido de orcamento.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="mel-section mel-section-soft">
          <div className="mel-container mel-quote-wrap">
            <div className="mel-quote-shell">
              <div className="mel-quote-head">
                <div>
                  <span className="mel-kicker">Simulacao online</span>
                  <h2>Monte uma estimativa de forma simples</h2>
                  <p>
                    Escolha opcoes, compare possibilidades e envie um pedido com muito
                    mais contexto.
                  </p>
                </div>
              </div>

              <QuoteSimulator
                catalog={catalog}
                initialServiceSlug={serviceKey}
                compact
                showServicePicker={false}
              />
            </div>
          </div>
        </section>

        <section className="mel-section">
          <div className="mel-container">
            <div className="mel-heading">
              <span className="mel-kicker">Servico no Rio de Janeiro</span>
              <h2>Como funciona {service?.name || pageContent.eyebrow} no Rio de Janeiro</h2>
            </div>

            <div className="mel-overview-grid">
              <article className="mel-copy-card">
                <span className="mel-kicker">Fotografia no RJ</span>
                <h3>{pageContent.seoTitle}</h3>

                {pageContent.seoIntro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </article>

              <div className="mel-side-stack">
                <article className="mel-info-card">
                  <div className="mel-info-icon">
                    <Sparkles size={18} />
                  </div>
                  <strong>Experiencia mais clara</strong>
                  <p>
                    A pagina organiza o servico de forma visual, explicando melhor as
                    possibilidades antes do primeiro contato.
                  </p>
                </article>

                <article className="mel-info-card">
                  <div className="mel-info-icon">
                    <ShieldCheck size={18} />
                  </div>
                  <strong>Pedido mais alinhado</strong>
                  <p>
                    Quando voce entende o formato do atendimento, o retorno fica mais util,
                    objetivo e proximo do que voce imagina.
                  </p>
                </article>

                <article className="mel-info-card">
                  <div className="mel-info-icon">
                    <MapPin size={18} />
                  </div>
                  <strong>Foco no Rio de Janeiro</strong>
                  <p>
                    O conteudo foi pensado para buscas locais e para quem deseja contratar
                    fotografia com atendimento no RJ.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="mel-section">
          <div className="mel-container">
            <div className="mel-heading center">
              <span className="mel-kicker">Etapas</span>
              <h2>Veja como voce pode montar seu pedido</h2>
            </div>

            <div className="mel-steps-grid">
              <article className="mel-step-card">
                <div className="mel-step-number">1</div>
                <strong>Veja as opcoes</strong>
                <p>
                  Veja a estrutura de investimento que melhor combina com o momento,
                  estilo e tipo de cobertura que voce procura.
                </p>
              </article>

              <article className="mel-step-card">
                <div className="mel-step-number">2</div>
                <strong>Personalize</strong>
                <p>
                  Personalize com album, video, maquiagem ou outros complementos do
                  servico para montar algo mais proximo da sua ideia.
                </p>
              </article>

              <article className="mel-step-card">
                <div className="mel-step-number">3</div>
                <strong>Solicite seu orcamento</strong>
                <p>
                  Envie seu pedido e receba um retorno mais alinhado ao estilo, data e
                  formato que voce imaginou.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="mel-section">
          <div className="mel-container">
            <div className="mel-heading">
              <span className="mel-kicker">Continue navegando</span>
              <h2>Veja outros ensaios e servicos relacionados</h2>
            </div>

            <div className="mel-related-grid">
              {pageContent.relatedServices.map((item) => (
                <Link
                  key={item.slug}
                  to={getServiceRoute(item.slug)}
                  className="mel-related-card"
                >
                  <span>{item.label}</span>
                  <ChevronRight size={18} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
