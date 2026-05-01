import { ArrowRight, HeartHandshake, ImagePlus, MessageCircle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client.js';
import { QuoteSimulator } from '../components/QuoteSimulator.jsx';
import { SeoMeta } from '../components/SeoMeta.jsx';
import { homeCollections, serviceContent } from '../data/publicSite.js';

function whatsappHref() {
  const phone = (import.meta.env.VITE_PUBLIC_WHATSAPP || '').replace(/\D/g, '');
  const text = encodeURIComponent('Oi! Vim pelo site da Vida em Foco e quero ajuda para escolher um ensaio ou evento.');
  return phone ? `https://wa.me/${phone}?text=${text}` : '/';
}

export function PublicHome() {
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    api('/public/quote-catalog').then(setCatalog).catch(console.error);
  }, []);

  return (
    <>
      <SeoMeta
        title="Vida em Foco Fotografia | Ensaios, casamentos e simulacao online"
        description="Site publico da Vida em Foco Fotografia com servicos, simulacao de orcamento e envio direto para o atendimento."
        path="/"
        keywords={['Vida em Foco Fotografia', 'simulacao de orcamento fotografia', 'casamento', 'ensaio gestante', 'ensaio infantil']}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Vida em Foco Fotografia',
          image: '/vida-em-foco-logo.jpeg',
          telephone: import.meta.env.VITE_PUBLIC_WHATSAPP || undefined,
          url: import.meta.env.VITE_PUBLIC_SITE_URL || undefined,
          description: 'Ensaios, casamentos e eventos com simulacao online e atendimento integrado ao ERP.'
        }}
      />

      <main>
        <section className="site-hero">
          <div className="site-section-inner site-hero-grid">
            <div className="site-hero-copy">
              <span className="site-kicker">Fotografia com atendimento organizado</span>
              <h1>Escolha seu evento, monte a simulacao e receba um atendimento mais rapido</h1>
              <p>
                O site publico da Vida em Foco foi pensado para cliente final: voce navega pelos servicos, compara
                pacotes, adiciona extras e envia a simulacao para o atendimento sem depender de mensagens soltas.
              </p>
              <div className="site-badge-row">
                <span className="site-badge">Simulacao de orcamento online</span>
                <span className="site-badge">Pacotes e extras por servico</span>
                <span className="site-badge">Pedido entra direto no ERP</span>
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
                <span>Fluxo simples para o cliente</span>
                <strong>Escolhe, simula e envia</strong>
                <p>Do primeiro clique ao pedido no painel, tudo fica mais claro para quem quer contratar e para quem vai atender.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner">
            <div className="site-heading">
              <span className="site-kicker">Experiencias</span>
              <h2>O site agora conversa com quem quer contratar</h2>
              <p>
                Em vez de uma vitrine estatica, a pessoa encontra uma experiencia de escolha e simulacao.
                Isso deixa o pedido mais completo antes mesmo de chegar ao painel.
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
              <strong>Pacotes claros</strong>
              <p>O cliente entende faixas de investimento sem precisar perguntar tudo do zero.</p>
            </article>
            <article className="site-proof-card">
              <ImagePlus size={20} />
              <strong>Pedido mais completo</strong>
              <p>Data, local, extras e preferencia de contato seguem juntos para o ERP.</p>
            </article>
            <article className="site-proof-card">
              <HeartHandshake size={20} />
              <strong>Atendimento mais humano</strong>
              <p>Voce recebe uma solicitacao melhor preenchida e pode responder com mais contexto.</p>
            </article>
          </div>
        </section>

        <section className="site-band">
          <div className="site-section-inner">
            <QuoteSimulator catalog={catalog} />
          </div>
        </section>
      </main>
    </>
  );
}
