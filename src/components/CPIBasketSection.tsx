'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ChartData, ChartOptions, TooltipItem, ChartEvent, ActiveElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ShoppingCart, Info } from 'lucide-react';
import { cpiWeightsGermany } from '@/data/inflationData';

ChartJS.register(ArcElement, Tooltip, Legend);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CPIBasketSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current], { opacity: 0, y: 30 });
      gsap.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const data: ChartData<'doughnut', number[], string> = {
    labels: cpiWeightsGermany.map(i => i.category),
    datasets: [
      {
        data: cpiWeightsGermany.map(i => i.weight),
        backgroundColor: cpiWeightsGermany.map(i => i.color),
        borderColor: '#1e293b',
        borderWidth: 3,
        hoverOffset: 10,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        callbacks: {
          label: (ctx: TooltipItem<'doughnut'>) => {
            const cat = cpiWeightsGermany[ctx.dataIndex];
            return [`${cat.category}: ${cat.weight}%`, 'Gewichtung im VPI‑Warenkorb'];
          },
        },
      },
    },
    onHover: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) setHoveredIndex(elements[0].index);
      else setHoveredIndex(null);
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  return (
    <section ref={sectionRef} className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-white text-center mb-8 flex items-center justify-center gap-3">
          <ShoppingCart size={28} className="text-cyan-400" />
          VPI‑Warenkorb (Gewichte)
        </h2>

        {/* Erklärung wie bei "Was verursacht Inflation?" */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Info size={18} className="text-cyan-300" />
            Wie funktioniert der VPI‑Warenkorb?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-cyan-200 text-sm">
            <div>
              <strong className="text-white">Warenkorb:</strong>
              <p>Ca. 650 repräsentative Güter/Dienstleistungen, monatlich bepreist (Stichprobe).</p>
            </div>
            <div>
              <strong className="text-white">Gewichtung:</strong>
              <p>Nach Ausgabenanteilen der Haushalte (z. B. Wohnen/Energie am höchsten).</p>
            </div>
            <div>
              <strong className="text-white">Index‑Idee:</strong>
              <p>Laspeyres‑Index (Grundprinzip): Preise heutiger Warenkorb vs. Basisjahr.</p>
            </div>
            <div>
              <strong className="text-white">Hinweis:</strong>
              <p>Vereinfachte Darstellung; echte Gewichte und Methodik: Destatis/EUROSTAT.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="h-72 md:h-80 bg-white/5 rounded-xl p-6 border border-white/10">
            <Doughnut data={data} options={options} />
          </div>
          {/* Interaktive Liste wie bei Ursachen */}
          <div className="space-y-2">
            {cpiWeightsGermany.map((i, idx) => (
              <div key={i.category} className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                hoveredIndex === idx ? 'bg-white/10 border-white/30 scale-[1.01]' : 'bg-white/5 border-white/10 hover:bg-white/8'
              }`} onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: i.color }} />
                    <span className="text-white font-semibold">{i.category}</span>
                  </div>
                  <span className="text-cyan-300 font-bold">{i.weight}%</span>
                </div>
              </div>
            ))}
            <p className="text-blue-300 text-xs mt-3">Quelle: Destatis (vereinfacht) – dient der Illustration des Warenkorbs.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
