"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Users, Scale, FileText } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LabourPhillipsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, gridRef.current], { opacity: 0, y: 40 });
      gsap.to(titleRef.current, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });
      gsap.to(gridRef.current, {
        opacity: 1, y: 0, duration: 1.0, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      });
    }, sectionRef);
    return () => ctx.revert();
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

