'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BarChart3, Lightbulb } from 'lucide-react';
import { inflationRatesGermany, priceExamples, realWageData, inflationByCategory } from '@/data/inflationData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function EffectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const chartRef = useRef<any>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const priceGridRef = useRef<HTMLDivElement>(null);
  
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

  const chartOptions = {
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
          label: function(context: any) {
            return `${context.parsed.y}% Inflation`;
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
          callback: function(value: any) {
            return value + '%';
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

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const animateChart = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const originalData = inflationRatesGermany.map(item => item.rate);
    
    gsap.to({ progress: 0 }, {
      progress: 1,
      duration: 3,
      ease: 'power2.out',
      onUpdate: function() {
        const progress = this.targets()[0].progress;
        const newData = originalData.map((value, index) => {
          const pointProgress = Math.max(0, Math.min(1, (progress * originalData.length - index) / 1));
          return value * pointProgress;
        });
        setAnimatedData([...newData]);
      },
      onComplete: () => setIsAnimating(false)
    });
  };

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
                {realWageData.slice(-3).map((data, index) => (
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
                Bei {inflationRate}% Inflation verlieren €1.000 in 4 Jahren etwa{' '}
                <span className="font-bold text-red-400">
                  €{(1000 - (1000 / Math.pow(1 + inflationRate / 100, 4))).toFixed(0)}
                </span>{' '}
                ihrer Kaufkraft. Das entspricht einem realen Wert von nur noch{' '}
                <span className="font-bold text-yellow-400">
                  €{(1000 / Math.pow(1 + inflationRate / 100, 4)).toFixed(0)}
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
              {priceExamples.map((example, index) => {
                const newPrice = calculatePriceIncrease(example.price2020, inflationRate);
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
                          +{increase.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-blue-200">
                        <span className="text-sm">2020: </span>
                        <span className="font-semibold">€{example.price2020.toFixed(2)}</span>
                      </div>
                      <div className="text-white">
                        <span className="text-sm">2025: </span>
                        <span className="font-semibold text-red-400">€{newPrice.toFixed(2)}</span>
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
