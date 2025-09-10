'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertTriangle } from 'lucide-react';
import { historicalEvents } from '@/data/inflationData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HistorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement[]>([]);
  
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [animatedEvents, setAnimatedEvents] = useState<boolean[]>(new Array(historicalEvents.length).fill(false));

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([titleRef.current, timelineRef.current], {
        opacity: 0,
        y: 50
      });

      gsap.set(eventsRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 30
      });

      // Main animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 40%',
          toggleActions: 'play none none reverse',
          onEnter: () => animateTimeline(),
        }
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      })
      .to(timelineRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5');

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const animateTimeline = () => {
    // Animate timeline line
    gsap.fromTo('.timeline-line', 
      { scaleY: 0 },
      { 
        scaleY: 1, 
        duration: 2, 
        ease: 'power2.out',
        transformOrigin: 'top'
      }
    );

    // Animate events one by one
    eventsRef.current.forEach((eventEl, index) => {
      if (eventEl) {
        gsap.to(eventEl, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          delay: 0.5 + index * 0.3,
          ease: 'back.out(1.7)',
          onComplete: () => {
            setAnimatedEvents(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        });
      }
    });
  };

  const formatInflationRate = (rate: number) => {
    if (rate >= 1000000) {
      return `${(rate / 1000000).toFixed(0)}M%`;
    } else if (rate >= 1000) {
      return `${(rate / 1000).toFixed(0)}K%`;
    } else {
      return `${rate}%`;
    }
  };

  const getEventColor = (rate: number) => {
    if (rate >= 1000000) return 'from-red-600 to-red-800';
    if (rate >= 1000) return 'from-orange-500 to-red-600';
    if (rate >= 100) return 'from-yellow-500 to-orange-500';
    return 'from-blue-500 to-purple-500';
  };

  return (
    <section 
      id="history" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
          >
            Historische
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400 block">
              Hyperinflation
            </span>
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Extreme Beispiele aus der Geschichte zeigen, wie verheerend unkontrollierte Inflation sein kann
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-yellow-400 to-red-600 timeline-line" />

          {/* Events */}
          <div className="space-y-16">
            {historicalEvents.map((event, index) => (
              <div
                key={event.year}
                ref={el => { if (el) eventsRef.current[index] = el; }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Event Card */}
                <div 
                  className={`w-full max-w-md bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:scale-105 ${
                    index % 2 === 0 ? 'mr-8' : 'ml-8'
                  } ${selectedEvent === index ? 'ring-2 ring-yellow-400' : ''}`}
                  onClick={() => setSelectedEvent(selectedEvent === index ? null : index)}
                >
                  {/* Year Badge */}
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 bg-gradient-to-r ${getEventColor(event.rate)} text-white`}>
                    {event.year}
                  </div>

                  {/* Country & Title */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {event.country}
                  </h3>
                  <h4 className="text-lg text-purple-200 mb-3">
                    {event.title}
                  </h4>

                  {/* Inflation Rate */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm text-purple-200">Inflationsrate:</span>
                    <span className={`text-2xl font-bold bg-gradient-to-r ${getEventColor(event.rate)} bg-clip-text text-transparent`}>
                      {formatInflationRate(event.rate)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-purple-200 text-sm leading-relaxed mb-4">
                    {event.description}
                  </p>

                  {/* Expandable Details */}
                  {selectedEvent === index && (
                    <div className="mt-4 pt-4 border-t border-white/20 animate-fadeIn">
                      <div className="bg-white/5 rounded-lg p-4">
                        <h5 className="font-semibold text-yellow-400 mb-2">Auswirkungen:</h5>
                        <p className="text-purple-200 text-sm leading-relaxed">
                          {event.impact}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Click Indicator */}
                  <div className="flex items-center justify-center mt-4 text-xs text-purple-300">
                    <span>Klicken für Details</span>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white bg-gradient-to-r ${getEventColor(event.rate)} z-10 ${
                  animatedEvents[index] ? 'animate-pulse' : ''
                }`} />

                {/* Connection Line */}
                <div className={`absolute top-1/2 w-8 h-0.5 bg-gradient-to-r ${getEventColor(event.rate)} ${
                  index % 2 === 0 
                    ? 'left-1/2 ml-3' 
                    : 'right-1/2 mr-3'
                }`} />
              </div>
            ))}
          </div>
        </div>

        {/* Summary Box */}
        <div className="mt-16 bg-gradient-to-r from-red-500/20 to-yellow-500/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <AlertTriangle size={28} className="text-red-400" />
              Lehren aus der Geschichte
            </h3>
            <p className="text-purple-200 leading-relaxed max-w-4xl mx-auto">
              Hyperinflation entsteht meist durch politische Instabilität, Kriege oder extreme Geldpolitik. 
              Die Folgen sind verheerend: Ersparnisse werden vernichtet, die Wirtschaft kollabiert, 
              und oft muss eine neue Währung eingeführt werden. Moderne Zentralbanken haben aus 
              diesen Fehlern gelernt und setzen auf Preisstabilität als oberstes Ziel.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
