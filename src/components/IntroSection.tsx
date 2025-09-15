'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CountUpNumber from './CountUpNumber';
import { Lightbulb } from 'lucide-react';
import SequentialTypewriter from './SequentialTypewriter';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const worldMapRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // no external need for completion flag; kept local-only
  // Removed unused completion state

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Check if all refs are available
      const elements = [titleRef.current, subtitleRef.current, worldMapRef.current, statsRef.current].filter(Boolean);
      if (elements.length === 0) return;

      // Initial setup
      gsap.set(elements, {
        opacity: 0,
        y: 50
      });

      // Animation timeline - only trigger when section is actually visible
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none'
        }
      });

      // Add animations only for existing elements
      if (titleRef.current) {
        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out'
        });
      }

      if (subtitleRef.current) {
        tl.to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out'
        }, '-=0.5');
      }

      if (worldMapRef.current) {
        tl.to(worldMapRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power2.out'
        }, '-=0.3');
      }

      if (statsRef.current) {
        tl.to(statsRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out'
        }, '-=0.5');
      }

      // Removed parallax effect for better scroll performance

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="intro" 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 z-0 pointer-events-none select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49%,rgba(255,255,255,0.03)_50%,transparent_51%)] bg-[length:20px_20px]" />
      </div>

      {/* World Map Background */}
      <div 
        ref={worldMapRef}
        className="absolute inset-0 flex items-center justify-center opacity-20 z-0 pointer-events-none select-none"
      >
        <svg 
          viewBox="0 0 1000 500" 
          className="w-full h-full max-w-4xl"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          {/* Simplified world map paths */}
          <path d="M150 200 L200 180 L250 190 L300 170 L350 180 L400 160 L450 170 L500 150" className="text-blue-400" />
          <path d="M100 250 L150 240 L200 250 L250 230 L300 240 L350 220 L400 230 L450 210" className="text-blue-400" />
          <path d="M200 300 L250 290 L300 300 L350 280 L400 290 L450 270 L500 280" className="text-blue-400" />
          
          {/* Inflation hotspots - reduced animation for performance */}
          <circle cx="200" cy="200" r="8" className="fill-red-500 opacity-80" />
          <circle cx="350" cy="180" r="6" className="fill-yellow-500 opacity-80" />
          <circle cx="450" cy="230" r="7" className="fill-orange-500 opacity-80" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Reserve space to avoid layout shift during typing */}
        <div ref={titleRef} className="min-h-[120px] md:min-h-[160px]">
          <SequentialTypewriter
            texts={[
              'Inflation verstehen',
              'Ursachen, Auswirkungen und Geschichte der Geldentwertung'
            ]}
            speeds={[80, 50]}
            delays={[500, 1000]}
          />
        </div>

        {/* Key Statistics */}
        <div
          ref={statsRef}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-red-400 mb-2">
              <CountUpNumber endValue={6.9} decimals={1} suffix="%" duration={2000} />
            </div>
            <div className="text-blue-200">Deutschland 2022</div>
            <div className="text-sm text-white/60 mt-1">Höchste Inflation seit 1973</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              <CountUpNumber endValue={2.0} decimals={1} suffix="%" duration={1800} />
            </div>
            <div className="text-blue-200">EZB Ziel</div>
            <div className="text-sm text-white/60 mt-1">Preisstabilitätsziel</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-orange-400 mb-2">
              <CountUpNumber endValue={2.2} decimals={1} suffix="%" duration={2200} />
            </div>
            <div className="text-blue-200">Deutschland 2024</div>
            <div className="text-sm text-white/60 mt-1">Rückgang zur Normalität</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-green-400 mb-2">
              <CountUpNumber endValue={1.6} decimals={1} suffix="%" duration={2400} />
            </div>
            <div className="text-blue-200">Reallöhne 2024</div>
            <div className="text-sm text-white/60 mt-1">Erholung der Kaufkraft</div>
          </div>
        </div>

        {/* Definition Box */}
        <div className="mt-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/30">
          <h3 className="text-2xl font-bold text-white mb-4 text-center flex items-center justify-center gap-3">
            <Lightbulb size={28} className="text-yellow-400" />
            Was ist Inflation?
          </h3>
          <p className="text-blue-100 leading-relaxed text-center max-w-4xl mx-auto">
            Inflation ist der <strong>allgemeine Anstieg des Preisniveaus</strong> für Güter und Dienstleistungen
            in einer Volkswirtschaft über einen bestimmten Zeitraum. Sie wird meist als <strong>jährliche
            Veränderungsrate</strong> des Verbraucherpreisindex (VPI) gemessen. Eine moderate Inflation von
            etwa 2% gilt als <strong>Zeichen einer gesunden Wirtschaft</strong>, während zu hohe oder zu
            niedrige Inflation wirtschaftliche Probleme verursachen kann.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-red-500/20 rounded-full" />
      <div className="absolute bottom-32 left-20 w-12 h-12 bg-yellow-500/20 rounded-full" />
    </section>
  );
}
