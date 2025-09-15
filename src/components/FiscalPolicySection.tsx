'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Landmark, Banknote, Scale, AlertTriangle, Settings, BarChart3, Clock, Globe } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FiscalPolicySection() {
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
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="fiscal" ref={sectionRef} className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-emerald-900 via-slate-900 to-cyan-900 py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-12">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 flex items-center justify-center gap-4">
            <Landmark size={40} className="text-emerald-400" />
            Fiskalpolitik
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 block">Rolle und Wirkung</span>
          </h2>
          <p className="text-xl text-emerald-200 max-w-4xl mx-auto">
            Wie Steuern, Transfers und Staatsausgaben die Inflation dämpfen oder ankurbeln können
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <Banknote size={36} className="text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white mt-2">Dämpfen oder ankurbeln</h3>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              <span className="text-white font-medium">Steuersenkungen/Transfers</span> erhöhen die Nachfrage und können Preisdruck verstärken.
              <span className="text-white font-medium">Konsolidierung</span> dämpft Nachfrage, kann aber Wachstum bremsen.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <Scale size={36} className="text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white mt-2">Schuldenquote & Inflation</h3>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Moderate Inflation kann die <span className="text-white font-medium">reale Schuldenlast</span> senken; zu hohe Raten gefährden Vertrauen.
              Solide Fiskalregeln stabilisieren Erwartungen.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <AlertTriangle size={36} className="text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white mt-2">Preisregulierung</h3>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              <span className="text-white font-medium">Deckel/Preisbremsen</span> wirken kurzfristig, schaffen aber Risiken: Knappheiten, Fehlanreize, Verdrängung von Angebot.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <Landmark size={36} className="text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white mt-2">Automatische Stabilisatoren</h3>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Arbeitslosenversicherung, progressive Steuern und Transfers dämpfen Schwankungen automatisch – ohne ad‑hoc Politik.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <Scale size={36} className="text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white mt-2">Mehrwertsteuer & Durchschlag</h3>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              MWSt‑Anpassungen wirken direkt auf Preise; der <span className="text-white font-medium">Pass‑through</span> variiert je Marktstruktur und Wettbewerb.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <Banknote size={36} className="text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white mt-2">Gezielte vs. breite Hilfen</h3>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              <span className="text-white font-medium">Gezielte Transfers/Subventionen</span> schonen das Budget und mindern Verzerrungen – besser als breite Preisbremsen.
            </p>
          </div>

          {/* Politikmix mit Geldpolitik */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <Settings size={36} className="text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white mt-2">Politikmix mit Geldpolitik</h3>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Fiskal‑ und Geldpolitik sollten <span className="text-white font-medium">koordiniert</span> agieren: Bei hoher Inflation keine gegenläufige fiskalische Expansion; in Schwächephasen zielgerichtet stützen.
            </p>
          </div>

          {/* r − g und Schuldentragfähigkeit */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <BarChart3 size={36} className="text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white mt-2">r − g & Tragfähigkeit</h3>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Ist der Zins <span className="text-white font-medium">r</span> dauerhaft kleiner als das Wachstum <span className="text-white font-medium">g</span>, fällt die Schuldenquote leichter. Umgekehrt sind Defizitgrenzen wichtiger.
            </p>
          </div>

          {/* Temporär vs. dauerhaft */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <Clock size={36} className="text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white mt-2">Temporär vs. dauerhaft</h3>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Temporäre Hilfen mit <span className="text-white font-medium">klarem Ausstiegspfad</span> vermeiden Erwartungsfehler und Pfadabhängigkeiten. Dauerhafte Programme benötigen Gegenfinanzierung und Evaluierung.
            </p>
          </div>

          {/* Offene Volkswirtschaft */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="text-center mb-4">
              <Globe size={36} className="text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white mt-2">Offene Volkswirtschaft</h3>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Fiskalimpulse erhöhen über Importe oft die <span className="text-white font-medium">Außennachfrage</span>. Wechselkurs und <span className="text-white font-medium">importierte Inflation</span> beeinflussen die Wirksamkeit.
            </p>
          </div>

          {/* Praxisbeispiele (full width) */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 md:col-span-3">
            <div className="text-center mb-3">
              <h3 className="text-xl font-bold text-white">Praxisbeispiele</h3>
            </div>
            <ul className="text-emerald-200 text-sm space-y-2 list-disc list-inside">
              <li><span className="text-white font-medium">MWSt‑Senkung 2020 (DE):</span> temporäre Dämpfung der Preise; heterogener Pass‑through je Branche.</li>
              <li><span className="text-white font-medium">Energiepreisbremsen 2022/23:</span> kurzfristige Entlastung, aber fiskalische Kosten und Verzerrungsrisiken.</li>
              <li><span className="text-white font-medium">Gezielte Transfers:</span> bessere Treffsicherheit bei geringerer Marktverzerrung im Vergleich zu Preisdeckeln.</li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 md:col-span-3">
            <div className="text-center mb-3">
              <h3 className="text-xl font-bold text-white">Leitlinien</h3>
            </div>
            <ul className="text-emerald-200 text-sm space-y-2 list-disc list-inside">
              <li>Gegenläufig handeln: Bei Überhitzung bremsen, in Schwächephasen stützen.</li>
              <li>Temporär und zielgenau: Klare Ausstiegspfade vermeiden Erwartungsfehler.</li>
              <li>Angebotsseite stärken: Investitionen, Produktivität, Energieversorgung.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
