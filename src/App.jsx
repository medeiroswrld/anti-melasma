import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Play, Pause, BadgeCheck, CheckSquare, Square, Star } from 'lucide-react';
import './index.css';
import SalesPage, { VTurbPlayer } from './SalesPage';

const STEPS = [
  { id: 'home', type: 'info' },
  { id: 'q1', type: 'question', progress: 6 },
  { id: 'q2', type: 'question', progress: 12 },
  { id: 'q3', type: 'question', progress: 18 },
  { id: 'trans1', type: 'info', progress: 24 },
  { id: 'q4', type: 'question', progress: 30 },
  { id: 'q5', type: 'question', progress: 36 },
  { id: 'q6', type: 'question', progress: 42, multiple: true },
  { id: 'trans2', type: 'info', progress: 48 },
  { id: 'q7', type: 'question', progress: 54, multiple: true },
  { id: 'q8', type: 'question', progress: 60 },
  { id: 'q9', type: 'question', progress: 66 },
  { id: 'q14', type: 'question', progress: 80 },
  { id: 'q15', type: 'question', progress: 95 },
  { id: 'diagnostic', type: 'info', progress: 100 },
  { id: 'loading_protocol', type: 'info' },
  { id: 'sales-page', type: 'info' },
];

const QUESTIONS = {
  q1: {
    question: "Qual a região onde você tem mais manchas?",
    options: ["Testa", "Bochechas", "Buço", "Em todo o rosto"],
    images: ["/images/testa.png", "/images/bochechas.png", "/images/buço.png", "/images/rosto todo.png"],
    grid: true,
    support: "A região das suas manchas mostram o mapa do seu melasma e ajudam a chegar na causa raiz"
  },
  q2: {
    question: "Há quanto tempo você convive com as manchas?",
    options: ["Menos de 1 ano", "Entre 1 e 2 anos", "Mais de 2 anos", "Já perdi a conta"],
    support: "Quanto maior o tempo, mais provável que o seu melasma esteja ligado a fatores internos no seu organismo."
  },
  q3: {
    question: "Quando você percebeu que as manchas começaram ou pioraram?",
    options: ["Após gravidez", "Após a menopausa", "Após período de muito estresse / ansiedade", "Não sei ao certo, acho que vieram do nada"],
    images: ["/images/gravidez.png", "/images/menopausa.png", "/images/estresse.png", "/images/nao-sei.png"],
    grid: true
  },
  q4: {
    question: "Qual a intensidade das suas manchas?",
    options: ["Leve", "Média", "Forte"],
    images: ["/images/leve.png", "/images/media.png", "/images/forte.png"],
    grid: true
  },
  q5: {
    question: "Você já usou algum produto ou fez procedimentos nas manchas?",
    options: ["Sim, já usei diversos produtos", "Já usei produtos e fiz procedimento clínicos", "Fiz apenas procedimentos clínicos", "Nunca fiz nada"],
    support: "Procedimentos e produtos agressivos podem piorar o melasma ao invés de ajudar no clareamento das manchas."
  },
  q6: {
    question: "Chegou a ter algum resultado na época?",
    options: ["Sim, até que diminui um pouco", "Não, só perdi tempo e dinheiro", "Sim, mas depois de um tempo as manchas voltaram"]
  },
  q7: {
    question: "Você tem algum familiar próximo com Melasma?",
    subtitle: "Mãe, irmã ou Tia",
    options: ["Sim, na minha família tem alguns casos.", "Não, acho que sou a primeira"]
  },
  q8: {
    question: "Qual sua relação com o sol atualmente?",
    options: ["🧴 Evito ao máximo e uso protetor solar todos os dias", "🕶 Tento evitar mas só uso protetor as vezes", "☀️ Já evitei muito e mesmo assim não adiantou"]
  },
  q9: {
    question: "Com que frequência seu intestino funciona?",
    options: ["⏱ Vou ao banheiro todos os dias", "Só umas 3x por semana", "💊 Pra ir no banheiro preciso de remédios"],
    support: "O intestino está ligado a 60% dos casos de Melasma, mas grande parte dos especialistas insistem em tratar de forma superficial."
  },
  q14: {
    question: "Como você se sente em relação às manchas no seu rosto hoje?",
    options: ["Me incomoda muito, sinto muita vergonha", "Não me incomoda tanto, mas quero acabar com isso"]
  },
  q15: {
    question: "Você estaria disposta a aplicar o protocolo personalizado da Dra Ana Vilella e acabar de vez com as manchas no seu rosto?",
    options: ["Claro, eu estou pronta", "Não sei, mas eu quero tentar"]
  }
};

const LABELS = ['A', 'B', 'C', 'D'];

const VideoPlayer = ({ src, onReadyToContinue }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      if (duration && duration - currentTime <= 5) {
        onReadyToContinue();
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onReadyToContinue();
  };

  return (
    <div className="fade-in" style={{ position: 'relative', width: '100%', aspectRatio: '9/16', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem', boxShadow: 'var(--shadow-md)', backgroundColor: '#000' }}>
      <video 
        ref={videoRef}
        src={src} 
        controls={isPlaying}
        onTimeUpdate={handleTimeUpdate}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onEnded={handleEnded}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        preload="metadata"
      />
      {!isPlaying && (
        <div 
          onClick={handlePlayClick}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          <div style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-md)',
            animation: 'pulse 2s infinite ease-in-out'
          }}>
            <Play fill="currentColor" size={20} /> Clique para assistir
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Lead Info
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [canContinueT1, setCanContinueT1] = useState(false);

  // Preloading de imagens do quiz para performance máxima e sem travar a thread
  useEffect(() => {
    const preloadImages = () => {
      const allImages = [
        '/images/primeira img.png',
        '/images/começo pg.png',
        '/images/dr ana vilella derma.png',
        '/images/testa.png',
        '/images/bochechas.png',
        '/images/buço.png',
        '/images/rosto todo.png',
        '/images/gravidez.png',
        '/images/menopausa.png',
        '/images/estresse.png',
        '/images/nao-sei.png',
        '/images/leve.png',
        '/images/media.png',
        '/images/forte.png',
        '/images/garantia de 30 d copy.png',
        '/images/img cha.png',
        '/images/antes e depois melasma 1.jpg',
        '/images/antes e depois melasma 2.jpg',
        '/images/antes e depois melasma 3.jpg',
        '/images/antes e depois melasma 4.jpg',
        '/images/antes e depois melasma 5.jpg'
      ];
      
      allImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(preloadImages);
    } else {
      setTimeout(preloadImages, 1000);
    }
  }, []);

  const currentStep = STEPS[currentStepIndex];
  
  useEffect(() => {
    window.scrollTo(0, 0);

    let timer;
    if (STEPS[currentStepIndex].id === 'loading_protocol') {
      timer = setTimeout(() => {
        goToNextStep();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [currentStepIndex]);

  const goToNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex + 1);
        setIsTransitioning(false);
      }, 150); // Velocidade de transição mais responsiva
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStepIndex(currentStepIndex - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const handleOptionSelect = (optionValue) => {
    if (currentStep.multiple) {
      setAnswers(prev => {
        const current = prev[currentStep.id] || [];
        if (current.includes(optionValue)) {
          return { ...prev, [currentStep.id]: current.filter(val => val !== optionValue) };
        } else {
          return { ...prev, [currentStep.id]: [...current, optionValue] };
        }
      });
      return; // Do not auto-advance for multiple
    }

    if (selectedOption) return; // Prevent double clicking on single mode
    
    setSelectedOption(optionValue);
    setAnswers(prev => ({ ...prev, [currentStep.id]: optionValue }));
    
    setTimeout(() => {
      setSelectedOption(null);
      goToNextStep();
    }, 200); // Resposta rápida ao clique
  };

  const handleFinalSubmit = () => {
    if (!leadName || !leadPhone) {
      alert("Por favor, preencha os dados para receber seu diagnóstico.");
      return;
    }
    // Advance to sales page instead of WhatsApp popup
    goToNextStep();
  };

  const renderContent = () => {
    if (currentStep.id === 'home') {
      return (
        <div className="container slide-in">
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              backgroundColor: '#fef08a', 
              color: '#a16207', 
              padding: '6px 12px', 
              borderRadius: '50px', 
              fontSize: '0.875rem', 
              fontWeight: 600,
              width: 'fit-content',
              marginBottom: '1rem'
            }}>
              ✨ Diagnóstico Dermatológico
            </div>
            
            <h1 className="title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Faça o diagnóstico da Dra Ana Vilella e descubra a causa raiz das suas manchas
            </h1>
            <p className="subtitle" style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>
              No final você recebe um diagnóstico personalizado para eliminar as manchas em até 30 dias de forma natural e sem efeito rebote.
            </p>
            
            <div style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
              <img src="/images/primeira img.png" alt="Mulher com melasma e diagramas" style={{ width: '100%', display: 'block' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={16} /> Resultado Imediato</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={16} /> 100% Gratuito</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={16} /> Personalizado</span>
            </div>

            <button className="btn-secondary btn-animated" onClick={goToNextStep} style={{ marginBottom: '1rem' }}>
              Iniciar o diagnóstico gratuito! <ArrowRight size={20} />
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '2rem' }}>
              "Essas perguntas são usadas em todas as consultas da Dra Ana Vilella"
            </p>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              backgroundColor: '#fdf6f2', 
              padding: '0.75rem', 
              borderRadius: '12px',
              border: '1px solid #f2e3db',
              borderLeft: '5px solid #d99c51',
              width: '100%',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', marginRight: '0.75rem', flexShrink: 0 }}>
                <img src="/images/Captura de tela 2026-01-18 184112.png" alt="Mulher 1" loading="lazy" decoding="async" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid white', objectFit: 'cover', zIndex: 3 }} />
                <img src="/images/Captura de tela 2026-01-18 184127.png" alt="Mulher 2" loading="lazy" decoding="async" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid white', objectFit: 'cover', marginLeft: '-15px', zIndex: 2 }} />
                <img src="/images/Captura de tela 2026-01-18 184211.png" alt="Mulher 3" loading="lazy" decoding="async" style={{ width: '45px', height: '45px', borderRadius: '50%', border: '2px solid white', objectFit: 'cover', marginLeft: '-15px', zIndex: 1 }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>+12.500 diagnósticos realizados</div>
                <div style={{ fontSize: '0.8rem', color: '#4b5563' }}>Junte-se a milhares de mulheres</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep.type === 'question') {
      const q = QUESTIONS[currentStep.id];
      const isMultiple = currentStep.multiple;
      const currentAnswers = answers[currentStep.id] || (isMultiple ? [] : null);

      return (
        <div className="container slide-in">
          <h2 className="title" style={{ marginBottom: q.subtitle ? '0.5rem' : '2rem' }}>{q.question}</h2>
          
          {q.subtitle && (
            <p className="subtitle" style={{ marginBottom: '2rem' }}>{q.subtitle}</p>
          )}
          
          <div className={q.grid ? "options-grid" : "options-container"}>
            {q.options.map((option, index) => {
              const checked = isMultiple ? currentAnswers.includes(option) : selectedOption === option || currentAnswers === option;
              
              return (
                <div 
                  key={index} 
                  className={`option-card ${checked ? 'selected' : ''} ${q.grid ? 'grid-card' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {q.grid && (
                    <div className="card-image-wrap">
                      {q.images ? (
                        <img src={q.images[index]} alt={option} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : null}
                    </div>
                  )}
                  <div className="card-content-wrap">
                    <span className="option-label">{LABELS[index]}</span>
                    <span>{option}</span>
                    {isMultiple && (
                      <span className="checkbox-icon">
                        {checked ? <CheckSquare size={20} /> : <Square size={20} color="var(--text-light)" />}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {isMultiple && (
            <button 
              className="btn-primary fade-in" 
              onClick={goToNextStep} 
              disabled={currentAnswers.length === 0}
              style={{ marginTop: '1rem', opacity: currentAnswers.length > 0 ? 1 : 0.5 }}
            >
              Continuar <ArrowRight size={20} />
            </button>
          )}

          {q.support && (
            <div className="text-support fade-in">
              {q.support}
            </div>
          )}
        </div>
      );
    }

    if (currentStep.id === 'trans1') {
      return (
        <div className="container slide-in">
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p className="subtitle" style={{ textAlign: 'center', fontWeight: '500', color: 'var(--text-gray)' }}>
              Mais de 12.500 mulheres descobriram a causa raiz das manchas através desse diagnóstico.
            </p>

            <h2 className="title" style={{ color: '#ea580c', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              Ouça a mensagem da Dra Ana Vilella para você:
            </h2>
            
            <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto 2rem auto', aspectRatio: '9/16', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', boxShadow: 'var(--shadow-md)' }}>
               <VTurbPlayer videoId="69d574d195a1d0cd29f986b9" />
               <p style={{ textAlign: 'center', color: '#666', fontSize: '0.8rem', marginTop: '0.5rem', background: '#fff' }}>(Assista até o final para liberar o botão)</p>
            </div>

            <button className="btn-secondary fade-in" onClick={goToNextStep} style={{ marginTop: '1rem' }}>
                Continuar meu diagnóstico <ArrowRight size={20} />
            </button>
          </div>
        </div>
      );
    }

    if (currentStep.id === 'trans2') {
      return (
        <div className="container slide-in">
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 className="title" style={{ fontSize: '1.8rem', marginBottom: '1rem', textAlign: 'center' }}>
              O Protocolo Anti-Melasma da Dra Ana Vilella age na Causa Raiz das suas manchas!
            </h2>
            
            <p className="subtitle" style={{ marginBottom: '2rem', color: 'var(--text-dark)', textAlign: 'center' }}>
              Com apenas 5 minutos por dia você consegue fazer tranquilamente.
            </p>

            <h3 style={{ color: '#ea580c', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
              COMO FUNCIONA ESSE PROCESSO:
            </h3>

            <div className="fade-in" style={{ width: '100%', borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem', boxShadow: 'var(--shadow-md)' }}>
              <img src="/images/img cha.png" alt="Como funciona o processo" style={{ width: '100%', display: 'block' }} />
            </div>

            <button className="btn-secondary fade-in" onClick={goToNextStep} style={{ animationDelay: '0.3s' }}>
              Continuar o diagnóstico <ArrowRight size={20} />
            </button>
          </div>
        </div>
      );
    }

    if (currentStep.id === 'diagnostic') {
      return (
        <div className="container slide-in">
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, textAlign: 'center', color: '#111827', marginBottom: '2rem' }}>
              ⚠️ ATENÇÃO! Pelas suas respostas, seu Melasma está em <span style={{ color: '#ef4444' }}>Estado de ALERTA.</span>
            </h2>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}>
                <span>Nível</span>
                <span style={{ color: '#6b7280' }}>75%</span>
              </div>
              <div className="severity-bar-container">
                <div className="severity-segment" style={{ backgroundColor: '#86efac' }}></div>
                <div className="severity-segment" style={{ backgroundColor: '#fef08a' }}></div>
                <div className="severity-segment" style={{ backgroundColor: '#facc15' }}></div>
                <div className="severity-segment" style={{ backgroundColor: '#f97316' }}>
                  <div className="severity-dot"></div>
                </div>
                <div className="severity-segment" style={{ backgroundColor: '#ef4444' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                <span>Leve</span>
                <span>Moderado</span>
                <span>Alto</span>
                <span style={{ color: '#f97316' }}>Alerta</span>
                <span>Irreversível</span>
              </div>
            </div>

            <div style={{ fontSize: '1rem', color: '#374151', lineHeight: 1.6, marginBottom: '2rem' }}>
              <p style={{ fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
                ⚠️ A causa raiz do seu melasma está dentro de você.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                Por isso, mesmo usando protetor solar e tentando métodos apenas superficiais para clarear as manchas, você não consegue resultados definitivos.
              </p>
              <p style={{ marginBottom: '1rem' }}>
                A sua tirosinase está produzindo melanina de forma descontrolada. <strong>Você precisa começar por uma desintoxicação interna profunda</strong> que elimine essa inflamação, e depois aplicar soluções 100% naturais que reparam a pele sem criar um efeito rebote.
              </p>
              <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#111827' }}>
                💡 A Dra Ana Vilella criou um protocolo personalizado para tratar essa causa raiz de forma 100% natural, está pronta para começar?
              </p>
            </div>

            <button className="btn-primary btn-animated" onClick={goToNextStep} style={{ width: '100%', marginBottom: '1rem' }}>
              Começar meu protocolo anti-melasma
            </button>
          </div>
        </div>
      );
    }

    if (currentStep.id === 'loading_protocol') {
      return (
        <div className="container slide-in">
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            
            <div className="loader" style={{ marginBottom: '1.5rem', width: '50px', height: '50px', border: '5px solid #f3f4f6', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
              Gerando seu protocolo personalizado...
            </h2>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.95rem', marginBottom: '3rem' }}>
              Isso pode levar alguns segundos.
            </p>

            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', width: '100%' }}>
               <div style={{ display: 'flex', gap: '4px', marginBottom: '0.8rem', color: '#eab308' }}>
                 <Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/>
               </div>
               <img src="/images/antes e depois melasma 1.jpg" alt="Antes e depois real" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />
               <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1rem' }}>
                 "Eu passei os últimos 4 anos da minha vida escondendo meu rosto com base de alta cobertura. Gastei rios de dinheiro com cremes caros, séruns e até sessões de laser que doíam muito e só deixavam minha pele pior depois. Quando conheci o método da Dra. Ana, achei que seria só mais um, mas em 3 semanas a mancha escura na bochecha literalmente desapareceu de dentro pra fora. Eu chorei no espelho quando vi minha pele limpa de novo."
               </p>
               <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>
                 Márcia Fernandes, 42 anos.
               </div>
               <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                 Aluna do Protocolo Anti-Melasma
               </div>
            </div>

          </div>
        </div>
      );
    }



    if (currentStep.id === 'sales-page') {
      return (
        <div className="slide-in" style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
           <SalesPage />
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${currentStep.progress || 0}%` }}
        ></div>
      </div>
      
      {currentStepIndex > 0 && currentStepIndex < STEPS.length - 1 && (
        <div className="top-bar slide-in">
          <button className="back-btn" onClick={goToPrevStep} aria-label="Voltar">
            <ArrowLeft size={24} />
          </button>
        </div>
      )}
      
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        opacity: isTransitioning ? 0 : 1, 
        transition: 'opacity 0.15s ease-out',
        willChange: 'opacity',
        paddingTop: currentStep.id === 'sales-page' ? '0' : (currentStepIndex > 0 && currentStepIndex < STEPS.length - 1 ? '0' : '20px'),
        overflowX: 'hidden',
        width: '100%',
        margin: '0 auto'
      }}>
        {renderContent()}
      </main>
    </>
  );
}

export default App;
