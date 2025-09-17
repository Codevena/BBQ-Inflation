'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { inflationRatesGermany, inflationCauses, historicalEvents, priceExamples, inflationByCategory, realWageData } from '@/data/inflationData';
import { DATA_STAND_SHORT } from '@/data/constants';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { AnimatePresence, motion } from 'framer-motion';
import {
  TrendingUp,
  Lightbulb,
  BarChart3,
  Target,
  Scale,
  Search,
  Banknote,
  Briefcase,
  Building2,
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingDown,
  ChevronUp,
  ChevronDown,
  Flag,
  AlertTriangle,
  RefreshCw,
  Brain,
  FileText,
  ThumbsUp,

  Calendar,
  Hash,
  Settings,
  ArrowUpDown,
  PiggyBank,
  Shield,
  Clock,
  LineChart
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const slides = [
  'title',
  'roadmap',
  'definition',
  'statistics',
  'causes-intro',
  'causes-chart',
  'effects-intro',
  'effects-prices',
  'measurement-intro',
  'measurement-categories',
  'ecb-policy',
  'ecb-instruments',
  'ecb-mechanism',
  'history-intro',
  'history-timeline',
  'key-takeaways',
  'thanks'
];

export default function PresentationMode() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const roadmapRefs = useRef<Array<HTMLDivElement | null>>([null, null, null]);
  // Statistics slide animated data
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [statsData, setStatsData] = useState<number[]>(inflationRatesGermany.map(() => 0));
  const statsRaf = useRef<number | null>(null);
  // ECB curve (presentation)
  const ecbYears = useMemo(() => ['2019','2020','2021','2022 Q1','2022 Q3','2022 Q4','2023 Q3','2024','2025'], []);
  const ecbRates = useMemo(() => [-0.5,-0.5,-0.5,-0.5,0.75,2.0,4.0,3.75,2.0], []);
  const [ecbAnimated, setEcbAnimated] = useState(false);
  const [ecbData, setEcbData] = useState<number[]>(ecbRates.map(() => 0));
  const ecbRaf = useRef<number | null>(null);
  const formatHugePercent = (rate: number) => {
    const r = Number(rate) || 0;
    const fmt = (v: number) => v.toLocaleString('de-DE', { maximumFractionDigits: 1 });
    if (r >= 1e15) return `${fmt(r/1e15)} Billiarden %`;
    if (r >= 1e12) return `${fmt(r/1e12)} Billionen %`;
    if (r >= 1e9)  return `${fmt(r/1e9)} Milliarden %`;
    if (r >= 1e6)  return `${fmt(r/1e6)} Millionen %`;
    return `${r.toLocaleString('de-DE')}%`;
  };

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          setCurrentSlide(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentSlide(slides.length - 1);
          break;

        case 'Escape':
          e.preventDefault();
          window.location.href = '/';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Auto-highlight roadmap cards sequentially (mimic hover glow; no mouse needed)
  useEffect(() => {
    if (slides[currentSlide] !== 'roadmap') return;
    const cards: Array<HTMLDivElement> = roadmapRefs.current.filter((c): c is HTMLDivElement => Boolean(c));
    if (!cards || cards.length === 0) return;
    const adds: number[] = [];
    const removes: number[] = [];
    const glowOn = (el: HTMLDivElement) => {
      el.classList.add('bg-white/10','scale-[1.02]','ring-1','ring-cyan-400/30');
    };
    const glowOff = (el: HTMLDivElement) => {
      el.classList.remove('bg-white/10','scale-[1.02]','ring-1','ring-cyan-400/30');
    };
    cards.forEach((el, idx) => {
      const addId = window.setTimeout(() => {
        glowOn(el);
        const remId = window.setTimeout(() => glowOff(el), 700);
        removes.push(remId);
      }, idx * 900);
      adds.push(addId);
    });
    return () => {
      adds.forEach(id => window.clearTimeout(id));
      removes.forEach(id => window.clearTimeout(id));
      cards.forEach(glowOff);
    };
  }, [currentSlide]);

  // Animate statistics curve (trailing reveal) when slide becomes active
  useEffect(() => {
    if (slides[currentSlide] !== 'statistics' || statsAnimated) return;
    const original = inflationRatesGermany.map(i => i.rate);
    const n = original.length;
    const start = performance.now();
    const duration = 1500;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 2);
      const prog = eased * (n - 1);
      const idx = Math.floor(prog);
      const frac = prog - idx;
      const data = original.map((v, i) => {
        if (i < idx) return v;
        if (i === idx) return v * Math.min(1, Math.max(0, frac));
        return 0;
      });
      setStatsData(data);
      if (t < 1) {
        statsRaf.current = requestAnimationFrame(step);
      } else {
        setStatsAnimated(true);
        statsRaf.current = null;
      }
    };
    statsRaf.current = requestAnimationFrame(step);
    return () => { if (statsRaf.current) cancelAnimationFrame(statsRaf.current); };
  }, [currentSlide, statsAnimated]);

  // Animate ECB curve on policy slide
  useEffect(() => {
    if (slides[currentSlide] !== 'ecb-policy' || ecbAnimated) return;
    const n = ecbRates.length;
    const start = performance.now();
    const duration = 1800;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 2);
      // Use n steps so the last point animates progressively
      const prog = eased * n;
      const idx = Math.min(n - 1, Math.floor(prog));
      const frac = Math.min(1, Math.max(0, prog - idx));
      const data = ecbRates.map((v, i) => {
        if (i < idx) return v;
        if (i === idx) return v * frac;
        return 0;
      });
      setEcbData(data);
      if (t < 1) {
        ecbRaf.current = requestAnimationFrame(step);
      } else {
        // finalize exact values so last point doesn't appear truncated
        setEcbData(ecbRates);
        setEcbAnimated(true);
        ecbRaf.current = null;
      }
    };
    ecbRaf.current = requestAnimationFrame(step);
    return () => { if (ecbRaf.current) cancelAnimationFrame(ecbRaf.current); };
  }, [currentSlide, ecbAnimated, ecbRates]);

  const easeOutSmooth: [number, number, number, number] = [0.16, 1, 0.3, 1];
  const easeInOutSmooth: [number, number, number, number] = [0.45, 0, 0.55, 1];
  const fadeUpVariant = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { delay, duration: 0.45, ease: easeOutSmooth } }
  });

  const renderSlide = () => {
    const slideType = slides[currentSlide];

    switch (slideType) {
      case 'title':
        return (
          <div className="text-center space-y-12">
            <motion.h1
              className="text-6xl font-bold text-white flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutSmooth } }}
            >
              <TrendingUp size={64} className="text-cyan-400" />
              Inflation verstehen
            </motion.h1>
            <motion.p
              className="text-2xl text-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.45, ease: easeOutSmooth } }}
            >
              Ursachen, Auswirkungen und Geschichte
            </motion.p>
            <div className="grid grid-cols-4 gap-8">
              {[
                { value: '6.9%', label: 'Deutschland 2022', color: 'text-red-400' },
                { value: '2.0%', label: 'EZB Ziel', color: 'text-yellow-400' },
                { value: '2.2%', label: 'Deutschland 2024', color: 'text-green-400' },
                { value: '+1.6%', label: 'Reallöhne 2024', color: 'text-green-400' }
              ].map((item, idx) => (
                <motion.div key={item.label} className="bg-white/10 rounded-xl p-6" {...fadeUpVariant(0.25 + idx * 0.06)}>
                  <div className={`text-3xl font-bold ${item.color}`}>{item.value}</div>
                  <div className="text-blue-200">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'roadmap':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <FileText size={48} className="text-cyan-400" />
              Roadmap
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: '1. Grundlagen', icon: <BarChart3 size={24} className="text-cyan-300" />, items: ['Was ist Inflation?', 'Deutschland: Entwicklung'] },
                { title: '2. Ursachen & Auswirkungen', icon: <Search size={24} className="text-cyan-300" />, items: ['Nachfrage vs. Angebot', 'Reallöhne & Preise'] },
                { title: '3. EZB & Geschichte', icon: <Building2 size={24} className="text-cyan-300" />, items: ['EZB-Tools & Leitzins', 'Historische Episoden'] },
              ].map((block, i) => (
                <motion.div
                  key={i}
                  ref={(el) => { roadmapRefs.current[i] = el; }}
                  className="group relative bg-white/5 rounded-2xl p-6 border border-white/10 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:bg-white/10"
                  {...fadeUpVariant(0.2 + i * 0.1)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {block.icon}
                    <h2 className="text-xl font-bold text-white">{block.title}</h2>
                  </div>
                  <ul className="text-blue-200 text-sm space-y-2 text-left">
                    {block.items.map((it, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            <p className="text-sm text-blue-300 mt-6">
              Mehr Details im <Link href="/#glossary" className="underline decoration-dotted underline-offset-2 hover:text-blue-200">Glossar</Link>.
            </p>
          </div>
        );

      case 'definition':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <Lightbulb size={48} className="text-cyan-400" />
              Was ist Inflation?
            </h1>
            <motion.div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-12 border border-blue-400/30" {...fadeUpVariant(0.15)}>
              <p className="text-2xl text-blue-100 leading-relaxed mb-8">
                Inflation ist der <strong className="text-white">allgemeine Anstieg des Preisniveaus</strong> für
                Güter und Dienstleistungen in einer Volkswirtschaft über einen bestimmten Zeitraum.
              </p>
              <div className="grid grid-cols-3 gap-8 mt-12">
                <motion.div className="text-center" {...fadeUpVariant(0.25)}>
                  <BarChart3 size={48} className="text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Messung</h3>
                  <p className="text-blue-200">Verbraucherpreisindex (VPI)</p>
                </motion.div>
                <motion.div className="text-center" {...fadeUpVariant(0.32)}>
                  <Target size={48} className="text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Ziel</h3>
                  <p className="text-blue-200">2% jährlich (EZB)</p>
                </motion.div>
                <motion.div className="text-center" {...fadeUpVariant(0.39)}>
                  <Scale size={48} className="text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Balance</h3>
                  <p className="text-blue-200">Weder zu hoch noch zu niedrig</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        );

      case 'statistics':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <BarChart3 size={48} className="text-cyan-400" />
              Deutschland: Inflationsentwicklung
            </h1>
            <motion.div className="bg-white/5 rounded-2xl p-8 mb-8" {...fadeUpVariant(0.1)}>
              <div className="h-96">
                <Line
                  data={{
                    labels: inflationRatesGermany.map(item => item.year.toString()),
                    datasets: [{
                      label: 'Inflationsrate (%)',
                      data: statsData,
                      borderColor: '#EF4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      borderWidth: 4,
                      pointRadius: 8,
                      fill: true,
                      tension: 0.4,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { ticks: { color: 'white', font: { size: 16 } } },
                      y: { ticks: { color: 'white', font: { size: 16 } }, beginAtZero: true }
                    }
                  }}
                />
              </div>
              <p className="text-center text-blue-300 text-xs mt-4">
                Verbraucherpreisindex (VPI), jährliche Veränderungsrate. Stand: {DATA_STAND_SHORT}. Quelle: Statistisches Bundesamt (Destatis).
              </p>
            </motion.div>
            <motion.p className="text-xl text-blue-200" {...fadeUpVariant(0.25)}>
              <strong className="text-red-400">2022:</strong> Ukraine-Krieg führte zu Energiekrise → 6,9% Inflation
            </motion.p>
          </div>
        );

      case 'causes-intro':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <Search size={48} className="text-cyan-400" />
              Was verursacht Inflation?
            </h1>
            <div className="grid grid-cols-2 gap-12">
              <motion.div className="bg-red-500/20 rounded-2xl p-8 border border-red-400/30" {...fadeUpVariant(0.15)}>
                <h2 className="text-3xl font-bold text-red-400 mb-6">Nachfrageinflation</h2>
                <p className="text-xl text-red-100 mb-4">
                  &quot;Zu viel Geld jagt zu wenige Güter&quot;
                </p>
                <ul className="text-left text-red-200 space-y-2">
                  <li>• Post-Corona Nachholeffekte</li>
                  <li>• Niedrigzinspolitik</li>
                  <li>• Staatliche Konjunkturpakete</li>
                </ul>
              </motion.div>
              <motion.div className="bg-orange-500/20 rounded-2xl p-8 border border-orange-400/30" {...fadeUpVariant(0.22)}>
                <h2 className="text-3xl font-bold text-orange-400 mb-6">Angebotsinflation</h2>
                <p className="text-xl text-orange-100 mb-4">
                  &quot;Produktionskosten steigen&quot;
                </p>
                <ul className="text-left text-orange-200 space-y-2">
                  <li>• Lieferkettenprobleme</li>
                  <li>• Energiekrise (Ukraine-Krieg)</li>
                  <li>• Rohstoffknappheit</li>
                </ul>
              </motion.div>
            </div>
          </div>
        );

      case 'causes-chart':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <BarChart3 size={48} className="text-cyan-400" />
              Inflationsursachen im Detail
            </h1>
            <div className="grid grid-cols-2 gap-12 items-center">
              <div className="bg-white/5 rounded-2xl p-8">
                <div className="h-96">
                  <Doughnut
                    data={{
                      labels: inflationCauses.map(cause => cause.category),
                      datasets: [{
                        data: inflationCauses.map(cause => cause.percentage),
                        backgroundColor: inflationCauses.map(cause => cause.color),
                        borderWidth: 3,
                        borderColor: '#1e293b'
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: 'white',
                          bodyColor: 'white'
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-4">
                {inflationCauses.map((cause, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: cause.color }}
                      />
                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-white text-lg">{cause.category}</h3>
                        <p className="text-blue-200 text-sm">{cause.description}</p>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: cause.color }}>
                        {cause.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'effects-intro':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <Banknote size={48} className="text-cyan-400" />
              Auswirkungen der Inflation
            </h1>
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-red-500/20 rounded-2xl p-8 border border-red-400/30">
                <DollarSign size={48} className="text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-400 mb-4">Kaufkraftverlust</h2>
                <p className="text-red-100">Geld wird weniger wert</p>
              </div>
              <div className="bg-yellow-500/20 rounded-2xl p-8 border border-yellow-400/30">
                <Briefcase size={48} className="text-yellow-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Reallöhne</h2>
                <p className="text-yellow-100">Löhne vs. Preissteigerung</p>
              </div>
              <div className="bg-blue-500/20 rounded-2xl p-8 border border-blue-400/30">
                <Building2 size={48} className="text-blue-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-blue-400 mb-4">Sparer</h2>
                <p className="text-blue-100">Niedrigzinsen = Verluste</p>
              </div>
            </div>
            <div className="mt-12 bg-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Reallohn-Entwicklung Deutschland</h3>
              <div className="grid grid-cols-3 gap-6">
                {(realWageData || []).slice(-3).map((data) => (
                  <div key={data.year} className="text-center">
                    <div className="text-lg text-blue-200">{data.year}</div>
                    <div className={`text-3xl font-bold ${(data.realGrowth || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {(data.realGrowth || 0) > 0 ? '+' : ''}{data.realGrowth || 0}%
                    </div>
                    <div className="text-sm text-blue-300">Reallohn</div>
                  </div>
                ))}
              </div>
              <p className="text-blue-300 text-xs mt-4">
                Reallöhne = Nominallöhne minus Inflation. Quelle: Destatis (Reallohnindex), vereinfachte Darstellung.
              </p>
            </div>
          </div>
        );

      case 'effects-prices':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <ShoppingCart size={48} className="text-cyan-400" />
              Preisbeispiele: 2020 vs. 2025
            </h1>
            <div className="grid grid-cols-2 gap-8">
              {(priceExamples || []).map((example, index) => (
                <motion.div key={index} className="bg-white/5 rounded-2xl p-8 border border-white/10" {...fadeUpVariant(0.15 + index * 0.08)}>
                  <h3 className="text-2xl font-bold text-white mb-6">{example.item}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center">
                      <div className="text-sm text-blue-200">2020</div>
                      <div className="text-2xl font-bold text-blue-400">{(example.price2020 ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</div>
                    </div>
                    <div className="text-4xl">→</div>
                    <div className="text-center">
                      <div className="text-sm text-red-200">2025</div>
                      <div className="text-2xl font-bold text-red-400">{(example.price2025 ?? 0).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${example.increase > 40 ? 'text-red-400' : example.increase > 25 ? 'text-yellow-400' : 'text-green-400'}`}>
                      +{example.increase}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-blue-300 text-xs mt-6">
              Hinweis: Beispielwerte für die Präsentation. Reale Preisentwicklung variiert nach Region und Kategorie.
            </p>
          </div>
        );

      case 'measurement-intro':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <BarChart3 size={48} className="text-cyan-400" />
              Wie wird Inflation gemessen?
            </h1>
            <div className="grid grid-cols-2 gap-12">
              <motion.div className="bg-white/5 rounded-2xl p-8 border border-white/10" {...fadeUpVariant(0.15)}>
                <h2 className="text-3xl font-bold text-cyan-400 mb-6">Verbraucherpreisindex (VPI)</h2>
                <div className="text-left space-y-4 text-cyan-200">
                  <p className="flex items-center gap-2"><ShoppingCart size={20} className="text-cyan-400" /> <strong>Warenkorb:</strong> 650 repräsentative Güter</p>
                  <p className="flex items-center gap-2"><Scale size={20} className="text-cyan-400" /> <strong>Gewichtung:</strong> Nach Ausgabenanteilen</p>
                  <p className="flex items-center gap-2"><Calendar size={20} className="text-cyan-400" /> <strong>Messung:</strong> Monatlich durch Destatis</p>
                  <p className="flex items-center gap-2"><Hash size={20} className="text-cyan-400" /> <strong>Formel:</strong> (VPI heute - VPI vor Jahr) / VPI vor Jahr × 100</p>
                </div>
              </motion.div>
              <motion.div className="bg-white/5 rounded-2xl p-8 border border-white/10" {...fadeUpVariant(0.25)}>
                <h2 className="text-3xl font-bold text-blue-400 mb-6">HVPI (EU-weit)</h2>
                <div className="text-left space-y-4 text-blue-200">
                  <p className="flex items-center gap-2"><Flag size={20} className="text-blue-400" /> <strong>Harmonisiert:</strong> Einheitliche Standards</p>
                  <p className="flex items-center gap-2"><Building2 size={20} className="text-blue-400" /> <strong>EZB-Basis:</strong> Für Geldpolitik</p>
                  <p className="flex items-center gap-2"><BarChart3 size={20} className="text-blue-400" /> <strong>Eurostat:</strong> EU-Koordination</p>
                  <p className="flex items-center gap-2"><Target size={20} className="text-blue-400" /> <strong>Ziel:</strong> 2% für Eurozone</p>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'measurement-categories':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <TrendingUp size={48} className="text-cyan-400" />
              Inflation nach Kategorien
            </h1>
            <div className="grid grid-cols-1 gap-6">
              {(inflationByCategory || []).map((category, index) => (
                <motion.div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10" {...fadeUpVariant(0.12 + index * 0.08)}>
                  <div className="grid grid-cols-4 gap-6 items-center">
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white">{category.category}</h3>
                      <p className="text-cyan-200 text-sm">{category.description}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{category.rate2025}%</div>
                      <div className="text-green-200 text-sm">2025</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{category.rate2022}%</div>
                      <div className="text-red-200 text-sm">2022</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-bold ${(category.rate2025 || 0) < (category.rate2022 || 0) ? 'text-green-400' : 'text-red-400'}`}>
                        {(category.rate2025 || 0) < (category.rate2022 || 0) ? '↓' : '↑'}
                        {Math.abs((category.rate2025 || 0) - (category.rate2022 || 0)).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}pp
                      </div>
                      <div className="text-blue-200 text-sm">Änderung</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'ecb-policy':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <Building2 size={48} className="text-cyan-400" />
              EZB-Geldpolitik: Inflation steuern
            </h1>
            <div className="grid grid-cols-2 gap-12 mb-12">

              {/* Inflation zu hoch */}
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-8 border border-red-400/30">
                <TrendingUp size={48} className="text-red-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-red-400 mb-6">Inflation zu hoch (&gt;2%)</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <ChevronUp size={24} className="text-red-400" />
                    <div>
                      <div className="font-bold text-white">Leitzins erhöhen</div>
                      <div className="text-red-200 text-sm">2022: 0% → 4,5%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard size={24} className="text-red-400" />
                    <div>
                      <div className="font-bold text-white">Kredite teurer</div>
                      <div className="text-red-200 text-sm">Weniger Konsum & Investitionen</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign size={24} className="text-red-400" />
                    <div>
                      <div className="font-bold text-white">Sparen attraktiver</div>
                      <div className="text-red-200 text-sm">Geld aus dem Markt</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingDown size={24} className="text-red-400" />
                    <div>
                      <div className="font-bold text-white">Nachfrage sinkt</div>
                      <div className="text-red-200 text-sm">Preise stabilisieren sich</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inflation zu niedrig */}
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-blue-400/30">
                <TrendingDown size={48} className="text-blue-400 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-blue-400 mb-6">Inflation zu niedrig (&lt;2%)</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <ChevronDown size={24} className="text-blue-400" />
                    <div>
                      <div className="font-bold text-white">Leitzins senken</div>
                      <div className="text-blue-200 text-sm">2020: 0% (Nullzinspolitik)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard size={24} className="text-blue-400" />
                    <div>
                      <div className="font-bold text-white">Kredite billiger</div>
                      <div className="text-blue-200 text-sm">Mehr Konsum & Investitionen</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Banknote size={24} className="text-blue-400" />
                    <div>
                      <div className="font-bold text-white">Sparen unattraktiv</div>
                      <div className="text-blue-200 text-sm">Geld in den Markt</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp size={24} className="text-blue-400" />
                    <div>
                      <div className="font-bold text-white">Nachfrage steigt</div>
                      <div className="text-blue-200 text-sm">Preise steigen</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Einlagefazilität – Kurve (Präsentation) */}
            <div className="bg-white/5 rounded-2xl p-8 mb-12 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
                <LineChart size={28} className="text-blue-400" />
                Einlagefazilität 2019–2025
              </h3>
              <div className="h-64">
                <Line
                  data={{
                    labels: ecbYears,
                    datasets: [{
                      label: 'Einlagefazilität (%)',
                      data: ecbData,
                      borderColor: '#3B82F6',
                      backgroundColor: 'rgba(59,130,246,0.1)',
                      borderWidth: 4,
                      pointRadius: 6,
                      fill: true,
                      tension: 0.35,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { min: -0.6, max: 5, ticks: { color: 'white' } },
                      x: { ticks: { color: 'white' } },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 'ecb-instruments':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <Settings size={48} className="text-cyan-400" />
              EZB-Steuerungsinstrumente
            </h1>
            <div className="grid grid-cols-2 gap-8 mb-8">

              {/* Hauptrefinanzierungsfazilität */}
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-blue-400/30">
                <Building2 size={48} className="text-blue-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-blue-400 mb-4">Hauptrefinanzierungsfazilität</h2>
                <div className="text-left space-y-3 text-blue-200">
                  <p className="flex items-start gap-2">
                    <ArrowUpDown size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Kredite an Banken:</strong> EZB verleiht Geld gegen Wertpapiere als Sicherheit</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Clock size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Laufzeit:</strong> Meist 1 Woche (Wertpapierpensionsgeschäfte)</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Target size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                    <span><strong>Steuerung:</strong> Über Kreditmenge und Leitzins</span>
                  </p>
                </div>
              </div>

              {/* Spitzenrefinanzierungsfazilität */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-8 border border-orange-400/30">
                <Clock size={48} className="text-orange-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-orange-400 mb-4">Spitzenrefinanzierungsfazilität</h2>
                <div className="text-left space-y-3 text-orange-200">
                  <p className="flex items-start gap-2">
                    <Clock size={16} className="text-orange-400 mt-1 flex-shrink-0" />
                    <span><strong>Über Nacht:</strong> Kurzfristige Kredite an Banken</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <TrendingUp size={16} className="text-orange-400 mt-1 flex-shrink-0" />
                    <span><strong>Höherer Zins:</strong> Spitzenrefinanzierungssatz (SRS)</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-orange-400 mt-1 flex-shrink-0" />
                    <span><strong>Notfall:</strong> Für kurzfristige Liquiditätsengpässe</span>
                  </p>
                </div>
              </div>

              {/* Einlagefazilität */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border border-green-400/30">
                <PiggyBank size={48} className="text-green-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-green-400 mb-4">Einlagefazilität</h2>
                <div className="text-left space-y-3 text-green-200">
                  <p className="flex items-start gap-2">
                    <PiggyBank size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <span><strong>Geld parken:</strong> Banken legen überschüssiges Geld bei EZB an</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Clock size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <span><strong>Über Nacht:</strong> Kurzfristige Geldanlage</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <DollarSign size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    <span><strong>Einlagesatz:</strong> Je nach Phase positiv oder negativ; aktuell positiv (EZB vergütet Einlagen)</span>
                  </p>
                </div>
              </div>

              {/* Mindestreservepolitik */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-400/30">
                <Shield size={48} className="text-purple-400 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-purple-400 mb-4">Mindestreservepolitik</h2>
                <div className="text-left space-y-3 text-purple-200">
                  <p className="flex items-start gap-2">
                    <Scale size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                    <span><strong>Pflichtreserve:</strong> Banken müssen Anteil ihrer Einlagen bei EZB hinterlegen</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Hash size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                    <span><strong>Aktuell:</strong> 1% der Kundeneinlagen</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <TrendingDown size={16} className="text-purple-400 mt-1 flex-shrink-0" />
                    <span><strong>Effekt:</strong> Hohe Reserve = weniger Geld im Markt</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'ecb-mechanism':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <Target size={48} className="text-cyan-400" />
              Geldmengensteuerung im Überblick
            </h1>

            {/* Haupterklärung */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-12 border border-blue-400/30 mb-12">
              <p className="text-2xl text-blue-100 leading-relaxed mb-8">
                Die EZB steuert die <strong className="text-white">Geldmenge über das Bankensystem</strong> -
                mehr Geld bei Banken führt zu mehr Krediten, Investitionen und Konsum,
                was die Preise und Inflation antreibt.
              </p>

              {/* Mechanismus-Kette */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="text-center">
                  <Building2 size={32} className="text-blue-400 mx-auto mb-2" />
                  <div className="text-sm font-bold text-white">EZB</div>
                  <div className="text-xs text-blue-200">Geldpolitik</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-cyan-400">→</div>
                </div>
                <div className="text-center">
                  <Building2 size={32} className="text-green-400 mx-auto mb-2" />
                  <div className="text-sm font-bold text-white">Banken</div>
                  <div className="text-xs text-green-200">Kreditvergabe</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-cyan-400">→</div>
                </div>
                <div className="text-center">
                  <Briefcase size={32} className="text-yellow-400 mx-auto mb-2" />
                  <div className="text-sm font-bold text-white">Wirtschaft</div>
                  <div className="text-xs text-yellow-200">Investitionen</div>
                </div>
              </div>
            </div>

            {/* Zwei Szenarien */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Expansive Geldpolitik */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border border-green-400/30">
                <div className="text-center mb-6">
                  <TrendingUp size={48} className="text-green-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-400">Mehr Geld → Höhere Inflation</h2>
                  <p className="text-green-200 text-sm">Expansive Geldpolitik</p>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div>
                      <div className="font-bold text-white">Niedrige Zinsen</div>
                      <div className="text-green-200 text-sm">EZB senkt Leitzins</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <div className="font-bold text-white">Mehr Kredite</div>
                      <div className="text-green-200 text-sm">Banken vergeben mehr Geld</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <div className="font-bold text-white">Mehr Investitionen</div>
                      <div className="text-green-200 text-sm">Unternehmen & Verbraucher</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                    <div>
                      <div className="font-bold text-white">Höherer Konsum</div>
                      <div className="text-green-200 text-sm">Nachfrage steigt</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">5</div>
                    <div>
                      <div className="font-bold text-white">Preise steigen</div>
                      <div className="text-green-200 text-sm">Inflation nimmt zu</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Restriktive Geldpolitik */}
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-8 border border-red-400/30">
                <div className="text-center mb-6">
                  <TrendingDown size={48} className="text-red-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-red-400">Weniger Geld → Niedrigere Inflation</h2>
                  <p className="text-red-200 text-sm">Restriktive Geldpolitik</p>
                </div>

                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div>
                      <div className="font-bold text-white">Hohe Zinsen</div>
                      <div className="text-red-200 text-sm">EZB erhöht Leitzins</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <div className="font-bold text-white">Weniger Kredite</div>
                      <div className="text-red-200 text-sm">Banken vergeben weniger Geld</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <div className="font-bold text-white">Weniger Investitionen</div>
                      <div className="text-red-200 text-sm">Zurückhaltung bei Ausgaben</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                    <div>
                      <div className="font-bold text-white">Geringerer Konsum</div>
                      <div className="text-red-200 text-sm">Nachfrage sinkt</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">5</div>
                    <div>
                      <div className="font-bold text-white">Preise stabilisieren</div>
                      <div className="text-red-200 text-sm">Inflation sinkt</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'history-intro':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <AlertTriangle size={48} className="text-red-400" />
              Wenn Inflation außer Kontrolle gerät
            </h1>
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-12 border border-red-400/30">
              <h2 className="text-3xl font-bold text-white mb-8">Hyperinflation</h2>
              <p className="text-2xl text-red-100 mb-8">
                Inflation über <strong>50% pro Monat</strong> = Hyperinflation
              </p>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <Banknote size={48} className="text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Ursachen</h3>
                  <p className="text-red-200">Krieg, Politik, Gelddrucken</p>
                </div>
                <div className="text-center">
                  <TrendingUp size={48} className="text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Folgen</h3>
                  <p className="text-red-200">Währungskollaps, Armut</p>
                </div>
                <div className="text-center">
                  <RefreshCw size={48} className="text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Lösung</h3>
                  <p className="text-red-200">Neue Währung, Reform</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'key-takeaways':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <Target size={48} className="text-cyan-400" />
              Die wichtigsten Erkenntnisse
            </h1>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-blue-400/30">
                  <Lightbulb size={48} className="text-blue-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-4">Inflation ist normal</h2>
                  <p className="text-blue-100">2% jährlich zeigt eine gesunde, wachsende Wirtschaft</p>
                </div>
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-8 border border-red-400/30">
                  <AlertTriangle size={48} className="text-red-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-4">Extreme sind gefährlich</h2>
                  <p className="text-red-100">Zu hohe oder zu niedrige Inflation schadet der Wirtschaft</p>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border border-green-400/30">
                  <Building2 size={48} className="text-green-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-4">EZB wacht über uns</h2>
                  <p className="text-green-100">Unabhängige Zentralbank sorgt für Preisstabilität</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-400/30">
                  <Brain size={48} className="text-purple-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-4">Verstehen hilft</h2>
                  <p className="text-purple-100">Wissen über Inflation hilft bei persönlichen Finanzentscheidungen</p>
                </div>
              </div>
            </div>
            <div className="mt-12 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-8 border border-yellow-400/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <Flag size={28} className="text-yellow-400" />
                Deutschland heute: Auf dem richtigen Weg
              </h3>
              <p className="text-xl text-yellow-100">
                Von 6,9% (2022) zurück auf 2,2% (2025) – Stand: {DATA_STAND_SHORT} – die Inflation normalisiert sich wieder
              </p>
            </div>
          </div>
        );

      case 'history-timeline':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <FileText size={48} className="text-cyan-400" />
              Historische Hyperinflation
            </h1>
            <div className="space-y-8">
              {(historicalEvents || [])
                .filter(e => !['Japan','Zimbabwe','Venezuela'].includes((e.country || '')))
                .sort((a, b) => (a.year || 0) - (b.year || 0)) // Sortierung von alt zu neu
                .map((event, index) => (
                <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="grid grid-cols-4 gap-6 items-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{event.year}</div>
                      <div className="text-blue-200">{event.country}</div>
                    </div>
                    <div className="text-center">
                      <div
                        className="text-3xl font-bold text-red-400"
                        title="Sehr große Raten werden als Millionen/Milliarden/Billionen/Billiarden % dargestellt, um die Größenordnung verständlich zu machen."
                      >
                        {formatHugePercent(event.rate || 0)}
                      </div>
                      <div className="text-red-200 text-sm">Inflationsrate</div>
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white mb-1">{event.title}</h3>
                      <p className="text-blue-200 text-sm">{event.description}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-yellow-200 text-sm">{event.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
              <FileText size={48} className="text-cyan-400" />
              Zusammenfassung
            </h1>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="bg-blue-500/20 rounded-2xl p-6 border border-blue-400/30">
                  <h2 className="text-2xl font-bold text-blue-400 mb-4">Was ist Inflation?</h2>
                  <p className="text-blue-100">Allgemeiner Preisanstieg, gemessen am VPI</p>
                </div>
                <div className="bg-red-500/20 rounded-2xl p-6 border border-red-400/30">
                  <h2 className="text-2xl font-bold text-red-400 mb-4">Hauptursachen</h2>
                  <p className="text-red-100">Nachfrage- und Angebotsinflation</p>
                </div>
                <div className="bg-yellow-500/20 rounded-2xl p-6 border border-yellow-400/30">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-4">Auswirkungen</h2>
                  <p className="text-yellow-100">Kaufkraftverlust, Reallohnrückgang</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-green-500/20 rounded-2xl p-6 border border-green-400/30">
                  <h2 className="text-2xl font-bold text-green-400 mb-4">EZB-Ziel</h2>
                  <p className="text-green-100">2% jährlich für Preisstabilität</p>
                </div>
                <div className="bg-purple-500/20 rounded-2xl p-6 border border-purple-400/30">
                  <h2 className="text-2xl font-bold text-purple-400 mb-4">Deutschland 2024</h2>
                  <p className="text-purple-100">2,2% - Rückkehr zur Normalität</p>
                </div>
                <div className="bg-orange-500/20 rounded-2xl p-6 border border-orange-400/30">
                  <h2 className="text-2xl font-bold text-orange-400 mb-4">Lehre</h2>
                  <p className="text-orange-100">Moderate Inflation ist gesund</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'thanks':
        return (
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-8 flex items-center justify-center gap-4">
              <ThumbsUp size={64} className="text-cyan-400" />
              Vielen Dank!
            </h1>
            <p className="text-2xl text-blue-200 mb-12">
              Fragen zur Inflation?
            </p>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-12 border border-blue-400/30">
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-center gap-3">
                <Lightbulb size={36} className="text-cyan-400" />
                Das Wichtigste in Kürze
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Inflation ist ein normaler Teil der Wirtschaft. Die EZB sorgt mit ihrer Geldpolitik
                dafür, dass die Preise stabil bleiben. Als Verbraucher sollten wir verstehen,
                wie Inflation unser tägliches Leben beeinflusst.
              </p>
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg border border-white/20 transition-all duration-300 hover:scale-105"
              >
                Mehr über Inflation erfahren
              </Link>
            </div>

          </div>
        );

      default:

        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              Slide {currentSlide + 1}: {slideType}
            </h1>
            <p className="text-xl text-blue-200">
              Diese Slide wird noch implementiert...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-7xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[currentSlide]}
              initial={{ opacity: 0, y: 40, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: easeOutSmooth } }}
              exit={{ opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.3, ease: easeInOutSmooth } }}
              className="w-full"
            >
              {renderSlide()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Controls */}
      <div className="fixed bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-sm text-white">
        <span>Folie {currentSlide + 1} / {slides.length}</span>
      </div>




    </div>
  );
}
