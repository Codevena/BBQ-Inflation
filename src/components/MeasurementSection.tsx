'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, ShoppingCart, Target, TrendingUp, Lightbulb, Flag, Building2, Calculator, Landmark } from 'lucide-react';
import { inflationByCategory } from '@/data/inflationData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MeasurementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([titleRef.current, contentRef.current, categoriesRef.current], {
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

    }, sectionRef);

    return () => ctx.revert();
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
            
            {inflationByCategory.map((category, index) => (
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
