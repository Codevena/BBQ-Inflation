'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import type { ChartOptions, TooltipItem } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BarChart3, Lightbulb, Info } from 'lucide-react';
// removed useAnimationOnScroll to avoid double triggering animations
import { inflationRatesGermany, priceExamples, realWageData } from '@/data/inflationData';
import { DATA_STAND_SHORT } from '@/data/constants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EffectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  // chartRef removed (unused)
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const priceGridRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);
  const animatingRef = useRef(false);
  
  const [inflationRate, setInflationRate] = useState(2.3);
  const [animatedData, setAnimatedData] = useState(inflationRatesGermany.map(() => 0));
  const [isAnimating, setIsAnimating] = useState(false);

  const chartData = {
    labels: inflationRatesGermany.map(item => item.year.toString()),
    datasets: [
      {
        label: 'Inflationsrate (%)',
        data: animatedData,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#EF4444',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
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
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            const y = typeof context.parsed.y === 'number' ? context.parsed.y : Number(context.parsed.y);
            return `${y}% Inflation`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value: number | string) {
            return `${value}%`;
          }
        },
        beginAtZero: true,
        max: 8,
      }
    },
    animation: {
      duration: 0, // We handle animation manually
    }
  };

  const calculatePriceIncrease = (basePrice: number, rate: number, years: number = 4) => {
    return basePrice * Math.pow(1 + rate / 100, years);
  };

  // Animate chart on first reveal (requestAnimationFrame for robustness)
  const animateChart = useCallback(() => {
    if (isAnimating) return;
    if (hasAnimatedRef.current || animatingRef.current) return;
    animatingRef.current = true;
    setIsAnimating(true);
    const originalData = inflationRatesGermany.map(item => item.rate);
    const n = originalData.length;
    const start = performance.now();
    const duration = 1600; // ms
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 2); // easeOutQuad
      const prog = eased * (n - 1);
      const idx = Math.floor(prog);
      const frac = prog - idx;
      const newData = originalData.map((v, i) => {
        if (i < idx) return v;
        if (i === idx) return v * Math.min(1, Math.max(0, frac));
        return 0;
      });
      setAnimatedData(newData);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setIsAnimating(false);
        rafRef.current = null;
        hasAnimatedRef.current = true;
        animatingRef.current = false;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [isAnimating]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([titleRef.current, sliderRef.current, priceGridRef.current], {
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
      .to(sliderRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5')
      .to(priceGridRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.3');

      // Datenbefüllung wird durch IntersectionObserver ausgelöst

    }, sectionRef);

    return () => ctx.revert();
  }, [animateChart]);

  // Sichtbarkeitsgesteuert: setzt Daten sobald der Abschnitt im Viewport ist
  // Removed secondary on-scroll trigger to avoid double animation

  // Cleanup any pending rAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section 
      id="effects" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-red-900 py-20"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
          >
            Auswirkungen der
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400 block">
              Inflation
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
          
          {/* Left Column - Chart */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="relative h-80">
                <Line data={chartData} options={chartOptions} />
              </div>
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Inflationsentwicklung Deutschland
                </h3>
                <p className="text-sm text-blue-200">
                  2019-2025 (aktuelle Daten)
                </p>
                <p className="text-xs text-blue-300 mt-1 flex items-center justify-center gap-2">
                  <span>
                    Verbraucherpreisindex (VPI), jährliche Veränderungsrate. Stand: {DATA_STAND_SHORT}. Quelle: Statistisches Bundesamt (Destatis).
                  </span>
                  <span title="VPI: Warenkorb (~650 Güter), Laspeyres‑Idee, Basisjahr; monatliche Erhebung durch Destatis.">
                    <Info size={14} className="text-blue-300" />
                  </span>
                </p>
              </div>
            </div>

            {/* Interactive Slider */}
            <div ref={sliderRef} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">
                Inflationsrate simulieren
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Aktuelle Rate:</span>
                  <span className="text-2xl font-bold text-red-400">{inflationRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-blue-200">
                  <span>0%</span>
                  <span>5%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>

            {/* Reallohn-Entwicklung */}
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-purple-400" />
                Reallohn-Entwicklung Deutschland
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {realWageData.slice(-3).map((data) => (
                  <div key={data.year} className="text-center">
                    <div className="text-sm text-purple-200">{data.year}</div>
                    <div className={`text-lg font-bold ${data.realGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {data.realGrowth > 0 ? '+' : ''}{data.realGrowth}%
                    </div>
                    <div className="text-xs text-purple-300">Real</div>
                  </div>
                ))}
              </div>
              <p className="text-purple-200 text-sm mt-3">
                Reallöhne = Nominallöhne minus Inflation. 2022-2023 sanken die Reallöhne stark.
              </p>
            </div>

            {/* Kaufkraftverlust */}
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Lightbulb size={20} className="text-yellow-400" />
                Kaufkraftverlust
              </h4>
              <p className="text-blue-200 text-sm leading-relaxed">
                Bei {inflationRate}% Inflation verlieren 1.000 € in 4 Jahren etwa{' '}
                <span className="font-bold text-red-400">
                  {(1000 - (1000 / Math.pow(1 + inflationRate / 100, 4))).toLocaleString('de-DE')} €
                </span>{' '}
                ihrer Kaufkraft. Das entspricht einem realen Wert von nur noch{' '}
                <span className="font-bold text-yellow-400">
                  {(1000 / Math.pow(1 + inflationRate / 100, 4)).toLocaleString('de-DE')} €
                </span>.
              </p>
            </div>
          </div>

          {/* Right Column - Price Examples */}
          <div ref={priceGridRef} className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6">
              Preisauswirkungen bei {inflationRate}% Inflation
            </h3>
            
            <div className="grid gap-4">
              {priceExamples.map((example) => {
                const newPrice = calculatePriceIncrease(example.price2020, inflationRate, 5);
                const increase = ((newPrice - example.price2020) / example.price2020) * 100;
                
                return (
                  <div
                    key={example.item}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white">{example.item}</h4>
                      <div className="text-right">
                        <div className="text-sm text-blue-200">2020 → 2025</div>
                        <div className={`text-lg font-bold ${increase > 30 ? 'text-red-400' : increase > 15 ? 'text-yellow-400' : 'text-green-400'}`}>
                          +{increase.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
              </div>
            </div>

            {/* Hinweis entfernt: keine Tooltips/Badges für Sonderphänomene */}
          </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-blue-200">
                        <span className="text-sm">2020: </span>
                        <span className="font-semibold">{example.price2020.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                      </div>
                      <div className="text-white">
                        <span className="text-sm">2025: </span>
                        <span className="font-semibold text-red-400">{newPrice.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4 bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          increase > 30 ? 'bg-red-400' : increase > 15 ? 'bg-yellow-400' : 'bg-green-400'
                        }`}
                        style={{ width: `${Math.min(100, increase * 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
