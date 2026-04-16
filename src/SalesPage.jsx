import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import './SalesPage.css';

// ── Tracking helper (shared) ──────────────────────────────
const trackSalesEvent = (eventName, params = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
  if (typeof window.utmify === 'function') {
    try { window.utmify('track', eventName, params); } catch(e) {}
  }
  if (import.meta.env.DEV) {
    console.log(`[TRACK-SALES] ${eventName}`, params);
  }
};

export const VTurbPlayer = ({ videoId }) => {
  const containerId = `vturb-container-${videoId}`;
  
  useEffect(() => {
    // 1. Remove scripts antigos para evitar conflitos de ID
    const oldScript = document.getElementById(`vturb-script-${videoId}`);
    if (oldScript) oldScript.remove();

    // 2. Cria o novo script
    const s = document.createElement("script");
    s.id = `vturb-script-${videoId}`;
    s.src = `https://scripts.converteai.net/ccc32a7d-f62b-4e19-81ee-38eb6654ebaf/players/${videoId}/v4/player.js`;
    s.async = true;
    
    // Adiciona o script ao final do body para garantir que o DOM já resolveu
    document.body.appendChild(s);

    return () => {
      // Limpeza ao desmontar o componente
      const scriptToRemove = document.getElementById(`vturb-script-${videoId}`);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [videoId]);

  return (
    <div 
      id={containerId}
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '200px', // Garante que o container não colapse
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#000',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
      dangerouslySetInnerHTML={{ 
        __html: `<vturb-smartplayer id="vid-${videoId}" style="display:block;margin:0 auto;width:100% !important;max-width:100% !important;height:100% !important;"></vturb-smartplayer>` 
      }}
    />
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-item">
      <div className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question}
        {isOpen ? <ChevronUp size={20} color="#9ca3af" /> : <ChevronDown size={20} color="#9ca3af" />}
      </div>
      {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
  );
};

const carouselItems = [
  { type: 'video', src: '/images/antes e depois tratamento.mp4' },
  { type: 'image', src: '/images/antes e depois melasma 2.jpg' },
  { type: 'image', src: '/images/antes e depois melasma 3.jpg' },
  { type: 'image', src: '/images/antes e depois melasma 4.jpg' },
  { type: 'image', src: '/images/antes e depois melasma 5.jpg' },
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  const next = () => setCurrentIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1));
  const prev = () => setCurrentIndex((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));

  const current = carouselItems[currentIndex];

  // Force play video when it becomes the active slide
  useEffect(() => {
    if (current.type === 'video' && videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked — muted retry
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    }
  }, [currentIndex]);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', background: '#000', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
      {current.type === 'video' ? (
        <video 
          key={`video-${currentIndex}`}
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} 
        >
          <source src={current.src} type="video/mp4" />
        </video>
      ) : (
        <img 
          src={current.src} 
          alt={`Antes e Depois ${currentIndex}`} 
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      )}
      
      <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(234, 179, 8, 0.95)', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, zIndex: 10 }}>
        ANTES / DEPOIS
      </div>

      <button onClick={prev} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
        <ChevronLeft size={20} color="#111827" />
      </button>
      <button onClick={next} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}>
        <ChevronRight size={20} color="#111827" />
      </button>

      <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px', zIndex: 10 }}>
        {carouselItems.map((_, idx) => (
          <div key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === currentIndex ? 'var(--primary)' : 'rgba(255,255,255,0.5)' }} />
        ))}
      </div>
    </div>
  );
};

const SalesPage = () => {
  const [timeLeft, setTimeLeft] = useState(8 * 60 + 42); // 08:42

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCheckout = () => {
    const checkoutUrl = 'https://pay.wiapy.com/V73shbXRtn';

    // 1. Track InitiateCheckout via gtag
    trackSalesEvent('initiate_checkout', {
      event_category: 'funnel',
      content_name: 'Protocolo Anti-Melasma',
      value: 37.90,
      currency: 'BRL'
    });

    // 2. Fire Google Ads conversion event and redirect
    if (typeof window.gtag_report_conversion === 'function') {
      window.gtag_report_conversion(checkoutUrl);
    } else {
      window.location.href = checkoutUrl;
    }
  };

  const scrollToOffer = () => {
    // Track scroll-to-offer intent
    trackSalesEvent('scroll_to_offer', { event_category: 'engagement' });
    document.getElementById('oferta-principal')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="sales-page">
      <div className="sales-alert">
        Atenção: O seu melasma está em estado de alerta e precisa ser tratado urgente
      </div>

      <div className="sales-container">
        <h1 className="sales-headline">
          A causa das suas manchas é sistêmica, e precisa ser tratada de dentro para fora.<br/><br/>
          A Dra Ana Vilella criou um protocolo personalizado para combater essa causa raiz das suas manchas de forma natural.
        </h1>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, textAlign: 'center', marginBottom: '1rem', color: '#111827' }}>
          Tudo que você vai receber 👇
        </h2>

        <img 
          src="/images/começo pg.png" 
          alt="Início do Diagnóstico" 
          loading="lazy"
          decoding="async"
          style={{ width: '100%', display: 'block', borderRadius: '12px', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }} 
        />

        <div className="timeline-list">
          <div className="timeline-item">
            <div className="timeline-badge badge-red">Hoje</div>
            <div className="timeline-content">
              <div className="timeline-desc"><strong>10%</strong> Manchas no rosto, baixa autoestima.</div>
              <div className="offer-progress"><div className="offer-progress-fill" style={{ '--bar-target': '10%', '--bar-delay': '0s' }}></div></div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-badge badge-green">Sem. 1</div>
            <div className="timeline-content">
              <div className="timeline-desc"><strong>20%</strong> Desintoxicação do organismo.</div>
              <div className="offer-progress"><div className="offer-progress-fill" style={{ '--bar-target': '20%', '--bar-delay': '0.2s' }}></div></div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-badge badge-green">Sem. 2</div>
            <div className="timeline-content">
              <div className="timeline-desc"><strong>40%</strong> Diminui produção de Melanina.</div>
              <div className="offer-progress"><div className="offer-progress-fill" style={{ '--bar-target': '40%', '--bar-delay': '0.4s' }}></div></div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-badge badge-green">Sem. 3</div>
            <div className="timeline-content">
              <div className="timeline-desc"><strong>60%</strong> Clareamento visível das manchas.</div>
              <div className="offer-progress"><div className="offer-progress-fill" style={{ '--bar-target': '60%', '--bar-delay': '0.6s' }}></div></div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-badge badge-green">Sem. 4</div>
            <div className="timeline-content">
              <div className="timeline-desc"><strong>70%</strong> Maioria das manchas eliminadas.</div>
              <div className="offer-progress"><div className="offer-progress-fill" style={{ '--bar-target': '70%', '--bar-delay': '0.8s' }}></div></div>
            </div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-badge badge-green">Sem. 5</div>
            <div className="timeline-content">
              <div className="timeline-desc"><strong>100%</strong> Rosto sem manchas, zero rebote.</div>
              <div className="offer-progress"><div className="offer-progress-fill" style={{ '--bar-target': '100%', '--bar-delay': '1.0s' }}></div></div>
            </div>
          </div>
        </div>

        <div className="cost-anchor">
          <h3>Você já parou pra pensar o quanto já gastou tentando resolver o melasma?</h3>
          <div className="cost-item">👩‍⚕️ Consultas com Dermato: <span className="strike">300,00</span></div>
          <div className="cost-item">🧴 Sérum clareador: <span className="strike">197,00</span></div>
          <div className="cost-item">💧 Pomadas: <span className="strike">70,00</span></div>
          <div className="cost-item">✨ Creme Clareador: <span className="strike">95,00</span></div>
          
          <div className="cost-highlight">
            Protocolo Personalizado da Dra Ana Vilella R$ 37,90
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', marginTop: '1rem' }}>
            Pelo valor de uma pizza, você vai investir em um método personalizado e receber todos os bônus.
          </p>
        </div>


        <img 
          src="/images/garantia de 30 d copy.png" 
          alt="Garantia de 30 dias" 
          loading="lazy"
          decoding="async"
          style={{ width: '100%', display: 'block', margin: '0 auto 2rem auto', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }} 
        />

        <button className="btn-primary btn-animated" onClick={scrollToOffer} style={{ marginBottom: '2rem' }}>
          Quero acabar com o meu Melasma
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#111827' }}>Quem usa tem resultados 😄👇</h3>
          <TestimonialCarousel />
        </div>



        <div style={{ background: '#fee2e2', borderRadius: '12px', padding: '1.5rem 1rem', textAlign: 'center', marginBottom: '1.5rem', border: '1px solid currentColor', color: '#ef4444', boxShadow: 'var(--shadow-sm)' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>
            Por conta do alto volume de mulheres interessadas nesse protocolo, a sua vaga está garantida por
          </p>
          <div className="timer" style={{ fontSize: '2rem', fontWeight: 800, margin: '0.5rem 0' }}>{formatTime(timeLeft)}</div>
          <p style={{ fontSize: '0.75rem', color: '#4b5563', marginTop: '0.5rem' }}>
            após isso será liberada para outra pessoa.
          </p>
        </div>

        <div id="oferta-principal" className="sales-cta-box" style={{ border: '2px solid var(--primary)', overflow: 'hidden' }}>
          <div className="sales-cta-header" style={{ background: 'var(--primary)', color: 'white' }}>
            OFERTA POR TEMPO LIMITADO
          </div>

          <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>O que está incluso hoje:</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle size={16} color="var(--primary)" /> Protocolo Anti-melasma
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle size={16} color="var(--primary)" /> Acompanhamento exclusivo
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle size={16} color="var(--primary)" /> Cremes naturais clareadores 
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle size={16} color="var(--primary)" /> Protocolo personalizado
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle size={16} color="var(--primary)" /> Rotina Contra efeito rebote
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="var(--primary)" /> Garantia de 30 dias
              </li>
            </ul>
          </div>

          <div className="sales-price-wrap" style={{ margin: '0 1.5rem 1.5rem 1.5rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
            <div className="price-title">Pacote Completo Dra. Ana</div>
            <div>
              <div className="discount-badge">97% off</div>
              <div className="price-value"><span style={{ fontSize: '1rem' }}>R$</span> 37,90</div>
              <div style={{ fontSize: '0.7rem', textAlign: 'right', color: '#6b7280' }}>à vista</div>
            </div>
          </div>
          
          <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
            <button className="btn-primary btn-animated" onClick={handleCheckout} style={{ width: '100%', marginBottom: '0.75rem', padding: '1.2rem' }}>
              Quero garantir agora
            </button>
            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 4px #22c55e' }}></span>
              Mais de 3.234 mulheres adquiriram essa semana
            </div>
          </div>
        </div>

        <img 
          src="/images/dr ana vilella derma.png" 
          alt="Dra Ana Vilella Dermatologista" 
          loading="lazy"
          decoding="async"
          style={{ width: '100%', display: 'block', borderRadius: '12px', margin: '2rem auto', boxShadow: 'var(--shadow-sm)' }} 
        />

        <div style={{ marginBottom: '2rem' }}>
          <FAQItem 
            question="Tenho que tomar todos os dias?" 
            answer="Sim! O tratamento age de forma contínua no seu organismo, então a consistência é o principal fator para o sucesso." 
          />
          <FAQItem 
            question="A consulta com a Dra Ana é online?" 
            answer="Sim, tudo 100% online, você recebe o acesso ao protocolo logo após a confirmação." 
          />
          <FAQItem 
            question="Ingredientes são fáceis de encontrar?" 
            answer="Sim, a Dra recomenda compostos acessíveis e fáceis de manipular ou encontrar em lojas naturais e feiras perto da sua casa." 
          />
          <FAQItem 
            question="Quanto tempo até que eu veja os primeiros resultados?" 
            answer="Embora o tempo possa variar de mulher para mulher, grande parte relata o início do clareamento profundo a partir da 3ª semana aplicando o protocolo regradamente." 
          />
          <FAQItem 
            question="E se as manchas voltarem (efeito rebote)?" 
            answer="Diferente das clínicas dermatológicas, nosso foco é combater a causa do melasma de dentro pra fora com ativos orgânicos. Não agredimos a pele com ácidos, o que previne significativamente o tão temido efeito rebote." 
          />
          <FAQItem 
            question="Sou mais velha e passo da menopausa, isso vai funcionar pra mim?" 
            answer="Com toda certeza! A idade não tem barreiras. O principal fator aqui é focar e tratar os gatilhos hormonais, e inclusive o período de menopausa responde super bem com os ativos certos de regulação." 
          />
          <FAQItem 
            question="O protocolo é entregue pelos correios?" 
            answer="Não. O Protocolo Anti-Melasma da Dra. Ana Vilella é um acompanhamento 100% Digital. O material chega imediatamente no seu e-mail logo após a aprovação da compra, para iniciar o quanto antes." 
          />
        </div>

        <div className="guarantee-box">
          <BadgeCheckIcon />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '1rem 0 0.5rem 0' }}>Garantia de reembolso</h2>
          <div className="testimonial-stars"><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/><Star size={20} fill="currentColor"/></div>
          <p style={{ fontSize: '0.9rem', color: '#4b5563', marginTop: '1rem', lineHeight: 1.5 }}>
            O código do consumidor te garante 7 dias para pedir o reembolso. <br/><br/>
            Mas nesse protocolo você vai ter 30 dias para testar e se não tiver nenhum resultado, você recebe todo o seu dinheiro de volta e ainda continua com os bônus.<br/><br/>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Basta nos enviar uma mensagem no whatsapp e o valor será devolvido para você.</span>
          </p>
        </div>



      </div>
    </div>
  );
};

// Add a Badge icon simple component since it's used in the guarantee section
const BadgeCheckIcon = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="var(--primary)" stroke="#eab308" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="3" />
  </svg>
);

export default SalesPage;
