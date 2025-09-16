'use client';

import React from 'react';

interface NavigationProps {
  currentSection: number;
  onNavigate: (index: number) => void;
  sections: string[];
}

const nameMap: Record<string, string> = {
  '#intro': 'Einführung',
  '#causes': 'Ursachen',
  '#effects': 'Auswirkungen',
  '#measurement': 'Messung',
  '#ecb-policy': 'EZB-Politik',
  '#fiscal': 'Fiskalpolitik',
  '#business': 'Unternehmen',
  '#labour': 'Arbeitsmarkt',
  '#everyday': 'Alltag',
  '#global': 'Global',
  '#history': 'Geschichte',
  '#glossary': 'Glossar',
  '#quiz': 'Quiz',
};

export default function Navigation({ currentSection, onNavigate, sections }: NavigationProps) {

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
        />
      </div>

      {/* Navigation Dots */}
      <nav
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 opacity-100"
      >
        <div className="flex flex-col gap-4">
          {sections.map((section, index) => (
            <button
              key={section}
              onClick={() => onNavigate(index)}
              className={`group relative w-3 h-3 rounded-full transition-all duration-300 ${
                currentSection === index
                  ? 'bg-blue-500 scale-125'
                  : 'bg-white/30 hover:bg-white/50 hover:scale-110'
              }`}
              aria-label={`Gehe zu ${nameMap[section] || 'Sektion'}`}
            >
              {/* Tooltip */}
              <div className={`absolute right-6 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-sm text-white whitespace-nowrap transition-all duration-200 ${
                currentSection === index 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
              }`}>
                {nameMap[section] || 'Sektion'}
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-black/80" />
              </div>
            </button>
          ))}
        </div>
      </nav>

      {/* Section Counter */}
      <div className="fixed bottom-6 left-6 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-sm z-40">
        <span className="text-white/60">Sektion</span>
        <span className="text-white font-semibold ml-2">
          {currentSection + 1} / {sections.length}
        </span>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 md:hidden z-40">
        <div className="flex gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
          <button
            onClick={() => onNavigate(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="p-2 rounded-full bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Vorherige Sektion"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center px-3 text-white text-sm">
            {currentSection + 1} / {sections.length}
          </div>
          
          <button
            onClick={() => onNavigate(Math.min(sections.length - 1, currentSection + 1))}
            disabled={currentSection === sections.length - 1}
            className="p-2 rounded-full bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Nächste Sektion"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
