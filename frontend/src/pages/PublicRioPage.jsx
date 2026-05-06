import { ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeoMeta } from '../components/SeoMeta.jsx';
import { getServiceRoute, homeCollections } from '../data/publicSite.js';

function whatsappHref() {
  const phone = (import.meta.env.VITE_PUBLIC_WHATSAPP || '').replace(/\D/g, '');
  const text = encodeURIComponent('Oi! Vim pela pagina Fotografo no Rio de Janeiro e quero um orcamento.');
  return phone ? `https://wa.me/${phone}?text=${text}` : '/';
}

export function PublicRioPage() {
  return (
    <>
      <SeoMeta
        title="Fotografo no Rio de Janeiro | Mel Fotografia RJ"
        description="Fotografo no Rio de Janeiro para ensaio gestante RJ, ensaio infantil RJ, ensaio casal RJ e fotografia de casamento RJ com atendimento acolhedor."
        path="/fotografo-no-rio-de-janeiro"
        keywords={[
          'fotografo no rio de janeiro',
          'fotografo rj',
          'fotografo de casamento rj',
          'ensaio gestante rj',
          'ensaio infantil rj',
          'ensaio casal rj'
        ]}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Mel Fotografia RJ',
          url: import.meta.env.VITE_PUBLIC_SITE_URL || undefined,
          telephone: import.meta.env.VITE_PUBLIC_WHATSAPP || undefined,
          areaServed: {
            '@type': 'City',
            name: 'Rio de Janeiro'
          },
          description:
            'Fotografo no Rio de Janeiro para casamentos, gestantes, infantil, casal, familia e eventos com atendimento personalizado.'
        }}
      />

      <main>
        <section className="site-page-hero">
          <div className="site-section-inner site-page-hero-grid">
            <div>
              <span className="site-kicker">Fotografo no Rio de Janeiro</span>
              <h1>Fotografo no Rio de Janeiro para ensaios, casamentos e eventos com sensibilidade</h1>
              <p>
                A Mel Fotografia atende clientes que buscam um fotografo no Rio de Janeiro com um olhar delicado,
                orientacao leve e uma experiencia clara desde o primeiro contato.
              </p>
              <div className="service-bullet-list">
                <div className="service-bullet-item">
                  <MapPin size={16} />
                  <span>Atendimento em diferentes regioes do Rio de Janeiro e RJ</span>
                </div>
                <div className="service-bullet-item">
                  <MapPin size={16} />
                  <span>Casamento, gestante, infantil, casal e outros ensaios fotograficos</span>
                </div>
                <div className="service-bullet-item">
                  <MapPin size={16} />
                  <span>Orcamento online e contato rapido por WhatsApp</span>
                </div>
              </div>
            </div>

            <div className="site-hero-card">
              <div className="site-hero-card-image short">
                <img
                  src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1400&q=80"
                  alt="fotografo no rio de janeiro registrando casal em ensaio externo"
                />
              </div>
              <div className="site-hero-card-body">
                <span>Rio de Janeiro e RJ</span>
                <strong>Uma pagina local pensada para quem procura fotografia na cidade</strong>
                <p>Conheca os servicos mais buscados e siga para a pagina que combina com o seu momento.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner">
            <div className="site-copy-block">
              <span className="site-kicker">Atendimento local</span>
              <h2>Fotografo no Rio de Janeiro</h2>
              <p>
                Se voce esta procurando um fotografo no Rio de Janeiro, a Mel Fotografia oferece ensaios fotograficos personalizados para casais, gestantes, familias e eventos.
              </p>
              <p>
                Atendemos em diversas regioes do RJ, criando registros naturais, elegantes e cheios de emocao. Cada ensaio e pensado de forma unica, respeitando o estilo e o momento de cada cliente.
              </p>
              <p>
                Seja para ensaio gestante, infantil, casal ou fotografia de casamento no Rio de Janeiro, nosso objetivo e eternizar seus melhores momentos com qualidade e sensibilidade.
              </p>
            </div>
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner">
            <div className="site-heading">
              <span className="site-kicker">Servicos</span>
              <h2>Paginas mais buscadas no Rio de Janeiro</h2>
              <p>Escolha a experiencia que mais combina com o seu momento e veja detalhes, pacotes e simulacao.</p>
            </div>
            <div className="site-service-nav-links">
              {homeCollections.map((service) => (
                <Link key={service.slug} to={getServiceRoute(service.slug)}>
                  <span>{service.title}</span>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="site-band soft">
          <div className="site-section-inner">
            <div className="site-copy-block">
              <span className="site-kicker">Contato</span>
              <h2>Fale com a Mel Fotografia RJ</h2>
              <p>
                Se voce quer saber mais sobre ensaio fotografico no RJ, datas, valores e formatos de cobertura, o WhatsApp e o caminho mais rapido para iniciar o atendimento.
              </p>
              <a className="site-primary-button" href={whatsappHref()} target="_blank" rel="noreferrer">
                <MessageCircle size={18} />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
