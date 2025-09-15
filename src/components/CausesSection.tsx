'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { Chart as ChartType, ChartData, ChartOptions, TooltipItem, ChartEvent, ActiveElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { inflationCauses } from '@/data/inflationData';
import { useAnimationOnScroll } from '@/lib/hooks';
import { Search, Globe, Brain, DollarSign, Activity } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CausesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);
  const chartRef = useRef<ChartType<'doughnut'> | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);

  const [animatedData, setAnimatedData] = useState(inflationCauses.map(() => 0));
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData: ChartData<'doughnut', number[], string> = {
    labels: inflationCauses.map(cause => cause.category),
    datasets: [
      {
        data: animatedData,
        backgroundColor: inflationCauses.map(cause => cause.color),
        borderColor: inflationCauses.map(cause => cause.color),
        borderWidth: 2,
        hoverBorderWidth: 4,
        hoverOffset: 10,
      },
    ],
  };

  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: TooltipItem<'doughnut'>) {
            const cause = inflationCauses[context.dataIndex];
            return [
              `${cause.category}: ${cause.percentage}%`,
              cause.description
            ];
          }
        }
      }
    },
    onHover: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        setHoveredIndex(elements[0].index);
      } else {
        setHoveredIndex(null);
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([titleRef.current, descriptionRef.current, chartContainerRef.current, legendRef.current], {
        opacity: 0,
        y: 50
      });

      // Main animation timeline - optimized for better performance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          onEnter: () => animateChart(),
        }
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      })
      .to(descriptionRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5')
      .to(chartContainerRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.3')
      .to(legendRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5');

      // IntersectionObserver unten setzt die Daten bei Sichtbarkeit

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const animateChart = () => {
    const originalData = inflationCauses.map(cause => cause.percentage);
    const start = performance.now();
    const duration = 2400; // noch langsamerer Aufbau
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 2);
      setAnimatedData(originalData.map(v => v * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  // Sichtbarkeitsgesteuert befüllen
  useAnimationOnScroll(sectionRef, () => animateChart(), 0.3);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section 
      id="causes" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 py-20"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Explanations row above chart + legend */}
        <div className="mb-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h4 className="font-semibold text-blue-300 mb-4 flex items-center gap-2">
              <Search size={18} className="text-blue-400" />
              Inflationsarten – kurz erklärt
            </h4>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-2" />
                <div className="text-sm leading-relaxed">
                  <strong className="text-white">Nachfrageinflation:</strong>
                  <span className="text-blue-200"> Gesamtnachfrage {'>'} Angebot (z. B. Nachholeffekte).</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-400 mt-2" />
                <div className="text-sm leading-relaxed">
                  <strong className="text-white">Angebots-/Kosteninflation:</strong>
                  <span className="text-blue-200"> Kosten steigen (Energie, Löhne, Lieferketten).</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-violet-400 mt-2" />
                <div className="text-sm leading-relaxed">
                  <strong className="text-white">Importierte Inflation:</strong>
                  <span className="text-blue-200"> Wechselkurs und Weltmarktpreise verteuern Importe.</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2" />
                <div className="text-sm leading-relaxed">
                  <strong className="text-white">Lohn‑Preis‑Spirale:</strong>
                  <span className="text-blue-200"> Löhne ↑ → Preise ↑ → erneute Lohnforderungen.</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-sky-400 mt-2" />
                <div className="text-sm leading-relaxed">
                  <strong className="text-white">Tempo:</strong>
                  <span className="text-blue-200"> schleichend (0–3%), trabend (3–10%), galoppierend ({'>'}10%), Hyper.</span>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-fuchsia-400 mt-2" />
                <div className="text-sm leading-relaxed">
                  <strong className="text-white">Gegenstücke:</strong>
                  <span className="text-blue-200"> Deflation (Preise ↓) und Stagflation (hohe Inflation + schwaches Wachstum).</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h2 
              ref={titleRef}
              className="text-4xl md:text-5xl font-bold text-white leading-tight"
            >
              Was verursacht
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 block">
                Inflation?
              </span>
            </h2>
            
            <p
              ref={descriptionRef}
              className="text-xl text-blue-200 leading-relaxed"
            >
              Inflation entsteht durch komplexe wirtschaftliche Mechanismen. Ökonomen unterscheiden
              zwischen <strong className="text-white">Nachfrageinflation</strong> (zu viel Geld jagt zu wenige Güter)
              und <strong className="text-white">Angebotsinflation</strong> (Produktionskosten steigen).
              Die aktuelle Inflation wurde hauptsächlich durch externe Schocks ausgelöst:
            </p>

            {/* Hinweis: Inflationsarten oben als horizontale Strips ausgelagert */}

            {/* Interactive Legend */}
            <div ref={legendRef} className="space-y-4">
              {inflationCauses.map((cause, index) => (
                <div
                  key={cause.category}
                  className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                    hoveredIndex === index
                      ? 'bg-white/10 border-white/30 scale-105'
                      : 'bg-white/5 border-white/10 hover:bg-white/8'
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cause.color }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white">{cause.category}</h3>
                        <span className="text-lg font-bold" style={{ color: cause.color }}>
                          {cause.percentage}%
                        </span>
                      </div>
                      <p className="text-sm text-blue-200">{cause.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Chart */}
          <div ref={chartContainerRef} className="relative">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="relative h-96">
                <Doughnut 
                  ref={chartRef}
                  data={chartData} 
                  options={chartOptions}
                />
                
                {/* Center Label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">Inflation</div>
                    <div className="text-sm text-blue-200">Ursachen</div>
                  </div>
                </div>
              </div>
              
              {/* Chart Title */}
              <div className="text-center mt-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Verteilung der Inflationsursachen
                </h3>
                <p className="text-sm text-blue-200">
                  Hover über die Segmente für Details
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/20 rounded-full animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-500/20 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Treiber & Mechanismen */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={18} className="text-blue-400" />
              <h4 className="text-white font-semibold">Geld & Kredit (MV=PY)</h4>
            </div>
            <p className="text-blue-200 text-sm">Mehr Geld/Kredit oder höhere Umlaufgeschwindigkeit (V) bei gleichbleibender Leistung (Y) → Preisdruck (P).</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className="text-blue-400" />
              <h4 className="text-white font-semibold">Fiskalische Impulse</h4>
            </div>
            <p className="text-blue-200 text-sm">Staatsausgaben, Transfers, Steuern (z. B. MWSt‑Änderungen) bewegen Nachfrage und Preisniveau.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Globe size={18} className="text-blue-400" />
              <h4 className="text-white font-semibold">Wechselkurse & Globalisierung</h4>
            </div>
            <p className="text-blue-200 text-sm">Importpreise, Lieferketten, Handelskosten; schwächerer Euro verteuert Importe.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Brain size={18} className="text-blue-400" />
              <h4 className="text-white font-semibold">Erwartungen</h4>
            </div>
            <p className="text-blue-200 text-sm">Kommunikation und Ziele verankern Preissetzung und Lohnrunden; Glaubwürdigkeit senkt Volatilität.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
