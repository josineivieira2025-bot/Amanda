import { ArrowRight, HeartHandshake, ImagePlus, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeoMeta } from '../components/SeoMeta.jsx';
import { homeCollections, serviceContent } from '../data/publicSite.js';

function whatsappHref() {
  const phone = (import.meta.env.VITE_PUBLIC_WHATSAPP || '').replace(/\D/g, '');
  const text = encodeURIComponent('Oi! Vim pelo site da Vida em Foco e quero ajuda para escolher um ensaio ou evento.');
  return phone ? `https://wa.me/${phone}?text=${text}` : '/';
}

export function PublicHome() {
  return (
    <>
      <SeoMeta
        title="Vida em Foco Fotografia | Ensaios, casamentos e eventos"
        description="Conheca os servicos da Vida em Foco Fotografia, escolha seu estilo e solicite um orcamento com mais clareza e praticidade."
        path="/"
        keywords={['Vida em Foco Fotografia', 'simulacao de orcamento fotografia', 'casamento', 'ensaio gestante', 'ensaio infantil']}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Vida em Foco Fotografia',
          image: '/vida-em-foco-logo.jpeg',
          telephone: import.meta.env.VITE_PUBLIC_WHATSAPP || undefined,
          url: import.meta.env.VITE_PUBLIC_SITE_URL || undefined,
          description: 'Ensaios, casamentos e eventos com atendimento atencioso, visual elegante e pedido de orcamento simplificado.'
        }}
      />

      <main>
        <section className="site-hero">
          <div className="site-section-inner site-hero-grid">
            <div className="site-hero-copy">
              <span className="site-kicker">Fotografia com sensibilidade e direcao</span>
              <h1>Registros pensados para transformar momentos em memórias bonitas de viver e rever</h1>
              <p>
                Na Vida em Foco, cada ensaio e cada evento recebe um olhar delicado, uma condução leve e uma experiência
                clara para que voce escolha o que combina com a sua historia e solicite seu orcamento com tranquilidade.
              </p>
              <div className="site-badge-row">
                <span className="site-badge">Orcamento simples e rapido</span>
                <span className="site-badge">Pacotes pensados para cada momento</span>
                <span className="site-badge">Atendimento mais proximo desde o inicio</span>
              </div>
              <div className="site-hero-actions">
                <a className="site-primary-button" href={whatsappHref()} target="_blank" rel="noreferrer">
                  <MessageCircle size={18} />
                  Falar no WhatsApp
                </a>
                <Link className="site-ghost-button" to="/servicos/casamento">
                  Ver servicos
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="site-hero-card">
              <div className="site-hero-card-image">
                <img
                  src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1400&q=80"
                  alt="Casal em ensaio fotografico"
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
              <span className="site-kicker">Experiencias</span>
              <h2>Escolha o tipo de ensaio ou evento que faz sentido para voce</h2>
              <p>
                Cada pagina foi pensada para ajudar voce a explorar estilos, entender opcoes e solicitar um orcamento
                de um jeito mais pratico e inspirador.
              </p>
            </div>

            <div className="site-service-grid">
              {homeCollections.map((item) => (
                <article className="site-service-card" key={item.slug}>
                  <span>{item.title}</span>
                  <h3>{serviceContent[item.slug]?.heroTitle || item.title}</h3>
                  <p>{item.text}</p>
                  <Link to={serviceContent[item.slug]?.route || '/'}>Abrir experiencia</Link>
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
