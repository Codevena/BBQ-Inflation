'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import type { ChartOptions, TooltipItem } from 'chart.js';
import { Line } from 'react-chartjs-2';
import CountUpNumber from './CountUpNumber';
import { Building2, TrendingUp, TrendingDown, Target, LineChart, CheckCircle, Settings, ArrowUpDown, Clock, PiggyBank, Shield, DollarSign, AlertTriangle } from 'lucide-react';
import { useAnimationOnScroll } from '@/lib/hooks';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ecbRateHistory = [
  { year: '2019', rate: 0.0, event: 'Einlagefazilität negativ (vereinfachte Darstellung)' },
  { year: '2020', rate: 0.0, event: 'Corona-Krise' },
  { year: '2021', rate: 0.0, event: 'Anhaltend sehr niedrig' },
  { year: '2022 Q1', rate: 0.0, event: 'Vor der ersten Zinserhöhung' },
  { year: '2022 Q3', rate: 0.75, event: 'Erste Anhebung (Einlagesatz)' },
  { year: '2022 Q4', rate: 2.0, event: 'Schnelle Straffung' },
  { year: '2023 Q3', rate: 4.0, event: 'Peak Einlagesatz' },
  { year: '2024', rate: 3.75, event: 'Beginn der Senkungen' },
  { year: '2025', rate: 2.0, event: 'Derzeitiger Stand (11.09.2025)' }
];

export default function ECBPolicySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const simulatorRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);
  const animatingRef = useRef(false);

  const [selectedRate, setSelectedRate] = useState(2.0);
  const [showImpact, setShowImpact] = useState(false);
  const [animatedData, setAnimatedData] = useState(ecbRateHistory.map(() => 0));
  const [isAnimating, setIsAnimating] = useState(false);

  const animateChart = useCallback(() => {
    if (hasAnimatedRef.current || animatingRef.current) return;
    animatingRef.current = true;
    setIsAnimating(true);
    const originalData = ecbRateHistory.map(item => item.rate);
    const start = performance.now();
    const duration = 1200;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 2);
      setAnimatedData(originalData.map(v => v * eased));
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
  }, []);

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

      // Kein Fallback nötig – IntersectionObserver setzt Daten bei Sichtbarkeit

    }, sectionRef);

    return () => ctx.revert();
  }, [animateChart]);

  useAnimationOnScroll(sectionRef, () => animateChart(), 0.3);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  // Setzt Daten robust, sobald der Bereich sichtbar ist
  useAnimationOnScroll(sectionRef, () => animateChart(), 0.3);

  const chartData = {
    labels: ecbRateHistory.map(item => item.year),
    datasets: [
      {
        label: 'Einlagefazilität (operativer Leitzins) (%)',
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
          afterBody: function(context: TooltipItem<'line'>[]) {
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
          callback: function(value: number | string) {
            const n = typeof value === 'string' ? Number(value) : value;
            return n.toLocaleString('de-DE') + '%';
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
              Einlagefazilität (operativer Leitzins) 2019-2025
            </h3>
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
            <p className="text-center text-blue-200 mt-4">
              Von Nullzinspolitik zur Inflationsbekämpfung
            </p>
                <p className="text-center text-blue-300 mt-1 text-xs">
                  Operativer Leitzins = Einlagefazilität. Stand: 11.09.2025. Quelle: EZB/Tagesschau.
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
                    {Number(selectedRate).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                  </div>
                  <div className="text-blue-200 mb-4">Operativer Leitzins (Einlagefazilität)</div>
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
                      {(selectedRate + 1.5).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-blue-200">Sparzinsen</span>
                    <span className={`font-bold ${getImpactColor(selectedRate)}`}>
                      {(selectedRate * 0.8).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
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
                  <CountUpNumber endValue={2.0} decimals={1} suffix="%" duration={2200} />
                </div>
                <div className="text-green-200">Einlagefazilität aktuell</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">
                  <CountUpNumber endValue={2.2} decimals={1} suffix="%" duration={2400} />
                </div>
                <div className="text-green-200">Inflation 2025</div>
              </div>
            </div>
            <p className="text-center text-green-100 mt-6 text-xs">
              Zinsstände: MRO 2,65% · Spitzenrefinanzierung 2,90% · Stand: 11.09.2025 · Quelle: EZB/Tagesschau
            </p>
          </div>
        </div>

        {/* EZB Steuerungsinstrumente */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4 flex items-center justify-center gap-3">
              <Settings size={36} className="text-blue-400" />
              EZB-Steuerungsinstrumente
            </h3>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Die vier Hauptwerkzeuge der Europäischen Zentralbank zur Geldmengensteuerung
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

            {/* Hauptrefinanzierungsfazilität */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/30">
              <div className="text-center mb-6">
                <Building2 size={48} className="text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-blue-400">Hauptrefinanzierungsfazilität</h4>
                <p className="text-blue-200 text-sm">Das wichtigste Instrument</p>
              </div>

              <div className="space-y-3 text-blue-200">
                <div className="flex items-start gap-3">
                  <ArrowUpDown size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Kredite gegen Sicherheiten</div>
                    <div className="text-sm">EZB verleiht Geld an Banken gegen Wertpapiere</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Wöchentliche Geschäfte</div>
                    <div className="text-sm">Meist 1 Woche Laufzeit (Wertpapierpensionsgeschäfte)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Leitzins-Steuerung</div>
                    <div className="text-sm">Bestimmt den Hauptrefinanzierungssatz</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Spitzenrefinanzierungsfazilität */}
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-8 border border-orange-400/30">
              <div className="text-center mb-6">
                <Clock size={48} className="text-orange-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-orange-400">Spitzenrefinanzierungsfazilität</h4>
                <p className="text-orange-200 text-sm">Notfall-Liquidität</p>
              </div>

              <div className="space-y-3 text-orange-200">
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Über-Nacht-Kredite</div>
                    <div className="text-sm">Kurzfristige Liquidität für Banken</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp size={16} className="text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Höherer Zinssatz</div>
                    <div className="text-sm">Spitzenrefinanzierungssatz (SRS) über Leitzins</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={16} className="text-orange-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Notfall-Instrument</div>
                    <div className="text-sm">Bei kurzfristigen Liquiditätsengpässen</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Einlagefazilität */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
              <div className="text-center mb-6">
                <PiggyBank size={48} className="text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-green-400">Einlagefazilität</h4>
                <p className="text-green-200 text-sm">Geld parken bei der EZB</p>
              </div>

              <div className="space-y-3 text-green-200">
                <div className="flex items-start gap-3">
                  <PiggyBank size={16} className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Überschüssige Liquidität</div>
                    <div className="text-sm">Banken legen nicht benötigtes Geld an</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Über-Nacht-Anlage</div>
                    <div className="text-sm">Kurzfristige Geldanlage bei der EZB</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign size={16} className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Einlagesatz</div>
                    <div className="text-sm">Je nach Phase positiv oder negativ; aktuell positiv (EZB vergütet Einlagen).</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mindestreservepolitik */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
              <div className="text-center mb-6">
                <Shield size={48} className="text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-purple-400">Mindestreservepolitik</h4>
                <p className="text-purple-200 text-sm">Pflichtreserven der Banken</p>
              </div>

              <div className="space-y-3 text-purple-200">
                <div className="flex items-start gap-3">
                  <Shield size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Pflichtreserve</div>
                    <div className="text-sm">Banken müssen Anteil bei EZB hinterlegen</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Aktuell 1%</div>
                    <div className="text-sm">1% der Kundeneinlagen zinslos bei EZB</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingDown size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Geldmenge reduzieren</div>
                    <div className="text-sm">Hohe Reserve = weniger Geld im Markt</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mechanismus-Erklärung */}
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-400/30">
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <Target size={28} className="text-cyan-400" />
                Wie die EZB die Geldmenge steuert
              </h4>
              <p className="text-xl text-cyan-100 max-w-4xl mx-auto">
                Alle Instrumente zielen darauf ab, die Geldmenge im Wirtschaftskreislauf zu kontrollieren
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center p-6 bg-green-500/10 rounded-xl border border-green-400/30">
                <TrendingUp size={32} className="text-green-400 mx-auto mb-3" />
                <h5 className="text-lg font-bold text-white mb-2">Mehr Geld → Höhere Inflation</h5>
                <div className="text-green-200 text-sm space-y-1">
                  <p>• Niedrige Zinsen</p>
                  <p>• Mehr Kredite an Banken</p>
                  <p>• Mehr Investitionen & Konsum</p>
                  <p>• Preise steigen</p>
                </div>
              </div>

              <div className="text-center p-6 bg-red-500/10 rounded-xl border border-red-400/30">
                <TrendingDown size={32} className="text-red-400 mx-auto mb-3" />
                <h5 className="text-lg font-bold text-white mb-2">Weniger Geld → Niedrigere Inflation</h5>
                <div className="text-red-200 text-sm space-y-1">
                  <p>• Hohe Zinsen</p>
                  <p>• Weniger Kredite an Banken</p>
                  <p>• Weniger Investitionen & Konsum</p>
                  <p>• Preise stabilisieren sich</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
