'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, ShoppingCart, Target, TrendingUp, Lightbulb, Flag, Building2, Calculator, Landmark } from 'lucide-react';
import { inflationByCategory, inflationRatesGermany, coreInflationRatesGermany } from '@/data/inflationData';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function MeasurementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const coreBlockRef = useRef<HTMLDivElement>(null);
  const biasesBlockRef = useRef<HTMLDivElement>(null);
  const miniRafRef = useRef<number | null>(null);
  const miniHasAnimatedRef = useRef(false);
  const miniAnimatingRef = useRef(false);

  // Basiseffekt-Simulator state (einfach, lokal, keine Tooltips)
  const [basePrev, setBasePrev] = useState<number>(100);
  const [baseCurr, setBaseCurr] = useState<number>(102);
  const baseEffectRate = ((baseCurr / Math.max(1, basePrev)) - 1) * 100;
  const [showCore, setShowCore] = useState<boolean>(true);
  const [headlineSeries, setHeadlineSeries] = useState<number[]>(inflationRatesGermany.map(() => 0));
  const [coreSeries, setCoreSeries] = useState<number[]>(coreInflationRatesGermany.map(() => 0));

  const resetMiniChart = useCallback(() => {
    if (miniRafRef.current) {
      cancelAnimationFrame(miniRafRef.current);
      miniRafRef.current = null;
    }
    miniHasAnimatedRef.current = false;
    miniAnimatingRef.current = false;
    setHeadlineSeries(inflationRatesGermany.map(() => 0));
    setCoreSeries(coreInflationRatesGermany.map(() => 0));
  }, []);

  const animateMiniChart = useCallback(() => {
    if (miniHasAnimatedRef.current || miniAnimatingRef.current) return;
    miniAnimatingRef.current = true;
    const originalHeadline = inflationRatesGermany.map(d => d.rate);
    const originalCore = coreInflationRatesGermany.map(d => d.rate);
    const n = Math.min(originalHeadline.length, originalCore.length);
    const start = performance.now();
    const duration = 1400;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 2);
      const prog = eased * n; // ensure last point animates smoothly
      const idx = Math.min(n - 1, Math.floor(prog));
      const frac = Math.min(1, Math.max(0, prog - idx));
      const h = originalHeadline.map((v, i) => (i < idx ? v : i === idx ? v * frac : 0));
      const c = originalCore.map((v, i) => (i < idx ? v : i === idx ? v * frac : 0));
      setHeadlineSeries(h);
      setCoreSeries(c);
      if (t < 1) {
        miniRafRef.current = requestAnimationFrame(step);
      } else {
        setHeadlineSeries(originalHeadline);
        setCoreSeries(originalCore);
        miniHasAnimatedRef.current = true;
        miniAnimatingRef.current = false;
        miniRafRef.current = null;
      }
    };
    miniRafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([titleRef.current, contentRef.current, categoriesRef.current, coreBlockRef.current, biasesBlockRef.current], {
        opacity: 0,
        y: 50
      });

      // Main animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 40%',
          toggleActions: 'play none none reverse',
        }
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      })
      .to(contentRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5')
      .to(categoriesRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.3');

      // Fade-in for core vs headline block when it enters viewport
      if (coreBlockRef.current) {
        gsap.to(coreBlockRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: coreBlockRef.current,
            start: 'top 85%',
            onEnter: () => {
              resetMiniChart();
              requestAnimationFrame(() => animateMiniChart());
            },
            onEnterBack: () => {
              resetMiniChart();
              requestAnimationFrame(() => animateMiniChart());
            },
            onLeaveBack: () => {
              resetMiniChart();
            }
          }
        });

        // Stagger children inside core block
        const coreChildren = coreBlockRef.current.querySelectorAll('.stagger-child');
        gsap.set(coreChildren, { opacity: 0, y: 16 });
        gsap.to(coreChildren, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: coreBlockRef.current, start: 'top 85%', once: true }
        });
      }

      // Fade-in for biases block when it enters viewport
      if (biasesBlockRef.current) {
        gsap.to(biasesBlockRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: biasesBlockRef.current, start: 'top 85%', once: true }
        });

        // Stagger list items / elements in biases block
        const biasChildren = biasesBlockRef.current.querySelectorAll('.stagger-child');
        gsap.set(biasChildren, { opacity: 0, y: 16 });
        gsap.to(biasChildren, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: { trigger: biasesBlockRef.current, start: 'top 85%', once: true }
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, [animateMiniChart, resetMiniChart]);
  
  // Cleanup rAF
  useEffect(() => {
    return () => {
      if (miniRafRef.current) cancelAnimationFrame(miniRafRef.current);
    };
  }, []);

  return (
    <section 
      id="measurement" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-cyan-900 py-20"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
          >
            Wie wird Inflation
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 block">
              gemessen?
            </span>
          </h2>
        </div>

        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          
          {/* Left Column - Explanation */}
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <BarChart3 size={28} className="text-cyan-400" />
                Verbraucherpreisindex (VPI)
              </h3>
              <div className="space-y-4 text-cyan-200">
                <p className="leading-relaxed">
                  Der <strong className="text-white">Verbraucherpreisindex</strong> misst die durchschnittliche 
                  Preisentwicklung aller Waren und Dienstleistungen, die private Haushalte für 
                  Konsumzwecke kaufen.
                </p>
                <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                    <ShoppingCart size={20} className="text-cyan-400" />
                    Warenkorb-Methode:
                  </h4>
                  <p className="text-sm">
                    Ein repräsentativer &quot;Warenkorb&quot; mit ca. 650 Gütern und Dienstleistungen
                    wird regelmäßig bepreist. Die Gewichtung erfolgt nach den Ausgabenanteilen 
                    der Haushalte.
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-300 mb-2 flex items-center gap-2">
                    <Calculator size={16} className="text-blue-400" />
                    Berechnung:
                  </h4>
                  <p className="text-sm">
                    Inflationsrate = ((VPI heute - VPI vor einem Jahr) / VPI vor einem Jahr) × 100
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Target size={28} className="text-cyan-400" />
                Harmonisierter VPI (HVPI)
              </h3>
              <p className="text-cyan-200 leading-relaxed mb-4">
                Für EU-weite Vergleiche verwendet die EZB den <strong className="text-white">HVPI</strong>, 
                der nach einheitlichen Standards berechnet wird. Dies ermöglicht es der EZB, 
                eine gemeinsame Geldpolitik für die Eurozone zu betreiben.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                  <div className="text-2xl font-bold text-green-400">2.0%</div>
                  <div className="text-sm text-green-200">EZB-Ziel</div>
                </div>
                <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <div className="text-2xl font-bold text-blue-400">2.4%</div>
                  <div className="text-sm text-blue-200">Eurozone 2025</div>
                </div>
              </div>
            </div>

            {/* Info Box moved here under HVPI */}
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-indigo-400/30">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Lightbulb size={20} className="text-yellow-400" />
                Warum verschiedene Raten?
              </h4>
              <p className="text-indigo-200 text-sm leading-relaxed">
                Verschiedene Gütergruppen entwickeln sich unterschiedlich. Während Energiepreise 
                stark schwanken, sind Dienstleistungen meist stabiler. Die Gesamtinflation ist 
                der gewichtete Durchschnitt aller Kategorien.
              </p>
            </div>
          </div>

          {/* Right Column - Categories */}
          <div ref={categoriesRef} className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <TrendingUp size={28} className="text-cyan-400" />
              Inflation nach Kategorien (Deutschland)
            </h3>
            
            {inflationByCategory.map((category) => (
              <div
                key={category.category}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-white">{category.category}</h4>
                  <div className="text-right">
                    <div className="text-sm text-cyan-200">2025 vs 2022</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center p-3 bg-green-500/20 rounded-lg border border-green-400/30">
                    <div className="text-xl font-bold text-green-400">{category.rate2025}%</div>
                    <div className="text-xs text-green-200">2025</div>
                  </div>
                  <div className="text-center p-3 bg-red-500/20 rounded-lg border border-red-400/30">
                    <div className="text-xl font-bold text-red-400">{category.rate2022}%</div>
                    <div className="text-xs text-red-200">2022</div>
                  </div>
                </div>
                
                <p className="text-cyan-200 text-sm">{category.description}</p>
                
                {/* Progress Bar */}
                <div className="mt-4 bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      category.rate2025 > 3 ? 'bg-red-400' : category.rate2025 > 2 ? 'bg-yellow-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${Math.min(100, category.rate2025 * 10)}%` }}
                  />
                </div>
              </div>
            ))}

            
          </div>
        </div>

        {/* Measurement Add-ons: Kerninflation, BIP-Deflator, Basiseffekt, Biases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-stretch">
          {/* Kerninflation (links oben) */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Target size={20} className="text-cyan-400" />
                Kerninflation
              </h4>
              <p className="text-cyan-200 text-sm leading-relaxed">
                Misst die Preisentwicklung <span className="text-white font-medium">ohne Energie und Nahrungsmittel</span>,
                um besonders volatile Komponenten auszublenden. Nützlich, um <span className="text-white font-medium">mittelfristige Trends </span>
                zu erkennen – ersetzt aber nicht die Gesamtinflation.
              </p>
            </div>

          {/* Basiseffekt-Simulator (rechts, über zwei Reihen) */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 md:row-span-2 flex flex-col">
              <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Calculator size={20} className="text-cyan-400" />
                Basiseffekt‑Simulator
              </h4>
              <p className="text-cyan-200 text-sm leading-relaxed mb-4">
                Vergleiche einen <span className="text-white font-medium">Indexstand im Vorjahr</span> mit dem <span className="text-white font-medium">aktuellen Index</span>.
                Ein <span className="text-white font-medium">sehr niedriger Vorjahreswert</span> kann die Jahresrate künstlich erhöhen – und umgekehrt.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-cyan-200 text-sm mb-2">Index Vorjahr</label>
                  <input
                    type="range"
                    min={80}
                    max={120}
                    step={1}
                    value={basePrev}
                    onChange={(e) => setBasePrev(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-white text-sm mt-1">{basePrev}</div>
                </div>

                <div>
                  <label className="block text-cyan-200 text-sm mb-2">Index aktuell</label>
                  <input
                    type="range"
                    min={80}
                    max={130}
                    step={1}
                    value={baseCurr}
                    onChange={(e) => setBaseCurr(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-right text-white text-sm mt-1">{baseCurr}</div>
                </div>
              </div>

              <div className="mt-4 bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-200 text-sm">Jahresrate</span>
                  <span className={`text-xl font-bold ${baseEffectRate >= 4 ? 'text-red-400' : baseEffectRate >= 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {baseEffectRate.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                  </span>
                </div>
                <div className="text-cyan-300/80 text-xs mt-2">
                  Formel: ((Index aktuell / Index Vorjahr) − 1) × 100
                </div>
              </div>
          </div>

          {/* BIP-Deflator (links unten) */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <BarChart3 size={20} className="text-cyan-400" />
                BIP‑Deflator
              </h4>
              <p className="text-cyan-200 text-sm leading-relaxed">
                Breitestes Preismaß: alle <span className="text-white font-medium">im Inland produzierten</span> Güter und Dienstleistungen.
                Anders als der VPI ist der Deflator <span className="text-white font-medium">keine feste Warenkorbgröße</span>,
                sondern bildet die gesamte <span className="text-white font-medium">Inlandsproduktion</span> ab – hilfreich für Makro‑Analysen.
              </p>
            </div>
        </div>

        {/* Kern vs. Gesamtinflation (Deutschland) */}
        <div ref={coreBlockRef} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xl font-semibold text-white stagger-child">Kern vs. Gesamtinflation (Deutschland)</h4>
            <label className="flex items-center gap-2 text-cyan-200 text-sm">
              <input type="checkbox" checked={showCore} onChange={(e)=>setShowCore(e.target.checked)} />
              Kern anzeigen
            </label>
          </div>
          <p className="text-cyan-200 text-sm mb-3 stagger-child">
            Gesamtinflation umfasst alle Güter (inkl. Energie und Nahrungsmittel). 
            Die <span className="text-white font-medium">Kerninflation</span> blendet diese besonders volatilen Komponenten aus und zeigt den
            <span className="text-white font-medium"> mittelfristigen Trend</span>. 2022/23 lag die Gesamtinflation wegen Energiekrise deutlich über der Kernrate –
            seit 2024 nähern sich beide wieder an.
          </p>
          <div className="h-56 stagger-child">
            <Line
              data={{
                 labels: inflationRatesGermany.map(d=>d.year.toString()),
                 datasets: [
                   {
                     label: 'Gesamt',
                    data: headlineSeries,
                     borderColor: '#38BDF8',
                     backgroundColor: 'rgba(56,189,248,0.1)',
                     pointRadius: 0,
                     tension: 0.35,
                     borderWidth: 2,
                     fill: true,
                   },
                  ...(showCore ? [{
                    label: 'Kern (real)',
                    data: coreSeries,
                    borderColor: '#F472B6',
                    backgroundColor: 'rgba(244,114,182,0.08)',
                    pointRadius: 0,
                    tension: 0.35,
                    borderWidth: 2,
                    fill: false,
                  }] : [])
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#ddd' } }, tooltip: { enabled: true } },
                scales: {
                  x: { ticks: { color: '#ddd' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                  y: { ticks: { color: '#ddd' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                }
              }}
            />
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs stagger-child">
            <span className="inline-flex items-center gap-1 text-cyan-300 stagger-child">
              <span className="inline-block w-3 h-1 rounded bg-[#38BDF8]" /> Gesamt = alle Güter
            </span>
            <span className="inline-flex items-center gap-1 text-pink-300 stagger-child">
              <span className="inline-block w-3 h-1 rounded bg-[#F472B6]" /> Kern = ohne Energie & unverarb. Lebensmittel
            </span>
            <span className="ml-auto text-cyan-300 stagger-child">Quelle: Destatis/Eurostat (Jahresraten, vereinfacht)</span>
          </div>
        </div>

        {/* Messfehler & Verzerrungen – volle Breite */}
        <div ref={biasesBlockRef} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-16">
          <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2 stagger-child">
            <Lightbulb size={20} className="text-yellow-400" />
            Messfehler & Verzerrungen
          </h4>
          <ul className="list-disc list-inside text-cyan-200 text-sm space-y-1">
            <li className="stagger-child"><span className="text-white font-medium">Substitution:</span> Verbraucher weichen auf günstigere Güter aus.</li>
            <li className="stagger-child"><span className="text-white font-medium">Qualitätsanpassungen (Hedonics):</span> Verbesserungen fließen als „Preisrückgang“ ein.</li>
            <li className="stagger-child"><span className="text-white font-medium">Neue Produkte:</span> Verzögerte Aufnahme in den Warenkorb.</li>
            <li className="stagger-child"><span className="text-white font-medium">Outlet‑Bias:</span> Veränderte Einkaufsorte (Online/Discount) werden verzerrt abgebildet.</li>
          </ul>
        </div>

        {/* Bottom Info */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 border border-cyan-400/30">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Landmark size={24} className="text-cyan-400" />
              Wer misst die Inflation?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Flag size={48} className="text-red-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-2">Statistisches Bundesamt</h4>
                <p className="text-cyan-200 text-sm">Berechnet den deutschen VPI monatlich</p>
              </div>
              <div className="text-center">
                <Flag size={48} className="text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-2">Eurostat</h4>
                <p className="text-cyan-200 text-sm">Koordiniert den HVPI für die EU</p>
              </div>
              <div className="text-center">
                <Building2 size={48} className="text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-2">EZB</h4>
                <p className="text-cyan-200 text-sm">Nutzt HVPI für Geldpolitik</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
