'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Search, Link } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const glossaryTerms = [
  {
    term: 'Deflation',
    definition: 'Allgemeiner Rückgang des Preisniveaus',
    example: 'Japan in den 1990ern: Preise fielen, Wirtschaft stagnierte',
    category: 'Grundbegriffe'
  },
  {
    term: 'Stagflation',
    definition: 'Hohe Inflation bei gleichzeitig schwachem Wirtschaftswachstum',
    example: 'USA in den 1970ern: 10% Inflation + Rezession',
    category: 'Grundbegriffe'
  },
  {
    term: 'Disinflation',
    definition: 'Verlangsamung der Inflationsrate (aber noch positiv)',
    example: 'Deutschland 2023-2025: Von 5,9% auf 2,2%',
    category: 'Grundbegriffe'
  },
  {
    term: 'Quantitative Lockerung',
    definition: 'Zentralbank kauft Anleihen, um Geld in den Markt zu pumpen',
    example: 'EZB-Programm 2015-2018: 2,6 Billionen Euro',
    category: 'Geldpolitik'
  },
  {
    term: 'Phillips-Kurve',
    definition: 'Theorie: Niedriger Arbeitslosigkeit = höhere Inflation',
    example: 'Vollbeschäftigung führt zu Lohndruck und Preisanstieg',
    category: 'Wirtschaftstheorie'
  },
  {
    term: 'Realzins',
    definition: 'Nominalzins minus Inflationsrate',
    example: '3% Kredit bei 2% Inflation = 1% Realzins',
    category: 'Finanzen'
  },
  {
    term: 'Warenkorb',
    definition: 'Repräsentative Auswahl von Gütern für VPI-Berechnung',
    example: '650 Produkte in Deutschland, gewichtet nach Ausgaben',
    category: 'Messung'
  },
  {
    term: 'Basiseffekt',
    definition: 'Inflationsrate verändert sich durch niedrige Vorjahreswerte',
    example: '2021: Hohe Inflation durch niedrige Corona-Preise 2020',
    category: 'Messung'
  },
  {
    term: 'Kerninflation',
    definition: 'Inflation ohne Energie- und Nahrungsmittelpreise (volatilere Komponenten)',
    example: 'Eurozone 2025: Kerninflation teils höher als Gesamtinflation',
    category: 'Messung'
  },
  {
    term: 'HVPI',
    definition: 'Harmonisierter Verbraucherpreisindex der EU – Grundlage für EZB-Entscheidungen',
    example: 'Vergleichbarkeit zwischen EU-Ländern; abweichend vom deutschen VPI',
    category: 'Messung'
  },
  {
    term: 'BIP-Deflator',
    definition: 'Preisniveauindikator für alle im Inland produzierten Güter/Dienstleistungen',
    example: 'Breiter als der VPI, nützlich für makroökonomische Analysen',
    category: 'Messung'
  },
  {
    term: 'Lohn-Preis-Spirale',
    definition: 'Höhere Preise → höhere Löhne → wiederum höhere Preise',
    example: 'Starke Tarifrunden können Preisdruck verfestigen',
    category: 'Grundbegriffe'
  },
  {
    term: 'Second-Round-Effekte',
    definition: 'Zweit-/Drittrundeneffekte (z. B. Löhne) nach initialen Preisschocks',
    example: 'Energieschock 2022 → spätere Lohnanpassungen',
    category: 'Grundbegriffe'
  },
  {
    term: 'Erwartungsanker',
    definition: 'Geldpolitik stabilisiert Inflationserwartungen (Kommunikation/Guidance)',
    example: 'Klares 2%-Ziel verankert Preissetzung und Lohnverhandlungen',
    category: 'Geldpolitik'
  },
  {
    term: 'Neutralzins (r*)',
    definition: 'Realzins, der weder stimuliert noch bremst (Gleichgewicht)',
    example: 'Dient als Referenz für restriktive/expansive Politik',
    category: 'Geldpolitik'
  },
  {
    term: 'Forward Guidance',
    definition: 'Ankündigungen zur künftigen Zinspfad-Erwartung',
    example: 'Wirkt über Erwartungen bereits vor Zinsschritten',
    category: 'Geldpolitik'
  },
  {
    term: 'QT (Bilanzabbau)',
    definition: 'Quantitative Tightening: Rückführung von Anleihebeständen',
    example: 'Reduziert Liquidität und dämpft Inflation',
    category: 'Geldpolitik'
  },
  {
    term: 'TLTRO',
    definition: 'Gezielte Langfristkredite der EZB an Banken',
    example: 'Pandemie: günstige Konditionen zur Stützung der Kreditvergabe',
    category: 'Geldpolitik'
  },
  {
    term: 'M1/M2/M3',
    definition: 'Geldmengenaggregate: enge/weitere Definitionen (Bargeld, Sicht-/Termineinlagen)',
    example: 'Starkes M3-Wachstum kann Preisdruck signalisieren',
    category: 'Finanzen'
  },
  {
    term: 'Importierte Inflation',
    definition: 'Preisdruck durch teurere Importgüter / Wechselkurs',
    example: 'Teureres Gas/Öl erhöht Verbraucherpreise',
    category: 'Grundbegriffe'
  },
  {
    term: 'Kaufkraftparität (KKP)',
    definition: 'Wechselkurse gleichen langfristig Preisniveaus an',
    example: 'Big Mac Index als anschauliche Approximation',
    category: 'Wirtschaftstheorie'
  },
  {
    term: 'Output-Gap',
    definition: 'Abweichung tatsächlicher von potenzieller Wirtschaftsleistung',
    example: 'Positives Gap → Überhitzung → Preisdruck',
    category: 'Wirtschaftstheorie'
  }
];

const furtherResources = [
  {
    title: 'Deutsche Bundesbank',
    description: 'Offizielle Geldpolitik und Statistiken',
    url: 'bundesbank.de',
    type: 'Institution'
  },
  {
    title: 'Statistisches Bundesamt',
    description: 'Aktuelle Inflationsdaten und VPI',
    url: 'destatis.de',
    type: 'Daten'
  },
  {
    title: 'EZB Economic Bulletin',
    description: 'Tiefgehende Analysen der Eurozone',
    url: 'ecb.europa.eu',
    type: 'Forschung'
  },
  {
    title: 'OECD Inflation Dashboard',
    description: 'Internationale Vergleiche',
    url: 'oecd.org',
    type: 'Global'
  }
];

export default function GlossarySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const glossaryRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Alle', 'Grundbegriffe', 'Geldpolitik', 'Wirtschaftstheorie', 'Finanzen', 'Messung'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([titleRef.current, glossaryRef.current, resourcesRef.current, summaryRef.current], {
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
      .to(glossaryRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5')
      .to(resourcesRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.3')
      .to(summaryRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.5');

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [showAll, setShowAll] = useState(false);
  const filteredTerms = glossaryTerms.filter(term => {
    const matchesCategory = selectedCategory === 'Alle' || term.category === selectedCategory;
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section 
      id="glossary" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 py-20"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 flex items-center justify-center gap-4"
          >
            <BookOpen size={48} className="text-gray-400" />
            <div>
              Glossar &
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-slate-400 block">
                Vertiefung
              </span>
            </div>
          </h2>
          <p className="text-xl text-gray-200 max-w-4xl mx-auto">
            Alle wichtigen Begriffe und weiterführende Ressourcen für Inflation-Experten
          </p>
        </div>

        {/* Glossary */}
        <div ref={glossaryRef} className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <BookOpen size={32} className="text-blue-400" />
            Fachbegriffe erklärt
          </h3>
          
          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Begriff suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Terms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(showAll ? filteredTerms : filteredTerms.slice(0, 8)).map((term, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-xl font-bold text-white">{term.term}</h4>
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full">
                    {term.category}
                  </span>
                </div>
                
                <p className="text-gray-200 mb-4 leading-relaxed">
                  {term.definition}
                </p>
                
                <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
                  <p className="text-blue-100 text-sm">
                    <strong>Beispiel:</strong> {term.example}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredTerms.length > 8 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-colors"
              >
                {showAll ? 'Weniger anzeigen' : `Mehr anzeigen (${filteredTerms.length - 8} weitere)`}
              </button>
            </div>
          )}

          {filteredTerms.length === 0 && (
            <div className="text-center py-12">
              <Search size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Keine Begriffe gefunden. Versuche einen anderen Suchbegriff.</p>
            </div>
          )}
        </div>

        {/* Further Resources */}
        <div ref={resourcesRef} className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Link size={32} className="text-blue-400" />
            Weiterführende Ressourcen
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {furtherResources.map((resource, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-xl font-bold text-white">{resource.title}</h4>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-full">
                    {resource.type}
                  </span>
                </div>
                
                <p className="text-gray-200 mb-4">
                  {resource.description}
                </p>
                
                <a
                  href={`https://${resource.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  <span className="text-sm font-mono">{resource.url}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}
