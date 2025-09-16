"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Settings, Shield, Package, FileText } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BusinessResilienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const costChartRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);
  const animatingRef = useRef(false);

  const labels = ['Energie', 'Material', 'Logistik', 'Personal', 'Sonstiges'];
  // Prozentanteile – müssen je 100 ergeben (in % der Gesamtkosten)
  const beforeTarget = [24, 30, 12, 22, 12]; // Summe: 100
  const afterTarget  = [20, 28, 10, 24, 18]; // Summe: 100 (Energie/Logistik ↓; Anteile Personal/Sonstiges steigen)

  const [beforeSeries, setBeforeSeries] = useState<number[]>(beforeTarget.map(() => 0));
  const [afterSeries, setAfterSeries] = useState<number[]>(afterTarget.map(() => 0));

  const animateBars = useCallback(() => {
    if (hasAnimatedRef.current || animatingRef.current) return;
    animatingRef.current = true;
    const n = labels.length;
    const start = performance.now();
    const duration = 1200;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 2);
      // n‑step reveal so the last bar gets its own phase
      const prog = eased * n;
      const idx = Math.min(n - 1, Math.floor(prog));
      const frac = Math.min(1, Math.max(0, prog - idx));
      const b = beforeTarget.map((v, i) => (i < idx ? v : i === idx ? v * frac : 0));
      const a = afterTarget.map((v, i) => (i < idx ? v : i === idx ? v * frac : 0));
      setBeforeSeries(b);
      setAfterSeries(a);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setBeforeSeries(beforeTarget);
        setAfterSeries(afterTarget);
        hasAnimatedRef.current = true;
        animatingRef.current = false;
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [labels.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, gridRef.current], { opacity: 0, y: 40 });
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });
      gsap.to(gridRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      });

      if (costChartRef.current) {
        // Keep container visible; animate bars via state
        gsap.set(costChartRef.current, { opacity: 0, y: 20 });
        gsap.to(costChartRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: costChartRef.current,
            start: 'top 85%',
            once: true,
            onEnter: () => animateBars(),
          },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <section id="business" ref={sectionRef} className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 flex items-center justify-center gap-4">
            <Briefcase size={40} className="text-blue-400" />
            Unternehmen: Preise & Resilienz
          </h2>
          <p className="text-xl text-blue-200 max-w-4xl mx-auto">
            Wie Firmen Preissetzung, Kosten und Verträge steuern – robust durch Zins‑ und Inflationszyklen
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <Settings size={32} className="text-blue-400 mx-auto" />
              <h3 className="text-lg font-bold text-white mt-2">Preissetzung & Kommunikation</h3>
            </div>
            <ul className="text-blue-200 text-sm space-y-2 list-disc list-inside">
              <li>Kleinere, häufigere Anpassungen statt großer Sprünge</li>
              <li>Transparente Begründung (Kosten, Qualität, Service)</li>
              <li>Segmentierung: differenzierte Aufschläge je Kundengruppe</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <Package size={32} className="text-blue-400 mx-auto" />
              <h3 className="text-lg font-bold text-white mt-2">Kostenhebel & Effizienz</h3>
            </div>
            <ul className="text-blue-200 text-sm space-y-2 list-disc list-inside">
              <li>Energie‑ und Einkaufssicherung (Rahmen, Volumen)</li>
              <li>Automatisierung, Prozessverbesserung, Materialsubstitution</li>
              <li>Verhandeln: Lieferantenmix, Zahlungsziele, Skonti</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <Shield size={32} className="text-blue-400 mx-auto" />
              <h3 className="text-lg font-bold text-white mt-2">Hedging & Beschaffung</h3>
            </div>
            <ul className="text-blue-200 text-sm space-y-2 list-disc list-inside">
              <li>Termingeschäfte (Energie/FX) mit Policy & Limits</li>
              <li>Mehrquellenstrategie, Sicherheitsbestände risikobasiert</li>
              <li>Make‑or‑Buy regelmäßig überprüfen</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <FileText size={32} className="text-blue-400 mx-auto" />
              <h3 className="text-lg font-bold text-white mt-2">Verträge & Indexierung</h3>
            </div>
            <ul className="text-blue-200 text-sm space-y-2 list-disc list-inside">
              <li>Indexklauseln (Energie/Material) fair & bilateral</li>
              <li>Service‑Level vs. Skimpflation: Qualität schützen</li>
              <li>Preisgleitformeln mit klaren Triggern</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h4 className="text-white font-semibold mb-4">Best Practices</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-200">
            <div>
              <div className="text-white font-semibold mb-1">Governance</div>
              <ul className="list-disc list-inside space-y-1">
                <li>Preiskomitee, Dokumentation, Freigaben</li>
                <li>Hedging‑Rahmen & Stresstests</li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-1">Daten & Monitoring</div>
              <ul className="list-disc list-inside space-y-1">
                <li>Warenkorb‑Treiber, Konkurrenzpreise</li>
                <li>Margen‑KPIs, Frühindikatoren</li>
              </ul>
            </div>
            <div>
              <div className="text-white font-semibold mb-1">Kundenbeziehung</div>
              <ul className="list-disc list-inside space-y-1">
                <li>Frühe Kommunikation & Optionen</li>
                <li>Wert‑/Nutzensicht betonen</li>
              </ul>
            </div>
          </div>
          
        </div>

        {/* Mini‑Beispiele */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Indexklausel (Beispiel) */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h4 className="text-white font-semibold mb-3">Indexklausel (Beispiel)</h4>
            <div className="text-blue-200 text-sm mb-3">
              Preisgleitformel gekoppelt an Energieindex (monatlich, symmetrisch):
            </div>
            <pre className="bg-black/40 text-blue-100 text-xs p-4 rounded-lg overflow-x-auto border border-white/10">{`neuer_preis_t = basispreis * [ 1 + 0.5 * (E_t / E_0 - 1) ]

where:
  basispreis = Vertragsbasis (EUR)
  E_t       = Energieindex (t)
  E_0       = Energieindex (Basis)
  0.5       = Gewicht des Energieanteils`}</pre>
            <p className="text-blue-300 text-xs mt-3">
              Hinweis: beidseitig, mit Schwellwert/Deckel und Audit‑Recht für Indexquelle.
            </p>
          </div>

          {/* Hedge‑Policy (Auszug) */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h4 className="text-white font-semibold mb-3">Energie‑Hedge‑Policy (Auszug)</h4>
            <div className="text-blue-200 text-sm mb-3">
              Staffelung, Limits und Governance klar regeln:
            </div>
            <pre className="bg-black/40 text-blue-100 text-xs p-4 rounded-lg overflow-x-auto border border-white/10">{`Zielquote: 50–80% der nächsten 12 Monate
Laufzeiten: 3–12 Monate, monatliche Tranchen
Instrumente: Forwards, keine Spekulation
Limits: VaR < 3% EBITDA, Kontrahenten-Rating ≥ BBB
Governance: Komitee-Entscheid, 4‑Augen‑Prinzip`}</pre>
            <p className="text-blue-300 text-xs mt-3">
              Optional: Korridore für FX‑Risiken bei Importanteil {'>'} X% definieren.
            </p>
          </div>
        </div>

        {/* Mini‑Diagramm: Kostenstruktur vorher/nachher */}
        <div ref={costChartRef} className="mt-8 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h4 className="text-white font-semibold mb-3">Kostenstruktur – vorher vs. nach Effizienzprogramm</h4>
          <div className="h-64">
            <Bar
              data={{
                labels,
                datasets: [
                  {
                    label: 'Vorher',
                    data: beforeSeries,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)'
                  },
                  {
                    label: 'Nachher',
                    data: afterSeries,
                    backgroundColor: 'rgba(16, 185, 129, 0.5)'
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#ddd' } } },
                scales: {
                  x: { ticks: { color: '#ddd' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                  y: { ticks: { color: '#ddd' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                }
              }}
            />
          </div>
          <p className="text-blue-300 text-xs mt-3">Beispielhafte Struktur (in % der Gesamtkosten); Nachher: Energie/Logistik ↓, Material leicht ↓ – relative Anteile von Personal/Sonstigem steigen.</p>
        </div>
      </div>
    </section>
  );
}
