import { ArrowRight, HeartHandshake, ImagePlus, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeoMeta } from '../components/SeoMeta.jsx';
import { homeCollections, serviceContent } from '../data/publicSite.js';

function whatsappHref() {
  const phone = (import.meta.env.VITE_PUBLIC_WHATSAPP || '').replace(/\D/g, '');
  const text = encodeURIComponent(
    'Oi! Vim pelo site da Vida em Foco e quero ajuda para escolher um ensaio ou evento.'
  );
  return phone ? `https://wa.me/${phone}?text=${text}` : '/';
}

export function PublicHome() {
  return (
    <>
      <SeoMeta
        title="Fotógrafo no Rio de Janeiro | Vida em Foco Fotografia RJ"
        description="Fotógrafo no Rio de Janeiro especializado em ensaios fotográficos, casamento, gestante, infantil, casal, família e eventos. Solicite seu orçamento pelo WhatsApp."
        path="/"
        keywords={[
          'fotógrafo no Rio de Janeiro',
          'fotógrafo RJ',
          'ensaio fotográfico RJ',
          'fotógrafo de casamento RJ',
          'ensaio gestante Rio de Janeiro',
          'ensaio infantil RJ',
          'Vida em Foco Fotografia RJ'
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Vida em Foco Fotografia RJ',
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
            'Fotógrafo no Rio de Janeiro especializado em ensaios fotográficos, casamento, gestante, infantil, casal, família e eventos.'
        }}
      />

      <main>
        <section className="site-hero">
          <div className="site-section-inner site-hero-grid">
            <div className="site-hero-copy">
              <span className="site-kicker">Fotógrafo no Rio de Janeiro</span>

              <h1>
                Vida em Foco Fotografia RJ: ensaios, casamentos e eventos no Rio de Janeiro
              </h1>

              <p>
                A Vida em Foco Fotografia é especializada em ensaios fotográficos no Rio de Janeiro,
                incluindo ensaio gestante, infantil, casal, família, casamento e cobertura de eventos.
                Cada registro é feito com sensibilidade, direção leve e atenção aos detalhes para
                eternizar seus melhores momentos.
              </p>

              <div className="site-badge-row">
                <span className="site-badge">Fotógrafo profissional RJ</span>
                <span className="site-badge">Ensaios fotográficos no Rio de Janeiro</span>
                <span className="site-badge">Casamentos, gestante, infantil e família</span>
              </div>

              <div className="site-hero-actions">
                <a className="site-primary-button" href={whatsappHref()} target="_blank" rel="noreferrer">
                  <MessageCircle size={18} />
                  Falar no WhatsApp
                </a>

                <Link className="site-ghost-button" to="/servicos/casamento">
                  Ver serviços
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="site-hero-card">
              <div className="site-hero-card-image">
                <img
                  src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1400&q=80"
                  alt="Fotógrafo no Rio de Janeiro registrando casal em ensaio fotográfico"
                />
              </div>

              <div className="site-hero-card-body">
                <span>Uma experiência leve desde o primeiro contato</span>
                <strong>Escolha com calma, compare e imagine seu dia</strong>
                <p>
                  O site ajuda você a visualizar possibilidades, entender faixas de investimento
                  e pedir um orçamento com mais segurança.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner">
            <div className="site-heading">
              <span className="site-kicker">Ensaios e eventos no RJ</span>

              <h2>Escolha o tipo de ensaio ou evento que faz sentido para você</h2>

              <p>
                Cada página foi pensada para ajudar você a explorar estilos, entender opções
                e solicitar um orçamento de um jeito mais prático e inspirador com a Vida em Foco
                Fotografia no Rio de Janeiro.
              </p>
            </div>

            <div className="site-service-grid">
              {homeCollections.map((item) => (
                <article className="site-service-card" key={item.slug}>
                  <span>{item.title}</span>
                  <h3>{serviceContent[item.slug]?.heroTitle || item.title}</h3>
                  <p>{item.text}</p>
                  <Link to={serviceContent[item.slug]?.route || '/'}>Abrir experiência</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="site-band soft">
          <div className="site-section-inner site-proof-grid">
            <article className="site-proof-card">
              <Sparkles size={20} />
              <strong>Pacotes mais claros</strong>
              <p>
                Você entende melhor as possibilidades antes mesmo de conversar sobre os detalhes finais.
              </p>
            </article>

            <article className="site-proof-card">
              <ImagePlus size={20} />
              <strong>Escolha mais personalizada</strong>
              <p>
                Data, local, extras e estilo desejado podem ser informados de um jeito simples
                em um único pedido.
              </p>
            </article>

            <article className="site-proof-card">
              <HeartHandshake size={20} />
              <strong>Atendimento mais atencioso</strong>
              <p>
                Com mais contexto sobre o que você imagina, o retorno fica mais próximo,
                útil e alinhado ao seu momento.
              </p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}