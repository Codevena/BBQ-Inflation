'use client';

import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ShoppingCart, DollarSign, Target, BarChart3, Lightbulb, Clock, Calendar, Rocket } from 'lucide-react';

// Consistent number formatting function to avoid hydration issues
const formatCurrency = (amount: number, currency: string = 'EUR', decimals: number = 0): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Historische Inflationsdaten (vereinfacht)
const historicalInflation = {
  1990: { rate: 2.7, currency: 'DM', factor: 1.95 }, // DM zu Euro Faktor
  1995: { rate: 1.8, currency: 'DM', factor: 1.95 },
  2000: { rate: 1.4, currency: '€', factor: 1.0 },
  2005: { rate: 1.9, currency: '€', factor: 1.0 },
  2010: { rate: 1.2, currency: '€', factor: 1.0 },
  2015: { rate: 0.1, currency: '€', factor: 1.0 },
  2020: { rate: 0.5, currency: '€', factor: 1.0 },
};

// Beispielprodukte mit historischen Preisen
const productExamples = {
  1990: { name: 'Brot (1kg)', price: 2.20, currency: 'DM' },
  1995: { name: 'Benzin (1L)', price: 1.15, currency: 'DM' },
  2000: { name: 'Kino-Ticket', price: 7.50, currency: '€' },
  2005: { name: 'Döner', price: 2.50, currency: '€' },
  2010: { name: 'Kaffee', price: 1.20, currency: '€' },
  2015: { name: 'Smartphone', price: 600, currency: '€' },
  2020: { name: 'Netflix Abo', price: 7.99, currency: '€' },
};

export default function TimeTravelSimulator() {
  const [selectedYear, setSelectedYear] = useState(2000);
  const [amount, setAmount] = useState(1000);
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePurchasingPower = () => {
    setIsCalculating(true);
    
    // Animation für Berechnung
    gsap.to('.calculation-spinner', {
      rotation: 360,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        const yearData = historicalInflation[selectedYear as keyof typeof historicalInflation];
        const currentYear = 2024;
        const yearsDiff = currentYear - selectedYear;
        
        // Durchschnittliche Inflation seit dem Jahr
        const avgInflation = yearData.rate / 100;
        const inflationFactor = Math.pow(1 + avgInflation, yearsDiff);
        
        // Kaufkraft heute
        let todayValue = amount * inflationFactor;
        
        // DM zu Euro Konversion wenn nötig
        if (yearData.currency === 'DM') {
          todayValue = todayValue / yearData.factor;
        }
        
        // Beispielprodukt für das Jahr
        const example = productExamples[selectedYear as keyof typeof productExamples];
        const exampleToday = example.price * inflationFactor;
        
        setResult({
          originalAmount: amount,
          originalCurrency: yearData.currency,
          todayValue: todayValue,
          inflationFactor: inflationFactor,
          yearsDiff: yearsDiff,
          avgInflation: avgInflation * 100,
          example: example,
          exampleToday: exampleToday,
          purchasingPowerLoss: ((todayValue - amount) / amount) * 100
        });
        
        setIsCalculating(false);
        
        // Ergebnis-Animation
        gsap.fromTo('.result-card', 
          { opacity: 0, y: 50, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
        );
      }
    });
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <Clock size={32} className="text-purple-400" />
          Inflation-Zeitreise-Simulator
        </h3>
        <p className="text-purple-200">
          Reise in die Vergangenheit und entdecke, was dein Geld heute wert wäre!
        </p>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 items-end">
        <div>
          <label className="block text-white font-semibold mb-3 flex items-center gap-2">
            <Calendar size={20} className="text-purple-400" />
            Wähle ein Jahr:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
          >
            {Object.keys(historicalInflation).map(year => (
              <option key={year} value={year} className="bg-gray-800">
                {year} ({historicalInflation[year as keyof typeof historicalInflation].currency})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white font-semibold mb-3 flex items-center gap-2">
            <DollarSign size={20} className="text-green-400" />
            Betrag eingeben:
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              placeholder="1000"
              min="1"
              max="1000000"
            />
            <span className="absolute right-3 top-3 text-purple-300">
              {historicalInflation[selectedYear as keyof typeof historicalInflation].currency}
            </span>
          </div>
        </div>

        {/* Calculate Button */}
        <div>
          <button
            onClick={calculatePurchasingPower}
            disabled={isCalculating || amount <= 0}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {isCalculating ? (
              <div className="flex items-center justify-center gap-3">
                <div className="calculation-spinner w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                Zeitreise läuft...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Rocket size={20} />
                Zeitreise starten!
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="result-card bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-400/30">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Target size={28} className="text-green-400" />
              Deine Zeitreise-Ergebnisse
            </h4>
            <p className="text-green-200">
              Von {selectedYear} bis heute (2024)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hauptergebnis */}
            <div className="bg-white/10 rounded-lg p-4">
              <h5 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <DollarSign size={20} className="text-green-400" />
                Kaufkraft heute:
              </h5>
              <div className="text-3xl font-bold text-green-400 mb-2">
                {formatCurrency(result.todayValue, 'EUR', 0)}
              </div>
              <p className="text-sm text-gray-300">
                Ursprünglich: {formatNumber(result.originalAmount)} {result.originalCurrency}
              </p>
              <p className="text-sm text-gray-300">
                Wertsteigerung: +{result.purchasingPowerLoss.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
              </p>
            </div>

            {/* Beispielprodukt */}
            <div className="bg-white/10 rounded-lg p-4">
              <h5 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <ShoppingCart size={20} className="text-purple-400" />
                Preisbeispiel:
              </h5>
              <div className="mb-2">
                <span className="text-purple-300">{result.example.name}</span>
              </div>
              <div className="text-sm text-gray-300">
                {selectedYear}: {formatCurrency(result.example.price, 'EUR', 2)} {result.example.currency}
              </div>
              <div className="text-sm text-green-400">
                Heute: ~{formatCurrency(result.exampleToday, 'EUR', 2)}
              </div>
            </div>
          </div>

          {/* Zusätzliche Infos */}
          <div className="mt-6 bg-blue-500/10 rounded-lg p-4">
            <h5 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-400" />
              Inflation-Details:
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Zeitraum:</span>
                <div className="text-white font-semibold">{result.yearsDiff} Jahre</div>
              </div>
              <div>
                <span className="text-gray-400">Ø Inflation:</span>
                <div className="text-white font-semibold">{result.avgInflation.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</div>
              </div>
              <div>
                <span className="text-gray-400">Faktor:</span>
                <div className="text-white font-semibold">{result.inflationFactor.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x</div>
              </div>
              <div>
                <span className="text-gray-400">Währung:</span>
                <div className="text-white font-semibold">{result.originalCurrency} → €</div>
              </div>
            </div>
          </div>

          {/* Fun Fact */}
          <div className="mt-4 text-center">
            <p className="text-purple-200 text-sm flex items-start gap-2">
              <Lightbulb size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Fun Fact:</strong> Dein Geld hätte sich in {result.yearsDiff} Jahren
                um {result.purchasingPowerLoss.toLocaleString('de-DE')}% &quot;vermehrt&quot; - aber nur nominal!
                Real hat es die gleiche Kaufkraft wie damals.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
