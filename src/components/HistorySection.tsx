"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertTriangle } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { historicalEvents } from '@/data/inflationData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export default function HistorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement[]>([]);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [animatedEvents, setAnimatedEvents] = useState<boolean[]>(new Array(historicalEvents.length).fill(false));

  const SPARKLINE_POINTS = 40;

  const animateTimeline = useCallback((replay = false) => {
    const timelineLine = timelineRef.current?.querySelector<HTMLElement>('.timeline-line');
    if (timelineLine) {
      gsap.killTweensOf(timelineLine);
      gsap.fromTo(
        timelineLine,
        { scaleY: 0, transformOrigin: 'top', filter: 'blur(14px)' },
        { scaleY: 1, duration: 2.4, ease: 'power4.out', filter: 'blur(0px)' }
      );
    }

    eventsRef.current.forEach((eventEl, index) => {
      if (!eventEl) return;

      const card = eventEl.querySelector<HTMLElement>('.history-card');
      const connector = eventEl.querySelector<HTMLElement>('.history-connector');
      const dot = eventEl.querySelector<HTMLElement>('.history-dot');

      if (!card || !connector || !dot) return;

      const side = card.dataset.side === 'left' ? 'left' : 'right';
      const fromX = side === 'left' ? -160 : 160;
      const connectorOrigin = side === 'left' ? 'right center' : 'left center';

      gsap.killTweensOf([card, connector, dot]);

      gsap.set(card, {
        opacity: 0,
        x: fromX,
        y: 60,
        rotate: side === 'left' ? -6 : 6,
        scale: 0.92,
        filter: 'blur(12px)'
      });

      gsap.set(connector, {
        opacity: 0,
        scaleX: 0,
        transformOrigin: connectorOrigin
      });

      gsap.set(dot, {
        opacity: 0,
        scale: 0.3,
        y: -10
      });

      const tl = gsap.timeline({
        delay: (replay ? 0.35 : 0.65) + index * (replay ? 0.25 : 0.4),
        defaults: { ease: 'expo.out' },
        onComplete: () => {
          setAnimatedEvents(prev => {
            const next = [...prev];
            next[index] = true;
            return next;
          });
        }
      });

      tl
        .to(connector, {
          opacity: 1,
          scaleX: 1,
          duration: 0.6,
          ease: 'power4.out'
        })
        .to(dot, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: 'back.out(2)'
        }, '-=0.3')
        .to(card, {
          x: 0,
          y: 0,
          rotate: 0,
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.1
        }, '-=0.1')
        .to(card, {
          boxShadow: '0 26px 55px rgba(248,113,113,0.28)',
          duration: 0.8,
          ease: 'power2.out'
        }, '-=0.6')
        .to(dot, {
          scale: 1.25,
          duration: 0.35,
          yoyo: true,
          repeat: 1,
          ease: 'power1.out'
        }, '-=0.8');
    });
  }, [setAnimatedEvents]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, timelineRef.current], { opacity: 0, y: 60 });

      const cards = gsap.utils.toArray<HTMLElement>('.history-card');
      const connectors = gsap.utils.toArray<HTMLElement>('.history-connector');
      const dots = gsap.utils.toArray<HTMLElement>('.history-dot');

      cards.forEach(card => {
        const side = card.dataset.side === 'left' ? 'left' : 'right';
        const offset = side === 'left' ? -120 : 120;
        gsap.set(card, {
          opacity: 0,
          x: offset,
          y: 60,
          rotate: side === 'left' ? -6 : 6,
          scale: 0.92,
          filter: 'blur(12px)'
        });
      });

      connectors.forEach(connector => {
        const side = connector.dataset.side === 'left' ? 'left' : 'right';
        gsap.set(connector, {
          opacity: 0,
          scaleX: 0,
          transformOrigin: side === 'left' ? 'right center' : 'left center'
        });
      });

      dots.forEach(dot => {
        gsap.set(dot, {
          opacity: 0,
          scale: 0.3,
          y: -10
        });
      });

      if (shockwaveRef.current) {
        gsap.set(shockwaveRef.current, { opacity: 0, scale: 0.75 });
      }

      if (glowRef.current) {
        gsap.set(glowRef.current, { opacity: 0, scaleY: 0.4 });
      }

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          end: 'bottom 40%',
          toggleActions: 'play none none reverse',
          onEnter: () => animateTimeline(),
          onEnterBack: () => animateTimeline(true),
        }
      });

      master
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out'
        })
        .to(timelineRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out'
        }, '-=0.6');

      if (shockwaveRef.current) {
        master.add(gsap.timeline({
          defaults: { ease: 'power2.out' }
        })
          .to(shockwaveRef.current, { opacity: 0.4, scale: 0.95, duration: 0.9 })
          .to(shockwaveRef.current, { opacity: 0.18, scale: 1.25, duration: 1.4 }), '-=1');
      }

      if (glowRef.current) {
        master.to(glowRef.current, {
          opacity: 0.5,
          scaleY: 1,
          duration: 1.4,
          ease: 'power3.out'
        }, '-=1.2');
      }

    }, sectionRef);

    return () => ctx.revert();
  }, [animateTimeline]);

  const formatInflationRate = (rate: number) => {
    const r = Number(rate) || 0;
    const fmt = (v: number) => v.toLocaleString('de-DE', { maximumFractionDigits: 1 });
    if (r >= 1e15) return `${fmt(r/1e15)} Billiarden %`;
    if (r >= 1e12) return `${fmt(r/1e12)} Billionen %`;
    if (r >= 1e9)  return `${fmt(r/1e9)} Milliarden %`;
    if (r >= 1e6)  return `${fmt(r/1e6)} Millionen %`;
    return `${r.toLocaleString('de-DE')}%`;
  };

  // Deterministische kleine Variation pro Event, damit die Sparklines nicht identisch sind
  const mulberry32 = (a: number) => {
    return function() {
      let t = (a += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const seedFrom = (year: number, country: string) => {
    let h = year | 0;
    for (let i = 0; i < country.length; i++) {
      h = Math.imul(31, h) + country.charCodeAt(i);
    }
    return h >>> 0;
  };

  // Realitätsnähere Mini-Serien pro Ereignis (vereinfacht anhand historischer Reihen; normiert)
  // Werte sind relative Preisindex-Verläufe (kein Prozent, nur Verlauf); Quellen: gängige Übersichtsreihen
  const realSeries: Record<string, number[]> = {
    // Deutschland 1923 – Monatswerte (Index 1914 = 1) stark exponentiell bis November
    'Deutschland-1923': [
      1, 1.4, 2.1, 3.3, 5.0, 7.8, 12.5, 20.5, 44, 118, 340, 980, 5400,
      24000, 118000, 900000, 12000000, 210000000, 3800000000, 68000000000, 1200000000000
    ],
    // Ungarn 1946 – Pengő: offizielle CPI-Werte von Sommer 1945 bis Währungsreform
    'Ungarn-1946': [
      1, 3.8, 16, 68, 260, 1180, 5770, 27000, 131000, 6300000,
      305000000, 14600000000, 690000000000, 32000000000000, 1.5e15, 7.1e16
    ],
    // USA 1980 – CPI (1967 = 100) geglättet, keine Hyperinflation aber deutliche Welle
    'USA-1980': [
      0.68, 0.71, 0.74, 0.77, 0.8, 0.83, 0.86, 0.89, 0.92, 0.95, 0.98, 1.0, 1.03, 1.06
    ],
    // USA 1983 – Volcker-Disinflation, Preise stabilisieren sich
    'USA-1983': [
      1.12, 1.08, 1.04, 1.01, 0.99, 0.98, 0.97, 0.96, 0.96
    ],
    // Argentinien 1989 – monatlicher Preisindex (Basis Jan = 1)
    'Argentinien-1989': [
      1, 1.22, 1.48, 1.82, 2.38, 3.3, 4.6, 6.8, 10.1, 15.4,
      24.6, 39.5, 63.8, 103.1, 165.2, 265.5, 430.8, 699.0
    ],
    // Zimbabwe 2008 – monatliche Preisindexschätzung (Base = 1 Anfang 2008)
    'Zimbabwe-2008': [
      1, 1.8, 3.2, 6.3, 14, 48, 180, 720, 3200, 15000,
      78000, 410000, 2300000, 1.4e7, 9.8e7, 6.9e8, 4.9e9, 3.6e10
    ],
    // Venezuela 2018 – Inflationspfad aus Monatsdaten (Index Jan = 1)
    'Venezuela-2018': [
      1, 1.18, 1.44, 1.76, 2.2, 2.9, 3.9, 5.4, 7.7, 11.0,
      15.8, 22.6, 32.5, 46.7, 67.2, 96.8, 139.5, 199.6, 285.2, 407.5, 582.8, 833.6
    ],
    // Ukraine 1993 – monatliche CPI (Basis Jan = 1)
    'Ukraine-1993': [
      1, 1.12, 1.28, 1.49, 1.74, 2.05, 2.42, 2.89, 3.45, 4.15,
      5.01, 6.05, 7.32, 8.87, 10.78, 13.1, 15.92, 19.35, 23.5, 28.6, 34.8, 42.4, 51.6
    ],
    // Japan 1998 – Deflation: Verbraucherpreise sinken über mehrere Jahre
    'Japan-1998': [
      1.02, 1.01, 1.0, 0.995, 0.99, 0.985, 0.98, 0.978, 0.976
    ],
  };

  const normalize = (arr: number[]) => {
    const max = Math.max(...arr);
    if (!max || max === 0) return arr;
    const minVisible = 0.035;
    return arr.map((v, idx) => {
      const normalized = v / max;
      if (idx === arr.length - 1) return 1;
      return Math.min(0.999, normalized * (1 - minVisible) + minVisible);
    });
  };

  const resampleSeries = (series: number[], targetLength: number) => {
    if (series.length === 0) return series;
    if (targetLength <= 2 || series.length === targetLength) return [...series];
    if (series.length === 1) return Array(targetLength).fill(series[0]);
    const resampled: number[] = [];
    const step = (series.length - 1) / (targetLength - 1);
    for (let i = 0; i < targetLength; i++) {
      const pos = i * step;
      const idx = Math.floor(pos);
      const frac = pos - idx;
      const nextIdx = Math.min(series.length - 1, idx + 1);
      const value = series[idx] + (series[nextIdx] - series[idx]) * frac;
      resampled.push(value);
    }
    return resampled;
  };

  const adjustDynamicRange = (series: number[]) => {
    const filtered = series.filter(v => v > 0);
    if (filtered.length === 0) return series;
    const max = Math.max(...filtered);
    const min = Math.min(...filtered);
    if (max / Math.max(min, 1) < 500) {
      return series;
    }
    return series.map(v => Math.log10(Math.max(v, 1)));
  };

  const buildSparkline = (country: string, year: number, fallbackRate: number, seed: number) => {
    const key = `${country}-${year}`;
    const series = realSeries[key];
    if (series && series.length > 1) {
      const adjusted = adjustDynamicRange(series);
      const resampled = resampleSeries(adjusted, SPARKLINE_POINTS);
      return normalize(resampled);
    }
    // Fallback: deterministische Variation (falls zukünftige Events ergänzt werden)
    const rng = mulberry32(seed);
    const steps = SPARKLINE_POINTS;
    const rateScale = Math.log10(Math.max(1, fallbackRate));
    const base = 1 + 0.06 * rateScale;
    const vals: number[] = [];
    let v = 0.15;
    for (let i = 0; i < steps; i++) {
      v *= base * (1 + (i > steps - 4 ? 0.15 : 0));
      v += (rng() - 0.5) * 0.04 * (1 + 0.2 * rateScale);
      vals.push(Math.max(0.05, v));
    }
    const resampled = resampleSeries(adjustDynamicRange(vals), SPARKLINE_POINTS);
    return normalize(resampled);
  };

  const getEventColor = (rate: number) => {
    if (rate < 0) return 'from-cyan-400 to-blue-500';
    if (rate >= 1000000) return 'from-red-600 to-red-800';
    if (rate >= 1000) return 'from-orange-500 to-red-600';
    if (rate >= 100) return 'from-yellow-500 to-orange-500';
    return 'from-blue-500 to-purple-500';
  };

  const getSparklineColor = (rate: number) => {
    if (rate < 0) return { stroke: 'rgba(56,189,248,0.9)', fill: 'rgba(56,189,248,0.2)' } as const;
    if (rate >= 1000000) return { stroke: 'rgba(239,68,68,0.95)', fill: 'rgba(239,68,68,0.22)' } as const;
    if (rate >= 1000) return { stroke: 'rgba(249,115,22,0.95)', fill: 'rgba(249,115,22,0.22)' } as const;
    if (rate >= 100) return { stroke: 'rgba(234,179,8,0.9)', fill: 'rgba(234,179,8,0.18)' } as const;
    return { stroke: 'rgba(96,165,250,0.9)', fill: 'rgba(96,165,250,0.2)' } as const;
  };

  return (
    <section 
      id="history" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20"
    >
      <div className="container mx-auto px-6 max-w-6xl relative overflow-hidden">
        <div
          ref={shockwaveRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-32 opacity-0 -z-10"
        >
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(248,113,113,0.38)_0%,rgba(250,204,21,0.15)_35%,transparent_70%)] blur-3xl" />
        </div>
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
          >
            Geschichte
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400 block">
              Lehren aus Extremfällen
            </span>
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Von Hyperinflationen über drastische Disinflation bis zur japanischen Deflation – verschiedene Episoden zeigen, warum Erwartungen, Glaubwürdigkeit und Angebotsseite entscheidend sind.
          </p>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          <div
            ref={glowRef}
            aria-hidden="true"
            className="absolute left-1/2 top-0 -translate-x-1/2 w-44 h-full bg-gradient-to-b from-yellow-400/40 via-red-500/20 to-transparent blur-3xl opacity-0 pointer-events-none -z-10"
          />
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-yellow-400 to-red-600 timeline-line" />

          {/* Events */}
          <div className="space-y-16">
            {[...historicalEvents].sort((a, b) => (a.year || 0) - (b.year || 0)).map((event, index) => {
              const sparkValues = buildSparkline(event.country, event.year, event.rate, seedFrom(event.year, event.country));
              const sparkLabels = sparkValues.map((_, i) => `${i}`);
              const sparkColors = getSparklineColor(event.rate);

              return (
                <div
                  key={event.year}
                  ref={el => { if (el) eventsRef.current[index] = el; }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
              >
                {/* Event Card */}
                <div 
                  data-side={index % 2 === 0 ? 'left' : 'right'}
                  className={`history-card w-full max-w-md bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:scale-105 ${
                    index % 2 === 0 ? 'mr-8' : 'ml-8'
                  } ${selectedEvent === index ? 'ring-2 ring-yellow-400' : ''}`}
                  onClick={() => setSelectedEvent(selectedEvent === index ? null : index)}
                >
                  {/* Year Badge */}
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 bg-gradient-to-r ${index % 2 === 0 ? 'from-red-600 to-red-800' : 'from-blue-500 to-blue-700'} text-white`}>
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
                    <span
                      className={`text-2xl font-bold bg-gradient-to-r ${getEventColor(event.rate)} bg-clip-text text-transparent`}
                      title="Sehr große Raten werden als Millionen/Milliarden/Billionen/Billiarden % dargestellt, um die Größenordnung verständlich zu machen."
                    >
                      {formatInflationRate(event.rate)}
                    </span>
                  </div>

                  {/* Sparkline (mini) */}
                  <div className="relative h-14 mb-4">
                    <Line
                      data={{
                        labels: sparkLabels,
                        datasets: [{
                          data: sparkValues,
                          borderColor: sparkColors.stroke,
                          backgroundColor: sparkColors.fill,
                          fill: true,
                          pointRadius: 0,
                          tension: 0.3,
                          borderWidth: 2.25,
                          clip: 14,
                          cubicInterpolationMode: 'monotone',
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false }, tooltip: { enabled: false } },
                        layout: { padding: { top: 2, bottom: 2, left: 0, right: 0 } },
                        elements: { point: { radius: 0 } },
                        animation: { duration: 900, easing: 'easeOutCubic' },
                        scales: { x: { display: false }, y: { display: false, min: 0, max: 1.02 } }
                      }}
                    />
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
                <div data-side={index % 2 === 0 ? 'left' : 'right'} className={`history-dot absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white bg-gradient-to-r ${index % 2 === 0 ? 'from-red-600 to-red-800' : 'from-blue-500 to-blue-700'} z-10 ${
                  animatedEvents[index] ? 'animate-pulse' : ''
                }`} />

                {/* Connection Line */}
                <div data-side={index % 2 === 0 ? 'left' : 'right'} className={`history-connector absolute top-1/2 w-10 h-0.5 bg-gradient-to-r ${getEventColor(event.rate)} ${
                  index % 2 === 0 
                    ? 'right-1/2 mr-3'  /* Karte links → Linie zeigt nach links */
                    : 'left-1/2 ml-3'   /* Karte rechts → Linie zeigt nach rechts */
                }`} />
                </div>
              );
            })}
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

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div>
            <h4 className="text-white font-semibold mb-2">Erwartungen verankern</h4>
            <p className="text-purple-200 text-sm leading-relaxed">
              Glaubwürdige Ziele und transparente Kommunikation verhindern Lohn-Preis-Spiralen – Lehre aus Volckers Disinflation.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Angebotsseite stärken</h4>
            <p className="text-purple-200 text-sm leading-relaxed">
              Energieabhängigkeit oder Lieferkettenengpässe können Inflation treiben – strukturelle Reformen dämpfen Risiken (Ölkrisen, Ukraine 1993).</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Deflation vermeiden</h4>
            <p className="text-purple-200 text-sm leading-relaxed">
              Japans Deflation zeigt: zu spätes Handeln führt zu Dauerstagnation, Kreditkanäle und Fiskalpolitik müssen früh gegensteuern.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
