'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ShoppingCart } from 'lucide-react';
import { cpiWeightsGermany } from '@/data/inflationData';

ChartJS.register(ArcElement, Tooltip, Legend);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CPIBasketSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current], { opacity: 0, y: 30 });
      gsap.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const data = {
    labels: cpiWeightsGermany.map(i => i.category),
    datasets: [
      {
        data: cpiWeightsGermany.map(i => i.weight),
        backgroundColor: cpiWeightsGermany.map(i => i.color),
        borderColor: '#0f172a',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  } as const;

  return (
    <section ref={sectionRef} className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-white text-center mb-8 flex items-center justify-center gap-3">
          <ShoppingCart size={28} className="text-cyan-400" />
          VPI‑Warenkorb (Gewichte)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="h-72 md:h-80 bg-white/5 rounded-xl p-6 border border-white/10">
            <Doughnut data={data} options={options} />
          </div>
          <div className="space-y-2">
            {cpiWeightsGermany.map((i) => (
              <div key={i.category} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: i.color }} />
                  <span className="text-white">{i.category}</span>
                </div>
                <span className="text-cyan-300 font-semibold">{i.weight}%</span>
              </div>
            ))}
            <p className="text-blue-300 text-xs mt-3">
              Hinweis: Vereinfachte Gewichte – dienen der Illustration des VPI‑Warenkorbs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

