"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Users, Scale, FileText } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LabourPhillipsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const hasAnimatedRef = useRef(false);
  const animatingRef = useRef(false);
  const [curveData, setCurveData] = useState<Array<{ x: number; y: number }>>([]);

  const fullCurve = Array.from({ length: 25 }).map((_, i) => {
    const u = 3 + i * 0.3;
    const pi = 5.5 - 0.5 * u;
    return { x: u, y: pi };
  });

  const animateCurve = useCallback(() => {
    if (hasAnimatedRef.current || animatingRef.current) return;
    animatingRef.current = true;
    const n = fullCurve.length;
    const start = performance.now();
    const duration = 1600;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const prog = Math.floor(t * (n - 1));
      setCurveData(fullCurve.slice(0, Math.max(2, prog)));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setCurveData(fullCurve);
        hasAnimatedRef.current = true;
        animatingRef.current = false;
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

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

      // Start curve animation when chart scrolls into view
      if (chartRef.current) {
        gsap.to(chartRef.current, {
          scrollTrigger: {
            trigger: chartRef.current,
            start: 'top 85%',
            once: true,
            onEnter: () => animateCurve()
          }
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [animateCurve]);

  // Cleanup any pending rAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  return (
    <section id="labour" ref={sectionRef} className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-indigo-900 py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 flex items-center justify-center gap-4">
            <Users size={40} className="text-purple-300" />
            Löhne, Arbeitsmarkt & Phillips‑Kurve
          </h2>
          <p className="text-xl text-purple-200 max-w-4xl mx-auto">
            Zusammenhang zwischen Inflation, Arbeitslosigkeit und Lohnverhandlungen – einfach erklärt
          </p>
        </div>

        {/* Mini‑Diagramm: Phillips‑Kurve (Scatter, animierte Richtungs‑Kurve) */}
        <div className="mb-10 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10" ref={chartRef}>
          <h4 className="text-white font-semibold mb-3">Phillips‑Kurve – visuelle Intuition</h4>
          <div className="h-64">
            <Scatter
              data={{
                datasets: [
                  {
                    label: 'Beobachtungen',
                    data: Array.from({ length: 20 }).map((_, i) => {
                      const u = 3 + i * 0.25;
                      const pi = 5.5 - 0.5 * u + (Math.random() - 0.5) * 0.5;
                      return { x: u, y: parseFloat(pi.toFixed(2)) };
                    }),
                    backgroundColor: 'rgba(168, 85, 247, 0.8)'
                  },
                  {
                    label: 'Richtungs‑Kurve',
                    data: curveData,
                    showLine: true,
                    backgroundColor: 'rgba(236, 72, 153, 0.0)',
                    borderColor: 'rgba(236, 72, 153, 0.9)',
                    pointRadius: 0,
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: true } },
                scales: {
                  x: { title: { display: true, text: 'Arbeitslosigkeit (%)', color: '#ddd' }, ticks: { color: '#ddd' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                  y: { title: { display: true, text: 'Inflation (%)', color: '#ddd' }, ticks: { color: '#ddd' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                }
              }}
            />
          </div>
          <p className="text-purple-200 text-sm mt-3">
            Bei <span className="text-white font-medium">niedriger Arbeitslosigkeit</span> steigen Löhne oft schneller; Unternehmen geben einen Teil der Kosten weiter – die Inflation kann anziehen.
            Umgekehrt kann <span className="text-white font-medium">hohe Arbeitslosigkeit</span> Preisdruck dämpfen. Diese Beziehung hängt stark von <span className="text-white font-medium">Erwartungen</span>,
            <span className="text-white font-medium">Produktivität</span> und <span className="text-white font-medium">Angebotsschocks</span> ab und ist daher nicht dauerhaft stabil.
          </p>
          <p className="text-purple-300 text-xs mt-2">Punkte = hypothetische Beobachtungen; Linie = typischer kurzfristiger Trade‑off (nicht stabil).</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <TrendingUp size={32} className="text-purple-300 mx-auto" />
              <h3 className="text-lg font-bold text-white mt-2">Phillips‑Kurve (kurzfristig)</h3>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              Bei niedriger Arbeitslosigkeit steigen Löhne schneller – Unternehmen geben Kosten teils an Preise weiter.
              Der Zusammenhang ist <span className="text-white font-medium">nicht stabil</span> und hängt von Erwartungen und Schocks ab.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <Scale size={32} className="text-purple-300 mx-auto" />
              <h3 className="text-lg font-bold text-white mt-2">NAIRU‑Idee</h3>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              Die inflationsstabile Arbeitslosenquote ist <span className="text-white font-medium">keine fixe Konstante</span> – sie ändert sich mit Struktur, Demografie und Produktivität.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <FileText size={32} className="text-purple-300 mx-auto" />
              <h3 className="text-lg font-bold text-white mt-2">Tarif & Indexierung</h3>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              Produktivität und Inflationserwartungen prägen Abschlüsse. <span className="text-white font-medium">Indexierung</span> stabilisiert Reallöhne, kann aber Persistenz erhöhen.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <TrendingUp size={32} className="text-purple-300 mx-auto" />
              <h3 className="text-lg font-bold text-white mt-2">Mindestlohn & Preise</h3>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed">
              Erhöhungen wirken direkt/indirekt auf Lohnstruktur und Preissetzung. Wirkung hängt von <span className="text-white font-medium">Marktmacht und Produktivität</span> ab.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
