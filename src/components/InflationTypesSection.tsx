'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity,
  Factory,
  Globe,
  Users,
  BadgeCheck,
  Radar,
  ShieldCheck,
  Sparkles,
  Flame,
  AlertTriangle
} from 'lucide-react';
import {
  inflationTypeDetails,
  inflationSpeedCategories,
  inflationPhenomena,
  inflationComparisonRows,
  type InflationTypeDetail
} from '@/data/inflationData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const typeIconMap: Record<InflationTypeDetail['key'], typeof Activity> = {
  demand: Activity,
  supply: Factory,
  imported: Globe,
  wages: Users
};

export default function InflationTypesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef<HTMLDivElement>(null);
  const phenomenaRef = useRef<HTMLDivElement>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const [activeType, setActiveType] = useState<InflationTypeDetail['key']>('demand');

  const activeDetail = inflationTypeDetails.find(type => type.key === activeType) ?? inflationTypeDetails[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = [titleRef.current, cardsRef.current, detailRef.current, speedRef.current, phenomenaRef.current, comparisonRef.current];
      items.forEach(item => {
        if (!item) return;
        gsap.set(item, { opacity: 0, y: 40 });
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%'
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="types"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-20"
    >
      <div className="container mx-auto px-6 max-w-7xl space-y-16">
        <div ref={titleRef} className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Arten von Inflation verstehen
          </h2>
          <p className="text-xl text-indigo-200">
            Nicht jede Inflationswelle sieht gleich aus: Mechanismus, Tempo und Sonderphänomene bestimmen, wie Geld- und Fiskalpolitik reagieren können.
          </p>
        </div>

        {/* Type selector */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {inflationTypeDetails.map(type => {
            const Icon = typeIconMap[type.key];
            const isActive = activeType === type.key;
            return (
              <button
                key={type.key}
                type="button"
                onClick={() => setActiveType(type.key)}
                className={`text-left rounded-2xl border transition-all duration-300 h-full p-6 backdrop-blur-sm ${
                  isActive
                    ? 'bg-white/15 border-indigo-300/70 shadow-lg shadow-indigo-500/30 scale-[1.02]'
                    : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800/70 text-indigo-300'}`}>
                    <Icon size={26} />
                  </div>
                  <span className={`text-xs uppercase tracking-widest font-semibold ${isActive ? 'text-indigo-200' : 'text-indigo-300/70'}`}>
                    Mechanismus
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{type.title}</h3>
                <p className="text-sm text-indigo-100 leading-relaxed">
                  {type.summary}
                </p>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div ref={detailRef} className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <Sparkles size={24} className="text-indigo-300" />
                {activeDetail.title}: Was steckt dahinter?
              </h3>
              <p className="text-indigo-100 text-sm leading-relaxed">
                {activeDetail.summary}
              </p>
            </div>

            <DetailList
              title="Typische Auslöser"
              icon={<BadgeCheck size={18} className="text-emerald-300" />}
              entries={activeDetail.typicalTriggers}
            />
            <DetailList
              title="Frühindikatoren"
              icon={<Radar size={18} className="text-cyan-300" />}
              entries={activeDetail.indicators}
            />
            <DetailList
              title="Politikreaktion"
              icon={<ShieldCheck size={18} className="text-yellow-300" />}
              entries={activeDetail.policyResponse}
            />
          </div>
        </div>

        {/* Speed spectrum */}
        <div ref={speedRef} className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-3xl border border-indigo-400/30 p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <Flame size={24} className="text-pink-300" />
              Tempo der Preissteigerungen
            </h3>
            <span className="text-sm text-indigo-200">
              Geschwindigkeit entscheidet über Risiken und Handlungsdruck
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {inflationSpeedCategories.map(stage => (
              <div key={stage.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm font-semibold text-indigo-200 uppercase tracking-widest mb-2">
                  {stage.range}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{stage.label}</h4>
                <p className="text-sm text-indigo-100 leading-relaxed mb-3">{stage.description}</p>
                <div className="text-xs text-indigo-200/80">
                  <span className="font-semibold text-indigo-100">Beispiel:</span> {stage.example}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phenomena */}
        <div ref={phenomenaRef} className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <AlertTriangle size={24} className="text-amber-300" />
              Sonderphänomene im Blick behalten
            </h3>
            <span className="text-sm text-indigo-200">
              Nicht jede Teuerung steht im Warenkorb – Beispiele aus dem Alltag
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {inflationPhenomena.map(item => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-6">
                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-indigo-100 leading-relaxed mb-3">{item.description}</p>
                <div className="text-xs text-indigo-200/80">
                  <span className="font-semibold text-indigo-100">Beispiel:</span> {item.example}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison */}
        <div ref={comparisonRef} className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-emerald-500/10 backdrop-blur-sm rounded-3xl border border-blue-400/30 p-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <AlertTriangle size={24} className="text-blue-200" />
            Stagflation vs. Deflation – die Gegenstücke verstehen
          </h3>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 bg-white/5 text-sm font-semibold text-indigo-100 uppercase tracking-wide">
              <div className="px-4 py-3">Thema</div>
              <div className="px-4 py-3">Stagflation</div>
              <div className="px-4 py-3">Deflation</div>
            </div>
            {inflationComparisonRows.map(row => (
              <div key={row.topic} className="grid grid-cols-1 md:grid-cols-3 border-t border-white/10 bg-black/20">
                <div className="px-4 py-4 text-indigo-200 font-semibold">{row.topic}</div>
                <div className="px-4 py-4 text-indigo-100 text-sm leading-relaxed border-t md:border-t-0 md:border-l border-white/10">
                  {row.stagflation}
                </div>
                <div className="px-4 py-4 text-indigo-100 text-sm leading-relaxed border-t md:border-t-0 md:border-l border-white/10">
                  {row.deflation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface DetailListProps {
  title: string;
  icon: ReactNode;
  entries: string[];
}

function DetailList({ title, icon, entries }: DetailListProps) {
  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 p-6 h-full">
      <div className="flex items-center gap-2 mb-4 text-white">
        {icon}
        <h4 className="font-semibold">{title}</h4>
      </div>
      <ul className="space-y-3 text-sm text-indigo-100">
        {entries.map(entry => (
          <li key={entry} className="flex items-start gap-2">
            <span className="mt-0.5 block h-2 w-2 rounded-full bg-indigo-300" />
            <span className="leading-relaxed">{entry}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
