'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import CountUpNumber from './CountUpNumber';
import { Building2, TrendingUp, TrendingDown, Target, LineChart, CheckCircle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ecbRateHistory = [
  { year: '2019', rate: 0.0, event: 'Nullzinspolitik' },
  { year: '2020', rate: 0.0, event: 'Corona-Krise' },
  { year: '2021', rate: 0.0, event: 'Wirtschaftserholung' },
  { year: '2022 Q1', rate: 0.0, event: 'Ukraine-Krieg beginnt' },
  { year: '2022 Q3', rate: 1.25, event: 'Erste Zinserhöhung' },
  { year: '2022 Q4', rate: 2.5, event: 'Aggressive Erhöhung' },
  { year: '2023 Q2', rate: 4.0, event: 'Weitere Straffung' },
  { year: '2024', rate: 4.5, event: 'Höchststand erreicht' },
  { year: '2025', rate: 3.75, event: 'Normalisierung' }
];

export default function ECBPolicySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const simulatorRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const [selectedRate, setSelectedRate] = useState(2.0);
  const [showImpact, setShowImpact] = useState(false);
  const [animatedData, setAnimatedData] = useState(ecbRateHistory.map(() => 0));
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([titleRef.current, simulatorRef.current, timelineRef.current, chartRef.current], {
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
      .to(simulatorRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5')
      .to(chartRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.3')
      .to(timelineRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.5');

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const animateChart = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const originalData = ecbRateHistory.map(item => item.rate);

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

  const chartData = {
    labels: ecbRateHistory.map(item => item.year),
    datasets: [
      {
        label: 'EZB Leitzins (%)',
        data: animatedData,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#3B82F6',
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
          afterBody: function(context: any) {
            const index = context[0].dataIndex;
            return ecbRateHistory[index].event;
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
        max: 5,
      }
    },
    animation: {
      duration: 0, // We handle animation manually
    }
  };

  const getImpactColor = (rate: number) => {
    if (rate <= 1) return 'text-green-400';
    if (rate <= 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getImpactDescription = (rate: number) => {
    if (rate <= 1) return 'Niedrige Zinsen fördern Wirtschaftswachstum';
    if (rate <= 3) return 'Moderate Zinsen für ausgewogene Wirtschaft';
    return 'Hohe Zinsen bremsen Inflation, aber auch Wachstum';
  };

  return (
    <section 
      id="ecb-policy" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900 py-20"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 flex items-center justify-center gap-4"
          >
            <Building2 size={48} className="text-blue-400" />
            <div>
              EZB-Geldpolitik
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 block">
                Inflation steuern
              </span>
            </div>
          </h2>
          <p className="text-xl text-blue-200 max-w-4xl mx-auto">
            Wie die Europäische Zentralbank mit dem Leitzins die Inflation kontrolliert
          </p>
        </div>

        {/* EZB Rate History Chart */}
        <div ref={chartRef} className="mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
              <LineChart size={28} className="text-blue-400" />
              EZB-Leitzins 2019-2025
            </h3>
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
            <p className="text-center text-blue-200 mt-4">
              Von Nullzinspolitik zur Inflationsbekämpfung
            </p>
          </div>
        </div>

        {/* Interactive Rate Simulator */}
        <div ref={simulatorRef} className="mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
              <Target size={28} className="text-cyan-400" />
              Leitzins-Simulator
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Slider Control */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getImpactColor(selectedRate)}`}>
                    {selectedRate.toFixed(1)}%
                  </div>
                  <div className="text-blue-200 mb-4">EZB Leitzins</div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={selectedRate}
                  onChange={(e) => {
                    setSelectedRate(parseFloat(e.target.value));
                    setShowImpact(true);
                  }}
                  className="w-full h-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                />

                <div className="flex justify-between text-sm text-blue-200">
                  <span>0% (Nullzins)</span>
                  <span>2,5% (Normal)</span>
                  <span>5% (Hoch)</span>
                </div>
              </div>

              {/* Impact Display */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-white mb-4">Auswirkungen:</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-blue-200">Kreditzinsen</span>
                    <span className={`font-bold ${getImpactColor(selectedRate)}`}>
                      {(selectedRate + 1.5).toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-blue-200">Sparzinsen</span>
                    <span className={`font-bold ${getImpactColor(selectedRate)}`}>
                      {(selectedRate * 0.8).toFixed(1)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-blue-200">Wirtschaftsimpuls</span>
                    <span className={`font-bold ${selectedRate <= 2 ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedRate <= 2 ? 'Fördernd' : 'Bremsend'}
                    </span>
                  </div>
                </div>

                {showImpact && (
                  <div className="mt-4 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                    <p className="text-blue-100 text-sm">
                      {getImpactDescription(selectedRate)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Policy Mechanism */}
        <div ref={timelineRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* High Inflation Response */}
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border border-red-400/30">
            <div className="text-center mb-6">
              <TrendingUp size={48} className="text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-400">Inflation zu hoch</h3>
              <p className="text-red-200 text-sm">&gt; 2% Ziel der EZB</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <div className="font-bold text-white">Leitzins erhöhen</div>
                  <div className="text-red-200 text-sm">Geld wird teurer</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <div className="font-bold text-white">Kredite teurer</div>
                  <div className="text-red-200 text-sm">Weniger Investitionen</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <div className="font-bold text-white">Nachfrage sinkt</div>
                  <div className="text-red-200 text-sm">Preise stabilisieren sich</div>
                </div>
              </div>
            </div>
          </div>

          {/* Low Inflation Response */}
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/30">
            <div className="text-center mb-6">
              <TrendingDown size={48} className="text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-400">Inflation zu niedrig</h3>
              <p className="text-blue-200 text-sm">&lt; 2% Ziel der EZB</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <div className="font-bold text-white">Leitzins senken</div>
                  <div className="text-blue-200 text-sm">Geld wird billiger</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <div className="font-bold text-white">Kredite billiger</div>
                  <div className="text-blue-200 text-sm">Mehr Investitionen</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <div className="font-bold text-white">Nachfrage steigt</div>
                  <div className="text-blue-200 text-sm">Preise steigen moderat</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Story */}
        <div className="mt-16 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <CheckCircle size={24} className="text-green-400" />
              Erfolgsgeschichte 2022-2025
            </h3>
            <p className="text-xl text-green-100 mb-6">
              EZB-Strategie funktioniert: Inflation von 6,9% auf 2,2% gesenkt
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">
                  <CountUpNumber endValue={6.9} decimals={1} suffix="%" duration={2000} />
                </div>
                <div className="text-green-200">Inflation 2022</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  <CountUpNumber endValue={4.5} decimals={1} suffix="%" duration={2200} />
                </div>
                <div className="text-green-200">Leitzins heute</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  <CountUpNumber endValue={2.2} decimals={1} suffix="%" duration={2400} />
                </div>
                <div className="text-green-200">Inflation 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
