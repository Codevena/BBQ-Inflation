'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HelpCircle } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const faqs = [
  {
    q: 'Warum fühlt sich Inflation höher an als gemessen?',
    a: 'Individuelle Warenkörbe weichen vom VPI ab (z. B. hoher Energie- oder Mietanteil). Saliente Preiserhöhungen werden stärker erinnert. Der VPI ist ein Durchschnitt – dein persönlicher Korb kann teurer sein.'
  },
  {
    q: 'Ist Deflation gut, weil alles billiger wird?',
    a: 'Anhaltende Deflation dämpft Nachfrage und Investitionen (Käufe werden aufgeschoben), erhöht die reale Schuldenlast und kann Rezessionen verstärken.'
  },
  {
    q: 'Soll ich „schnell noch“ kaufen, wenn Preise steigen?',
    a: 'Nur bei echten Bedarfen. Vorziehen kann sinnvoll sein, aber Panikkäufe sind riskant. Budget, Haltbarkeit und Alternativen prüfen.'
  },
  {
    q: 'Warum steigen Zinsen, wenn Inflation hoch ist?',
    a: 'Höhere Leitzinsen verteuern Kredite und dämpfen Nachfrage. So sollen Preisdruck und Erwartungen gesenkt werden. Die Wirkung greift mit Verzögerung.'
  },
  {
    q: 'Warum ist Energie so wichtig für die Rate?',
    a: 'Energie hat hohes Gewicht und wirkt als Kostentreiber in vielen Gütern. Schwankungen schlagen daher überproportional durch.'
  }
];

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, listRef.current], { opacity: 0, y: 40 });
      gsap.to(titleRef.current, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });
      gsap.to(listRef.current, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" ref={sectionRef} className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 py-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 flex items-center justify-center gap-3">
            <HelpCircle size={40} className="text-blue-400" />
            Häufige Fragen (FAQ)
          </h2>
          <p className="text-lg text-gray-300">Kurz, prägnant und alltagstauglich beantwortet</p>
        </div>

        <div ref={listRef} className="space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <button
                className="w-full text-left px-5 py-4 flex items-center justify-between"
                onClick={() => setOpen(open === idx ? null : idx)}
              >
                <span className="text-white font-semibold">{item.q}</span>
                <span className="text-gray-300">{open === idx ? '–' : '+'}</span>
              </button>
              {open === idx && (
                <div className="px-5 pb-5 text-gray-200 text-sm leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

