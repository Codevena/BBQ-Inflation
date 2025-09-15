"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Settings, Shield, Package, FileText } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function BusinessResilienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
    }, sectionRef);
    return () => ctx.revert();
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
          <p className="text-xs text-blue-300 mt-4">
            Hinweis: Keine Finanzberatung – Inhalte dienen nur Bildungszwecken.
          </p>
        </div>
      </div>
    </section>
  );
}

