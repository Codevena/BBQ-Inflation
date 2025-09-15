'use client';

import { useEffect } from 'react';
import { useLenis, useKeyboardNavigation } from '@/lib/hooks';
import { BarChart3, ArrowRight, ArrowLeft } from 'lucide-react';
import IntroSection from '@/components/IntroSection';
import CausesSection from '@/components/CausesSection';
import EffectsSection from '@/components/EffectsSection';
import MeasurementSection from '@/components/MeasurementSection';
import ECBPolicySection from '@/components/ECBPolicySection';
import InflationEverydaySection from '@/components/InflationEverydaySection';
import GlobalPerspectiveSection from '@/components/GlobalPerspectiveSection';
import HistorySection from '@/components/HistorySection';
import GlossarySection from '@/components/GlossarySection';
import QuizSection from '@/components/QuizSection';
import Navigation from '@/components/Navigation';

const sections = ['#intro', '#causes', '#effects', '#measurement', '#ecb-policy', '#everyday', '#global', '#history', '#glossary', '#quiz'];

export default function Home() {
  // initialize Lenis smooth scroll without binding unused var
  useLenis();
  const { currentSection, navigateToSection } = useKeyboardNavigation(sections);

  useEffect(() => {
    // Preload data
    fetch('/api/inflation?type=all')
      .then(res => res.json())
      .then(data => console.log('Data preloaded:', data))
      .catch(err => console.error('Failed to preload data:', err));
  }, []);

  return (
    <main className="relative">
      {/* Fixed Header with Presentation Button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-end">
          <a
            href="/presentation"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg border border-white/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <BarChart3 size={20} />
            Zur Präsentation
          </a>
        </div>
      </header>

      {/* Navigation */}
      <Navigation
        currentSection={currentSection}
        onNavigate={navigateToSection}
        sections={sections}
      />

      {/* Sections - with top padding for fixed header */}
      <div className="pt-20">
        <IntroSection />
      <CausesSection />
      <EffectsSection />
      <MeasurementSection />
      <ECBPolicySection />
      <InflationEverydaySection />
      <GlobalPerspectiveSection />
      <HistorySection />
      <GlossarySection />
      <QuizSection />
      </div>

      {/* Footer */}
      <footer className="bg-slate-800/50 backdrop-blur-sm border-t border-white/10 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="text-white/60 text-sm">
            © 2025 Markus Wiesecke
          </div>
        </div>
      </footer>

      {/* Keyboard Instructions */}
      <div className="fixed bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-sm z-50">
        <div className="flex items-center gap-2 text-white/80">
          <kbd className="px-2 py-1 bg-white/20 rounded text-xs flex items-center gap-1">
            <ArrowRight size={12} />
          </kbd>
          <span>Nächste Sektion</span>
        </div>
        <div className="flex items-center gap-2 text-white/80 mt-1">
          <kbd className="px-2 py-1 bg-white/20 rounded text-xs flex items-center gap-1">
            <ArrowLeft size={12} />
          </kbd>
          <span>Vorherige Sektion</span>
        </div>
      </div>
    </main>
  );
}
