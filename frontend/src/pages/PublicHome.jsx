import { ArrowRight, HeartHandshake, ImagePlus, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeoMeta } from '../components/SeoMeta.jsx';
import { getServiceRoute, homeCollections, serviceContent } from '../data/publicSite.js';

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
        title="Fotografo no Rio de Janeiro | Vida em Foco Fotografia RJ"
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
            'Fotografo no Rio de Janeiro especializado em casamentos, ensaio gestante RJ, ensaio infantil RJ, ensaio casal RJ e eventos.'
        }}
      />

      <main>
        <section className="site-hero">
          <div className="site-section-inner site-hero-grid">
            <div className="site-hero-copy">
              <span className="site-kicker">Fotografo no Rio de Janeiro</span>
              <h1>Vida em Foco Fotografia RJ para ensaios, casamentos e eventos no Rio de Janeiro</h1>
              <p>
                A Vida em Foco Fotografia atende clientes no Rio de Janeiro com uma proposta delicada, elegante e clara
                para quem busca ensaio fotografico no RJ, fotografia de casamento e registros afetivos em diferentes fases da vida.
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

                <Link className="site-ghost-button" to="/fotografo-casamento-rio-de-janeiro">
                  Ver servicos
                  <ArrowRight size={18} />
                </Link>
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
                <p>O site ajuda voce a visualizar possibilidades, entender faixas de investimento e pedir um orcamento com mais seguranca.</p>
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
                Cada pagina foi pensada para ajudar voce a explorar estilos, entender opcoes e solicitar um orcamento
                de um jeito mais pratico e inspirador com a Vida em Foco Fotografia no Rio de Janeiro.
              </p>
            </div>

            <div className="site-service-grid">
              {homeCollections.map((item) => (
                <article className="site-service-card" key={item.slug}>
                  <span>{item.title}</span>
                  <h3>{serviceContent[item.slug]?.heroTitle || item.title}</h3>
                  <p>{item.text}</p>
                  <Link to={getServiceRoute(item.slug)}>Abrir experiencia</Link>
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
              <p>Voce entende melhor as possibilidades antes mesmo de conversar sobre os detalhes finais.</p>
            </article>

            <article className="site-proof-card">
              <ImagePlus size={20} />
              <strong>Escolha mais personalizada</strong>
              <p>Data, local, extras e estilo desejado podem ser informados de um jeito simples em um unico pedido.</p>
            </article>

            <article className="site-proof-card">
              <HeartHandshake size={20} />
              <strong>Atendimento mais atencioso</strong>
              <p>Com mais contexto sobre o que voce imagina, o retorno fica mais proximo, util e alinhado ao seu momento.</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
