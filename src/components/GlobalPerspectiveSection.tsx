'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Globe,
  Search,
  Laptop,
  Thermometer,
  Brain,
  Map,
  CheckCircle,
  Bot,
  Star,
  Sparkles,
  Lightbulb,
  Table,
  ArrowLeftRight,
  Shield
} from 'lucide-react';
import CountUpNumber from './CountUpNumber';
import { globalInflationData, inflationMythsFacts } from '@/data/inflationData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GlobalPerspectiveSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const methodsRef = useRef<HTMLDivElement>(null);
  const worldMapRef = useRef<HTMLDivElement>(null);
  const regimesRef = useRef<HTMLDivElement>(null);
  const clustersRef = useRef<HTMLDivElement>(null);
  const mythsRef = useRef<HTMLDivElement>(null);
  const trendsRef = useRef<HTMLDivElement>(null);

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [showMyth, setShowMyth] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = [titleRef.current, methodsRef.current, worldMapRef.current, regimesRef.current, clustersRef.current, mythsRef.current, trendsRef.current];
      targets.forEach(target => {
        if (!target) return;
        gsap.set(target, { opacity: 0, y: 50 });
        gsap.to(target, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: target,
            start: 'top 75%'
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getInflationColor = (rate: number) => {
    if (rate < 2) return 'text-green-400';
    if (rate < 5) return 'text-yellow-400';
    if (rate < 10) return 'text-orange-400';
    return 'text-red-400';
  };

  const getInflationBgColor = (rate: number) => {
    if (rate < 2) return 'bg-green-500/20 border-green-400/30';
    if (rate < 5) return 'bg-yellow-500/20 border-yellow-400/30';
    if (rate < 10) return 'bg-orange-500/20 border-orange-400/30';
    return 'bg-red-500/20 border-red-400/30';
  };

  const measurementComparison = [
    {
      metric: 'Verbraucherpreisindex (VPI/CPI)',
      scope: 'Haushaltskonsum national',
      method: 'Fester Warenkorb (Laspeyres), Gewichte aus Haushaltsbudgets',
      note: 'Beinhaltet Nettomieten, Dienstleistungen und indirekte Steuern'
    },
    {
      metric: 'Harmonisierter HVPI',
      scope: 'Haushaltskonsum EU-weit',
      method: 'Einheitliche Methodik, Laspeyres – ohne imputed Rent für selbstgenutztes Wohnen',
      note: 'Basis für das EZB-Ziel und länderübergreifend vergleichbar'
    },
    {
      metric: 'BIP-Deflator',
      scope: 'Gesamte Inlandsproduktion',
      method: 'Quotient aus nominalem und realem BIP, kein fixer Warenkorb',
      note: 'Enthält Investitionen, Staatsausgaben und Exporte – Makro-Blick'
    }
  ];

  const exchangeRegimes = [
    {
      title: 'Fester Wechselkurs',
      description: 'Bindung an eine Leitwährung – importiert Preisstabilität, aber weniger eigene Geldpolitik.',
      example: 'Dänemark (Euro-Peg), Hongkong (USD)'
    },
    {
      title: 'Gleitender Wechselkurs',
      description: 'Markt bestimmt den Kurs, Zentralbank steuert Zinsen – mehr Autonomie, höhere Volatilität.',
      example: 'USA, Eurozone, Brasilien'
    },
    {
      title: 'Dollarisation',
      description: 'Fremdwährung offizielles Zahlungsmittel – hohe Glaubwürdigkeit, keine eigene Zinshoheit.',
      example: 'Ecuador, El Salvador, teils Libanon'
    }
  ];

  const countryClusters = [
    {
      title: 'Industrieländer',
      points: [
        'Unabhängige Zentralbanken mit klaren Inflationszielen (~2%)',
        'Gut entwickelte Finanzmärkte absorbieren Schocks',
        'Inflationserwartungen meist fest verankert'
      ]
    },
    {
      title: 'Schwellenländer',
      points: [
        'Wechselkurs und Rohstoffpreise treiben die Inflation stärker',
        'Fiskalische Glaubwürdigkeit und Institutionen schwanken',
        'Kapitalabflüsse können Währungen und Preise destabilisieren'
      ]
    }
  ];

  return (
    <section
      id="global"
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900 py-20"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            <Globe size={28} className="text-blue-400" /> Inflation
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 block">
              weltweit
            </span>
          </h2>
          <p className="text-xl text-purple-200 max-w-4xl mx-auto">
            Wie sich Inflation international unterscheidet – und warum Messmethoden, Wechselkurse und Glaubwürdigkeit den Unterschied machen.
          </p>
        </div>

        {/* Measurement comparison */}
        <div ref={methodsRef} className="mb-16 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Table size={28} className="text-blue-300" />
            Inflationsmaße im Vergleich
          </h3>
          <div className="hidden md:block">
            <div className="grid grid-cols-4 border border-white/10 rounded-t-xl overflow-hidden text-sm text-purple-100">
              <div className="bg-white/10 px-4 py-3 font-semibold text-white">Maß</div>
              <div className="bg-white/10 px-4 py-3 font-semibold text-white">Abdeckung</div>
              <div className="bg-white/10 px-4 py-3 font-semibold text-white">Methodik</div>
              <div className="bg-white/10 px-4 py-3 font-semibold text-white">Hinweis</div>
            </div>
            {measurementComparison.map(row => (
              <div key={row.metric} className="grid grid-cols-4 border-l border-r border-b border-white/10 text-sm text-purple-100">
                <div className="px-4 py-4 border-r border-white/10 font-semibold text-white">{row.metric}</div>
                <div className="px-4 py-4 border-r border-white/10">{row.scope}</div>
                <div className="px-4 py-4 border-r border-white/10">{row.method}</div>
                <div className="px-4 py-4">{row.note}</div>
              </div>
            ))}
          </div>
          <div className="md:hidden space-y-4">
            {measurementComparison.map(row => (
              <div key={row.metric} className="bg-white/10 rounded-xl border border-white/10 p-4 text-sm text-purple-100">
                <div className="font-semibold text-white mb-2">{row.metric}</div>
                <p className="mb-2"><span className="font-semibold">Abdeckung:</span> {row.scope}</p>
                <p className="mb-2"><span className="font-semibold">Methodik:</span> {row.method}</p>
                <p className="text-xs text-purple-200"><span className="font-semibold text-purple-100">Hinweis:</span> {row.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Global Inflation Map */}
        <div ref={worldMapRef} className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Map size={32} className="text-blue-400" />
            Inflation weltweit (2025)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {globalInflationData.map((country, index) => (
              <div
                key={country.country}
                className={`cursor-pointer transition-all duration-300 rounded-xl p-4 border ${
                  selectedCountry === index
                    ? 'scale-105 bg-white/15 border-purple-400'
                    : `${getInflationBgColor(country.rate2025)} hover:scale-102`
                }`}
                onClick={() => setSelectedCountry(selectedCountry === index ? null : index)}
              >
                <div className="text-center">
                  <Globe size={24} className="mx-auto mb-2 text-blue-300" />
                  <h4 className="font-bold text-white text-sm mb-2">{country.country}</h4>
                  <div className={`text-2xl font-bold mb-1 ${getInflationColor(country.rate2025)}`}>
                    <CountUpNumber
                      endValue={country.rate2025}
                      decimals={1}
                      suffix="%"
                      duration={1500 + index * 200}
                    />
                  </div>
                  <div className="text-xs text-purple-200">2025</div>

                  {selectedCountry === index && (
                    <div className="mt-3 pt-3 border-t border-white/20 animate-fadeIn">
                      <div className="text-xs text-purple-200">2022: {country.rate2022}%</div>
                      <div className={`text-sm font-bold mt-1 ${
                        country.rate2025 < country.rate2022 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {country.rate2025 < country.rate2022 ? '↓' : '↑'}{Math.abs(country.rate2025 - country.rate2022).toFixed(1)}pp
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Search size={24} className="text-blue-400" />
            Erkenntnisse:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">Entwickelte Länder</div>
              <p className="text-purple-200 text-sm">
                Deutschland, USA, Eurozone: Zielbereich um 2% rückt in Reichweite, Erwartungen stabil.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">Schwellenländer</div>
              <p className="text-purple-200 text-sm">
                Wechselkurs und Energiepreise bestimmen den Pfad – Politik muss Vertrauen stärken.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-2">Krisenländer</div>
              <p className="text-purple-200 text-sm">
                Türkei, Argentinien: Strukturelle Defizite, schwache Institutionen, Kapitalflucht.
              </p>
            </div>
          </div>
        </div>

        {/* Exchange regimes */}
        <div ref={regimesRef} className="mb-16 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <ArrowLeftRight size={28} className="text-blue-300" />
            Wechselkursregime & Dollarisation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exchangeRegimes.map(item => (
              <div key={item.title} className="bg-white/10 rounded-xl border border-white/10 p-6">
                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                <p className="text-sm text-purple-100 leading-relaxed mb-3">{item.description}</p>
                <div className="text-xs text-purple-200/80">
                  <span className="font-semibold text-purple-100">Beispiele:</span> {item.example}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Country clusters */}
        <div ref={clustersRef} className="mb-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30">
          <h3 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-3">
            <Shield size={28} className="text-blue-200" />
            Industrieländer vs. Schwellenländer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {countryClusters.map(cluster => (
              <div key={cluster.title} className="bg-white/5 rounded-xl border border-white/10 p-6">
                <h4 className="text-xl font-bold text-white mb-3">{cluster.title}</h4>
                <ul className="space-y-2 text-sm text-purple-100">
                  {cluster.points.map(point => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 inline-block w-2 h-2 rounded-full bg-purple-300" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Inflation Myths & Facts */}
        <div ref={mythsRef} className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Brain size={32} className="text-purple-400" />
            Mythen vs. Fakten
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inflationMythsFacts.map((item, index) => (
              <div
                key={item.myth}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-300"
                onClick={() => setShowMyth(showMyth === index ? null : index)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl">❌</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-red-400 mb-2">Mythos:</h4>
                    <p className="text-red-200 mb-4">{item.myth}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle size={24} className="text-green-400 mt-1" />
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-green-400 mb-2">Fakt:</h4>
                    <p className="text-green-200 mb-4">{item.fact}</p>
                  </div>
                </div>

                {showMyth === index && (
                  <div className="mt-4 p-4 bg-purple-500/20 border border-purple-400/30 rounded-lg animate-fadeIn">
                    <h5 className="font-bold text-purple-300 mb-2 flex items-center gap-2">
                      <Lightbulb size={16} className="text-purple-300" /> Explain like I’m 15
                    </h5>
                    <p className="text-purple-100 text-sm">{item.explanation}</p>
                  </div>
                )}

                <div className="text-center mt-4">
                  <span className="text-xs text-purple-300">
                    {showMyth === index ? 'Weniger anzeigen' : 'Mehr erfahren'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Future Trends */}
        <div ref={trendsRef}>
          <h3 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Sparkles size={32} className="text-purple-400" />
            Zukunft der Inflation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30">
              <div className="mb-4 text-center">
                <Laptop size={48} className="text-blue-400 mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Digitale Währungen</h4>
              <p className="text-blue-200 text-sm mb-4">
                Zentralbank-Digitalwährungen (CBDCs) könnten Geldpolitik präziser machen.
              </p>
              <div className="bg-blue-500/10 rounded-lg p-3">
                <p className="text-blue-100 text-xs">
                  <strong>Potential:</strong> Direktere Transmission durch programmierbare Zahlungen.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
              <div className="mb-4 text-center">
                <Thermometer size={48} className="text-green-400 mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Klimawandel</h4>
              <p className="text-green-200 text-sm mb-4">
                Extremwetter, CO₂-Preise und Energiewende verändern Preisstrukturen langfristig.
              </p>
              <div className="bg-green-500/10 rounded-lg p-3">
                <p className="text-green-100 text-xs">
                  <strong>Herausforderung:</strong> Greenflation durch knappe Rohstoffe und Investitionsbedarf.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
              <div className="mb-4 text-center">
                <Bot size={48} className="text-purple-400 mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">KI & Automatisierung</h4>
              <p className="text-purple-200 text-sm mb-4">
                Künstliche Intelligenz könnte Produktivität erhöhen und Kosten senken.
              </p>
              <div className="bg-purple-500/10 rounded-lg p-3">
                <p className="text-purple-100 text-xs">
                  <strong>Chance:</strong> Effizienzgewinne wirken disinflationär, solange Nachfrage ausgeglichen bleibt.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Summary */}
        <div className="mt-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Star size={28} className="text-yellow-400" />
              Globale Lehren
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-purple-300 mb-3">Was funktioniert:</h4>
                <ul className="text-purple-200 text-sm space-y-2 text-left">
                  <li>• Unabhängige Zentralbanken</li>
                  <li>• Klare Inflationsziele (2%)</li>
                  <li>• Transparente Kommunikation</li>
                  <li>• Rechtzeitiges Handeln</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-purple-300 mb-3">Was schadet:</h4>
                <ul className="text-purple-200 text-sm space-y-2 text-left">
                  <li>• Politische Einflussnahme</li>
                  <li>• Zu spätes Reagieren</li>
                  <li>• Strukturelle Probleme ignorieren</li>
                  <li>• Mangelnde Glaubwürdigkeit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
