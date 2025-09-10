'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, Search, Lightbulb, Laptop, Thermometer, Brain, Map, CheckCircle, Bot, Star, Sparkles } from 'lucide-react';
import CountUpNumber from './CountUpNumber';
import { globalInflationData, inflationMythsFacts } from '@/data/inflationData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GlobalPerspectiveSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const worldMapRef = useRef<HTMLDivElement>(null);
  const mythsRef = useRef<HTMLDivElement>(null);
  const trendsRef = useRef<HTMLDivElement>(null);

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [showMyth, setShowMyth] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([titleRef.current, worldMapRef.current, mythsRef.current, trendsRef.current], {
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
      .to(worldMapRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5')
      .to(mythsRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.3')
      .to(trendsRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.5');

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

  return (
    <section 
      id="global" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900 py-20"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
          >
            <Globe size={28} className="text-blue-400" /> Inflation
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 block">
              weltweit
            </span>
          </h2>
          <p className="text-xl text-purple-200 max-w-4xl mx-auto">
            Wie sich Inflation global unterscheidet und was wir daraus lernen können
          </p>
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
                key={index}
                className={`cursor-pointer transition-all duration-300 rounded-xl p-4 border ${
                  selectedCountry === index 
                    ? 'scale-105 bg-white/15 border-purple-400' 
                    : `${getInflationBgColor(country.rate2025)} hover:scale-102`
                }`}
                onClick={() => setSelectedCountry(selectedCountry === index ? null : index)}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{country.flag}</div>
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
                        {country.rate2025 < country.rate2022 ? '↓' : '↑'}
                        {Math.abs(country.rate2025 - country.rate2022).toFixed(1)}pp
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Search size={24} className="text-blue-400" />
              Erkenntnisse:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">Entwickelte Länder</div>
                <p className="text-purple-200 text-sm">
                  Deutschland, USA, EU: Inflation unter Kontrolle (2-3%)
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">Schwellenländer</div>
                <p className="text-purple-200 text-sm">
                  Höhere Volatilität, aber meist rückläufig
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400 mb-2">Krisenländer</div>
                <p className="text-purple-200 text-sm">
                  Türkei, Argentinien: Strukturelle Probleme
                </p>
              </div>
            </div>
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
                key={index}
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
                    <h5 className="font-bold text-purple-300 mb-2">💡 Erklärung:</h5>
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
                Zentralbank-Digitalwährungen (CBDCs) könnten Geldpolitik präziser machen
              </p>
              <div className="bg-blue-500/10 rounded-lg p-3">
                <p className="text-blue-100 text-xs">
                  <strong>Potential:</strong> Direktere Inflationskontrolle durch programmierbare Geldpolitik
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
              <div className="mb-4 text-center">
                <Thermometer size={48} className="text-green-400 mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Klimawandel</h4>
              <p className="text-green-200 text-sm mb-4">
                Extremwetter und Energiewende beeinflussen Preise langfristig
              </p>
              <div className="bg-green-500/10 rounded-lg p-3">
                <p className="text-green-100 text-xs">
                  <strong>Herausforderung:</strong> &quot;Greenflation&quot; durch teure grüne Technologien
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30">
              <div className="mb-4 text-center">
                <Bot size={48} className="text-purple-400 mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">KI & Automatisierung</h4>
              <p className="text-purple-200 text-sm mb-4">
                Künstliche Intelligenz könnte Produktionskosten senken
              </p>
              <div className="bg-purple-500/10 rounded-lg p-3">
                <p className="text-purple-100 text-xs">
                  <strong>Chance:</strong> Effizienzgewinne könnten Inflation dämpfen
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
