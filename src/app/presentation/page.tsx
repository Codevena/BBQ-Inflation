'use client';

import { useState, useEffect, useCallback } from 'react';
import { inflationRatesGermany, inflationCauses, historicalEvents, priceExamples, inflationByCategory, realWageData } from '@/data/inflationData';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const slides = [
  'title',
  'definition',
  'statistics',
  'causes-intro',
  'causes-chart',
  'effects-intro',
  'effects-prices',
  'measurement-intro',
  'measurement-categories',
  'ecb-policy',
  'history-intro',
  'history-timeline',
  'key-takeaways',
  'summary',
  'thanks'
];

export default function PresentationMode() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          setCurrentSlide(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentSlide(slides.length - 1);
          break;
        case 'n':
        case 'N':
          e.preventDefault();
          setShowNotes(!showNotes);
          break;
        case 'Escape':
          e.preventDefault();
          window.location.href = '/';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, showNotes]);

  const renderSlide = () => {
    const slideType = slides[currentSlide];

    switch (slideType) {
      case 'title':
        return (
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-8">
              📈 Inflation verstehen
            </h1>
            <p className="text-2xl text-blue-200 mb-12">
              Ursachen, Auswirkungen und Geschichte
            </p>
            <div className="grid grid-cols-4 gap-8">
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-red-400">6.9%</div>
                <div className="text-blue-200">Deutschland 2022</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-yellow-400">2.0%</div>
                <div className="text-blue-200">EZB Ziel</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-green-400">2.2%</div>
                <div className="text-blue-200">Deutschland 2024</div>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <div className="text-3xl font-bold text-orange-400">-4.3%</div>
                <div className="text-blue-200">Reallöhne 2022</div>
              </div>
            </div>
          </div>
        );

      case 'definition':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              💡 Was ist Inflation?
            </h1>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-12 border border-blue-400/30">
              <p className="text-2xl text-blue-100 leading-relaxed mb-8">
                Inflation ist der <strong className="text-white">allgemeine Anstieg des Preisniveaus</strong> für 
                Güter und Dienstleistungen in einer Volkswirtschaft über einen bestimmten Zeitraum.
              </p>
              <div className="grid grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-bold text-white mb-2">Messung</h3>
                  <p className="text-blue-200">Verbraucherpreisindex (VPI)</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-white mb-2">Ziel</h3>
                  <p className="text-blue-200">2% jährlich (EZB)</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">⚖️</div>
                  <h3 className="text-xl font-bold text-white mb-2">Balance</h3>
                  <p className="text-blue-200">Weder zu hoch noch zu niedrig</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'statistics':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              📊 Deutschland: Inflationsentwicklung
            </h1>
            <div className="bg-white/5 rounded-2xl p-8 mb-8">
              <div className="h-96">
                <Line 
                  data={{
                    labels: inflationRatesGermany.map(item => item.year.toString()),
                    datasets: [{
                      label: 'Inflationsrate (%)',
                      data: inflationRatesGermany.map(item => item.rate),
                      borderColor: '#EF4444',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      borderWidth: 4,
                      pointRadius: 8,
                      fill: true,
                      tension: 0.4,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { ticks: { color: 'white', font: { size: 16 } } },
                      y: { ticks: { color: 'white', font: { size: 16 } }, beginAtZero: true }
                    }
                  }}
                />
              </div>
            </div>
            <p className="text-xl text-blue-200">
              <strong className="text-red-400">2022:</strong> Ukraine-Krieg führte zu Energiekrise → 6,9% Inflation
            </p>
          </div>
        );

      case 'causes-intro':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              🔍 Was verursacht Inflation?
            </h1>
            <div className="grid grid-cols-2 gap-12">
              <div className="bg-red-500/20 rounded-2xl p-8 border border-red-400/30">
                <h2 className="text-3xl font-bold text-red-400 mb-6">Nachfrageinflation</h2>
                <p className="text-xl text-red-100 mb-4">
                  &quot;Zu viel Geld jagt zu wenige Güter&quot;
                </p>
                <ul className="text-left text-red-200 space-y-2">
                  <li>• Post-Corona Nachholeffekte</li>
                  <li>• Niedrigzinspolitik</li>
                  <li>• Staatliche Konjunkturpakete</li>
                </ul>
              </div>
              <div className="bg-orange-500/20 rounded-2xl p-8 border border-orange-400/30">
                <h2 className="text-3xl font-bold text-orange-400 mb-6">Angebotsinflation</h2>
                <p className="text-xl text-orange-100 mb-4">
                  &quot;Produktionskosten steigen&quot;
                </p>
                <ul className="text-left text-orange-200 space-y-2">
                  <li>• Lieferkettenprobleme</li>
                  <li>• Energiekrise (Ukraine-Krieg)</li>
                  <li>• Rohstoffknappheit</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'causes-chart':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              📊 Inflationsursachen im Detail
            </h1>
            <div className="grid grid-cols-2 gap-12 items-center">
              <div className="bg-white/5 rounded-2xl p-8">
                <div className="h-96">
                  <Doughnut 
                    data={{
                      labels: inflationCauses.map(cause => cause.category),
                      datasets: [{
                        data: inflationCauses.map(cause => cause.percentage),
                        backgroundColor: inflationCauses.map(cause => cause.color),
                        borderWidth: 3,
                        borderColor: '#1e293b'
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: 'white',
                          bodyColor: 'white'
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-4">
                {inflationCauses.map((cause, index) => (
                  <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: cause.color }}
                      />
                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-white text-lg">{cause.category}</h3>
                        <p className="text-blue-200 text-sm">{cause.description}</p>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: cause.color }}>
                        {cause.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'effects-intro':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              💸 Auswirkungen der Inflation
            </h1>
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-red-500/20 rounded-2xl p-8 border border-red-400/30">
                <div className="text-4xl mb-4">💰</div>
                <h2 className="text-2xl font-bold text-red-400 mb-4">Kaufkraftverlust</h2>
                <p className="text-red-100">Geld wird weniger wert</p>
              </div>
              <div className="bg-yellow-500/20 rounded-2xl p-8 border border-yellow-400/30">
                <div className="text-4xl mb-4">💼</div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">Reallöhne</h2>
                <p className="text-yellow-100">Löhne vs. Preissteigerung</p>
              </div>
              <div className="bg-blue-500/20 rounded-2xl p-8 border border-blue-400/30">
                <div className="text-4xl mb-4">🏦</div>
                <h2 className="text-2xl font-bold text-blue-400 mb-4">Sparer</h2>
                <p className="text-blue-100">Niedrigzinsen = Verluste</p>
              </div>
            </div>
            <div className="mt-12 bg-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Reallohn-Entwicklung Deutschland</h3>
              <div className="grid grid-cols-3 gap-6">
                {realWageData.slice(-3).map((data) => (
                  <div key={data.year} className="text-center">
                    <div className="text-lg text-blue-200">{data.year}</div>
                    <div className={`text-3xl font-bold ${data.realGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {data.realGrowth > 0 ? '+' : ''}{data.realGrowth}%
                    </div>
                    <div className="text-sm text-blue-300">Reallohn</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'effects-prices':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              🛒 Preisbeispiele: 2020 vs. 2025
            </h1>
            <div className="grid grid-cols-2 gap-8">
              {priceExamples.map((example, index) => (
                <div key={index} className="bg-white/5 rounded-2xl p-8 border border-white/10">
                  <h3 className="text-2xl font-bold text-white mb-6">{example.item}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center">
                      <div className="text-sm text-blue-200">2020</div>
                      <div className="text-2xl font-bold text-blue-400">€{example.price2020.toFixed(2)}</div>
                    </div>
                    <div className="text-4xl">→</div>
                    <div className="text-center">
                      <div className="text-sm text-red-200">2025</div>
                      <div className="text-2xl font-bold text-red-400">€{example.price2025.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${example.increase > 40 ? 'text-red-400' : example.increase > 25 ? 'text-yellow-400' : 'text-green-400'}`}>
                      +{example.increase}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'measurement-intro':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              📊 Wie wird Inflation gemessen?
            </h1>
            <div className="grid grid-cols-2 gap-12">
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold text-cyan-400 mb-6">Verbraucherpreisindex (VPI)</h2>
                <div className="text-left space-y-4 text-cyan-200">
                  <p>🛒 <strong>Warenkorb:</strong> 650 repräsentative Güter</p>
                  <p>⚖️ <strong>Gewichtung:</strong> Nach Ausgabenanteilen</p>
                  <p>📅 <strong>Messung:</strong> Monatlich durch Destatis</p>
                  <p>🔢 <strong>Formel:</strong> (VPI heute - VPI vor Jahr) / VPI vor Jahr × 100</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h2 className="text-3xl font-bold text-blue-400 mb-6">HVPI (EU-weit)</h2>
                <div className="text-left space-y-4 text-blue-200">
                  <p>🇪🇺 <strong>Harmonisiert:</strong> Einheitliche Standards</p>
                  <p>🏦 <strong>EZB-Basis:</strong> Für Geldpolitik</p>
                  <p>📊 <strong>Eurostat:</strong> EU-Koordination</p>
                  <p>🎯 <strong>Ziel:</strong> 2% für Eurozone</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'measurement-categories':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              📈 Inflation nach Kategorien
            </h1>
            <div className="grid grid-cols-1 gap-6">
              {inflationByCategory.map((category, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="grid grid-cols-4 gap-6 items-center">
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-white">{category.category}</h3>
                      <p className="text-cyan-200 text-sm">{category.description}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{category.rate2025}%</div>
                      <div className="text-green-200 text-sm">2025</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-400">{category.rate2022}%</div>
                      <div className="text-red-200 text-sm">2022</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-bold ${category.rate2025 < category.rate2022 ? 'text-green-400' : 'text-red-400'}`}>
                        {category.rate2025 < category.rate2022 ? '↓' : '↑'}
                        {Math.abs(category.rate2025 - category.rate2022).toFixed(1)}pp
                      </div>
                      <div className="text-blue-200 text-sm">Änderung</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'ecb-policy':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              🏦 EZB-Geldpolitik: Inflation steuern
            </h1>
            <div className="grid grid-cols-2 gap-12 mb-12">

              {/* Inflation zu hoch */}
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-8 border border-red-400/30">
                <div className="text-4xl mb-6">📈</div>
                <h2 className="text-3xl font-bold text-red-400 mb-6">Inflation zu hoch (&gt;2%)</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🔺</div>
                    <div>
                      <div className="font-bold text-white">Leitzins erhöhen</div>
                      <div className="text-red-200 text-sm">2022: 0% → 4,5%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💳</div>
                    <div>
                      <div className="font-bold text-white">Kredite teurer</div>
                      <div className="text-red-200 text-sm">Weniger Konsum & Investitionen</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💰</div>
                    <div>
                      <div className="font-bold text-white">Sparen attraktiver</div>
                      <div className="text-red-200 text-sm">Geld aus dem Markt</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📉</div>
                    <div>
                      <div className="font-bold text-white">Nachfrage sinkt</div>
                      <div className="text-red-200 text-sm">Preise stabilisieren sich</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inflation zu niedrig */}
              <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-blue-400/30">
                <div className="text-4xl mb-6">📉</div>
                <h2 className="text-3xl font-bold text-blue-400 mb-6">Inflation zu niedrig (&lt;2%)</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🔻</div>
                    <div>
                      <div className="font-bold text-white">Leitzins senken</div>
                      <div className="text-blue-200 text-sm">2020: 0% (Nullzinspolitik)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💳</div>
                    <div>
                      <div className="font-bold text-white">Kredite billiger</div>
                      <div className="text-blue-200 text-sm">Mehr Konsum & Investitionen</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💸</div>
                    <div>
                      <div className="font-bold text-white">Sparen unattraktiv</div>
                      <div className="text-blue-200 text-sm">Geld in den Markt</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📈</div>
                    <div>
                      <div className="font-bold text-white">Nachfrage steigt</div>
                      <div className="text-blue-200 text-sm">Preise steigen</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Aktuelles Beispiel */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border border-green-400/30">
              <h3 className="text-2xl font-bold text-white mb-6">
                🇩🇪 Deutschland 2020-2025: EZB in Aktion
              </h3>
              <div className="grid grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">2020-2021</div>
                  <div className="text-sm text-green-200">0% Zinsen</div>
                  <div className="text-xs text-green-300">Wirtschaft ankurbeln</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">2022</div>
                  <div className="text-sm text-yellow-200">6,9% Inflation</div>
                  <div className="text-xs text-yellow-300">EZB muss reagieren</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-400">2022-2025</div>
                  <div className="text-sm text-orange-200">Zinsen → 4,5%</div>
                  <div className="text-xs text-orange-300">Inflation bremsen</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">2025</div>
                  <div className="text-sm text-green-200">2,2% Inflation</div>
                  <div className="text-xs text-green-300">Mission erfolgreich!</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'history-intro':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              ⚠️ Wenn Inflation außer Kontrolle gerät
            </h1>
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-12 border border-red-400/30">
              <h2 className="text-3xl font-bold text-white mb-8">Hyperinflation</h2>
              <p className="text-2xl text-red-100 mb-8">
                Inflation über <strong>50% pro Monat</strong> = Hyperinflation
              </p>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">💸</div>
                  <h3 className="text-xl font-bold text-white mb-2">Ursachen</h3>
                  <p className="text-red-200">Krieg, Politik, Gelddrucken</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <h3 className="text-xl font-bold text-white mb-2">Folgen</h3>
                  <p className="text-red-200">Währungskollaps, Armut</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🔄</div>
                  <h3 className="text-xl font-bold text-white mb-2">Lösung</h3>
                  <p className="text-red-200">Neue Währung, Reform</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'key-takeaways':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              🎯 Die wichtigsten Erkenntnisse
            </h1>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl p-8 border border-blue-400/30">
                  <div className="text-4xl mb-4">💡</div>
                  <h2 className="text-2xl font-bold text-white mb-4">Inflation ist normal</h2>
                  <p className="text-blue-100">2% jährlich zeigt eine gesunde, wachsende Wirtschaft</p>
                </div>
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-8 border border-red-400/30">
                  <div className="text-4xl mb-4">⚠️</div>
                  <h2 className="text-2xl font-bold text-white mb-4">Extreme sind gefährlich</h2>
                  <p className="text-red-100">Zu hohe oder zu niedrige Inflation schadet der Wirtschaft</p>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border border-green-400/30">
                  <div className="text-4xl mb-4">🏦</div>
                  <h2 className="text-2xl font-bold text-white mb-4">EZB wacht über uns</h2>
                  <p className="text-green-100">Unabhängige Zentralbank sorgt für Preisstabilität</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-400/30">
                  <div className="text-4xl mb-4">🧠</div>
                  <h2 className="text-2xl font-bold text-white mb-4">Verstehen hilft</h2>
                  <p className="text-purple-100">Wissen über Inflation hilft bei persönlichen Finanzentscheidungen</p>
                </div>
              </div>
            </div>
            <div className="mt-12 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-8 border border-yellow-400/30">
              <h3 className="text-2xl font-bold text-white mb-4">
                🇩🇪 Deutschland heute: Auf dem richtigen Weg
              </h3>
              <p className="text-xl text-yellow-100">
                Von 6,9% (2022) zurück auf 2,2% (2024) - die Inflation normalisiert sich wieder
              </p>
            </div>
          </div>
        );

      case 'history-timeline':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              📜 Historische Hyperinflation
            </h1>
            <div className="space-y-8">
              {historicalEvents
                .sort((a, b) => a.year - b.year) // Sortierung von alt zu neu
                .map((event, index) => (
                <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="grid grid-cols-4 gap-6 items-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">{event.year}</div>
                      <div className="text-blue-200">{event.country}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400">
                        {event.rate >= 1000000000000 ? `${(event.rate / 1000000000000).toFixed(0)}B%` :
                         event.rate >= 1000000000 ? `${(event.rate / 1000000000).toFixed(0)}Mrd%` :
                         event.rate >= 1000000 ? `${(event.rate / 1000000).toFixed(0)}M%` :
                         `${event.rate}%`}
                      </div>
                      <div className="text-red-200 text-sm">Inflationsrate</div>
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white mb-1">{event.title}</h3>
                      <p className="text-blue-200 text-sm">{event.description}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-yellow-200 text-sm">{event.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              📝 Zusammenfassung
            </h1>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="bg-blue-500/20 rounded-2xl p-6 border border-blue-400/30">
                  <h2 className="text-2xl font-bold text-blue-400 mb-4">Was ist Inflation?</h2>
                  <p className="text-blue-100">Allgemeiner Preisanstieg, gemessen am VPI</p>
                </div>
                <div className="bg-red-500/20 rounded-2xl p-6 border border-red-400/30">
                  <h2 className="text-2xl font-bold text-red-400 mb-4">Hauptursachen</h2>
                  <p className="text-red-100">Nachfrage- und Angebotsinflation</p>
                </div>
                <div className="bg-yellow-500/20 rounded-2xl p-6 border border-yellow-400/30">
                  <h2 className="text-2xl font-bold text-yellow-400 mb-4">Auswirkungen</h2>
                  <p className="text-yellow-100">Kaufkraftverlust, Reallohnrückgang</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-green-500/20 rounded-2xl p-6 border border-green-400/30">
                  <h2 className="text-2xl font-bold text-green-400 mb-4">EZB-Ziel</h2>
                  <p className="text-green-100">2% jährlich für Preisstabilität</p>
                </div>
                <div className="bg-purple-500/20 rounded-2xl p-6 border border-purple-400/30">
                  <h2 className="text-2xl font-bold text-purple-400 mb-4">Deutschland 2024</h2>
                  <p className="text-purple-100">2,2% - Rückkehr zur Normalität</p>
                </div>
                <div className="bg-orange-500/20 rounded-2xl p-6 border border-orange-400/30">
                  <h2 className="text-2xl font-bold text-orange-400 mb-4">Lehre</h2>
                  <p className="text-orange-100">Moderate Inflation ist gesund</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'thanks':
        return (
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-8">
              🙏 Vielen Dank!
            </h1>
            <p className="text-2xl text-blue-200 mb-12">
              Fragen zur Inflation?
            </p>
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-12 border border-blue-400/30">
              <h2 className="text-3xl font-bold text-white mb-6">
                💡 Das Wichtigste in Kürze
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Inflation ist ein normaler Teil der Wirtschaft. Die EZB sorgt mit ihrer Geldpolitik
                dafür, dass die Preise stabil bleiben. Als Verbraucher sollten wir verstehen,
                wie Inflation unser tägliches Leben beeinflusst.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-12">
              Slide {currentSlide + 1}: {slideType}
            </h1>
            <p className="text-xl text-blue-200">
              Diese Slide wird noch implementiert...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-7xl">
          {renderSlide()}
        </div>
      </main>

      {/* Controls */}
      <div className="fixed bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-sm text-white">
        <span>Folie {currentSlide + 1} / {slides.length}</span>
      </div>

      {/* Help */}
      <div className="fixed bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-xs text-white/80">
        <div>→ Weiter | ← Zurück | N Notizen | ESC Zurück</div>
      </div>

      {/* Speaker Notes */}
      {showNotes && (
        <div className="fixed top-4 right-4 w-80 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-sm text-white">
          <h3 className="font-bold mb-2">🗣️ Sprechernotizen:</h3>
          <div className="text-white/80 max-h-60 overflow-y-auto">
            {slides[currentSlide] === 'title' && (
              <div>
                <p className="mb-2"><strong>Begrüßung:</strong> &quot;Heute nehme ich euch mit auf eine Reise durch das Thema Inflation.&quot;</p>
                <p className="mb-2"><strong>Zahlen erklären:</strong> 6,9% war 2022 die höchste Inflation seit 1973. 2024 nur noch 2,2%.</p>
                <p><strong>Überleitung:</strong> &quot;Aber was ist Inflation eigentlich genau?&quot;</p>
              </div>
            )}
            {slides[currentSlide] === 'definition' && (
              <div>
                <p className="mb-2"><strong>Definition:</strong> &quot;Inflation = allgemeiner Preisanstieg. Nicht einzelne Produkte, sondern der Durchschnitt.&quot;</p>
                <p className="mb-2"><strong>VPI erklären:</strong> &quot;Gemessen wird mit einem &apos;Warenkorb&apos; von 650 typischen Produkten.&quot;</p>
                <p><strong>2% Ziel:</strong> &quot;Warum 2%? Zeigt gesunde, wachsende Wirtschaft. 0% wäre Stillstand.&quot;</p>
              </div>
            )}
            {slides[currentSlide] === 'statistics' && (
              <div>
                <p className="mb-2"><strong>Grafik erklären:</strong> &quot;2019-2021 normal, dann 2022 Schock durch Ukraine-Krieg.&quot;</p>
                <p className="mb-2"><strong>Energiekrise:</strong> &quot;Gas- und Ölpreise explodierten → alles wurde teurer.&quot;</p>
                <p><strong>Erholung:</strong> &quot;2024 wieder fast normal bei 2,2%.&quot;</p>
              </div>
            )}
            {slides[currentSlide] === 'causes-intro' && (
              <div>
                <p className="mb-2"><strong>Zwei Arten:</strong> &quot;Nachfrage vs. Angebot - wie Waage im Ungleichgewicht.&quot;</p>
                <p className="mb-2"><strong>Nachfrage:</strong> &quot;Alle wollen kaufen, aber nicht genug da → Preise steigen.&quot;</p>
                <p><strong>Angebot:</strong> &quot;Produktion wird teurer → Unternehmen geben Kosten weiter.&quot;</p>
              </div>
            )}
            {slides[currentSlide] === 'causes-chart' && (
              <div>
                <p className="mb-2"><strong>Diagramm:</strong> &quot;Nachfrageinflation 30% - Post-Corona alle wollten wieder konsumieren.&quot;</p>
                <p className="mb-2"><strong>Angebot 25%:</strong> &quot;Lieferketten kaputt, dann Ukraine-Krieg.&quot;</p>
                <p><strong>Geldpolitik 20%:</strong> &quot;EZB hatte Zinsen bei 0% → viel billiges Geld.&quot;</p>
              </div>
            )}
            {slides[currentSlide] === 'effects-intro' && (
              <div>
                <p className="mb-2"><strong>Reallöhne:</strong> &quot;2022: -4,3% bedeutet Löhne stiegen weniger als Preise.&quot;</p>
                <p className="mb-2"><strong>Sparer:</strong> &quot;Bei 0,1% Zinsen und 6% Inflation verliert man 5,9% pro Jahr.&quot;</p>
                <p><strong>Erholung:</strong> &quot;2024 wieder positive Reallöhne mit +1,6%.&quot;</p>
              </div>
            )}
            {slides[currentSlide] === 'effects-prices' && (
              <div>
                <p className="mb-2"><strong>Konkrete Beispiele:</strong> &quot;Strom +55% - das merkt jeder in der Nebenkostenabrechnung.&quot;</p>
                <p className="mb-2"><strong>Brot +38%:</strong> &quot;Grundnahrungsmittel besonders betroffen.&quot;</p>
                <p><strong>Unterschiede:</strong> &quot;Nicht alles gleich - ÖPNV nur +21%.&quot;</p>
              </div>
            )}
            {slides[currentSlide] === 'measurement-intro' && (
              <div>
                <p className="mb-2"><strong>VPI:</strong> &quot;Statistisches Bundesamt geht jeden Monat &apos;einkaufen&apos; - 650 Produkte.&quot;</p>
                <p className="mb-2"><strong>Gewichtung:</strong> &quot;Miete 25%, Nahrung 10% - je nach Ausgabenanteil.&quot;</p>
                <p><strong>HVPI:</strong> &quot;EU-weit gleiche Standards, damit EZB vergleichen kann.&quot;</p>
              </div>
            )}
            {slides[currentSlide] === 'ecb-policy' && (
              <div>
                <p className="mb-2"><strong>Werkzeug:</strong> &quot;Leitzins ist das Hauptwerkzeug der EZB - wie ein Gaspedal für die Wirtschaft.&quot;</p>
                <p className="mb-2"><strong>Mechanismus:</strong> &quot;Hohe Zinsen = teurer leihen = weniger ausgeben = Preise sinken.&quot;</p>
                <p className="mb-2"><strong>Aktuell:</strong> &quot;2022 musste EZB von 0% auf 4,5% - drastische Maßnahme!&quot;</p>
                <p><strong>Erfolg:</strong> &quot;Hat funktioniert: 6,9% → 2,2% in 2 Jahren.&quot;</p>
              </div>
            )}
            {slides[currentSlide] === 'history-intro' && (
              <div>
                <p className="mb-2"><strong>Definition:</strong> &quot;Hyperinflation = über 50% pro Monat. Währung wird wertlos.&quot;</p>
                <p className="mb-2"><strong>Ursachen:</strong> &quot;Meist Kriege, Politik oder Geld drucken ohne Ende.&quot;</p>
                <p><strong>Heute:</strong> &quot;Moderne Zentralbanken haben gelernt - deshalb 2% Ziel.&quot;</p>
              </div>
            )}
            {slides[currentSlide] === 'history-timeline' && (
              <div>
                <p className="mb-2"><strong>Chronologie:</strong> &quot;Von 1923 bis 2008 - Zeitstrahl zeigt Entwicklung.&quot;</p>
                <p className="mb-2"><strong>Deutschland 1923:</strong> &quot;Reparationen → Geld drucken → 1 Dollar = 4 Billionen Mark.&quot;</p>
                <p className="mb-2"><strong>Ungarn 1946:</strong> &quot;Weltrekord! Preise verdoppelten sich alle 15 Stunden.&quot;</p>
                <p><strong>Lehre:</strong> &quot;Deshalb haben wir heute unabhängige Zentralbanken.&quot;</p>
              </div>
            )}
            {slides[currentSlide] === 'key-takeaways' && (
              <div>
                <p className="mb-2"><strong>4 Kernbotschaften:</strong> &quot;Das solltet ihr mitnehmen.&quot;</p>
                <p className="mb-2"><strong>Normal:</strong> &quot;2% Inflation = gesunde Wirtschaft, nicht schlimm.&quot;</p>
                <p className="mb-2"><strong>EZB:</strong> &quot;Unabhängige Zentralbank verhindert Hyperinflation.&quot;</p>
                <p><strong>Deutschland:</strong> &quot;Wir sind auf dem richtigen Weg zurück zur Normalität.&quot;</p>
              </div>
            )}
            {slides[currentSlide] === 'summary' && (
              <div>
                <p className="mb-2"><strong>Kernpunkte:</strong> &quot;Inflation normal, 2% optimal, EZB passt auf.&quot;</p>
                <p className="mb-2"><strong>Deutschland:</strong> &quot;2022 Schock, 2024 wieder normal.&quot;</p>
                <p><strong>Persönlich:</strong> &quot;Verstehen hilft bei Finanzentscheidungen.&quot;</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
