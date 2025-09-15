'use client';

import { useState } from 'react';
import { gsap } from 'gsap';
import { DollarSign, BarChart3, TrendingUp, TrendingDown, Lightbulb, Banknote, Calendar, Briefcase, Scale, Target, Smile, Frown } from 'lucide-react';

// Consistent number formatting function to avoid hydration issues
const formatCurrency = (amount: number, decimals: number = 0): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

// Reale Inflationsdaten Deutschland
const inflationData = {
  2020: 0.5,
  2021: 3.1,
  2022: 6.9,
  2023: 5.9,
  2024: 2.2, // Geschätzt
};

// Durchschnittliche Lohnsteigerungen in Deutschland
const avgSalaryIncrease = {
  2020: 2.1,
  2021: 2.8,
  2022: 4.1,
  2023: 5.2,
  2024: 3.5, // Geschätzt
};

interface SalaryResult {
  salary2020: number;
  currentSalary: number;
  inflationAdjustedSalary: number;
  realWageChange: number;
  cumulativeInflation: number;
  avgSalaryToday: number;
  vsAverageChange: number;
  purchasingPowerChange: number;
  monthlyDifference: number;
  yearlyInflationLoss: number;
  isWinner: boolean;
  vsAverage: 'besser' | 'schlechter';
}

export default function SalaryInflationTracker() {
  const [salary2020, setSalary2020] = useState(45000);
  const [currentSalary, setCurrentSalary] = useState(50000);
  const [result, setResult] = useState<SalaryResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateRealWage = () => {
    setIsCalculating(true);
    
    // Animation
    gsap.to('.salary-spinner', {
      rotation: 360,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        // Kumulierte Inflation 2020-2024
        let cumulativeInflation = 1;
        let cumulativeAvgSalary = 1;
        
        Object.values(inflationData).forEach(rate => {
          cumulativeInflation *= (1 + rate / 100);
        });
        
        Object.values(avgSalaryIncrease).forEach(rate => {
          cumulativeAvgSalary *= (1 + rate / 100);
        });
        
        // Was das 2020er Gehalt heute wert wäre (inflationsbereinigt)
        const inflationAdjustedSalary = salary2020 * cumulativeInflation;
        
        // Reallohn-Veränderung
        const realWageChange = ((currentSalary - inflationAdjustedSalary) / inflationAdjustedSalary) * 100;
        
        // Vergleich mit Durchschnitt
        const avgSalaryToday = salary2020 * cumulativeAvgSalary;
        const vsAverageChange = ((currentSalary - avgSalaryToday) / avgSalaryToday) * 100;
        
        // Kaufkraftverlust/-gewinn
        const purchasingPowerChange = ((currentSalary / salary2020) / cumulativeInflation - 1) * 100;
        
        // Monatliche Auswirkung
        const monthlyDifference = (currentSalary - inflationAdjustedSalary) / 12;
        
        setResult({
          salary2020,
          currentSalary,
          inflationAdjustedSalary,
          realWageChange,
          cumulativeInflation: (cumulativeInflation - 1) * 100,
          avgSalaryToday,
          vsAverageChange,
          purchasingPowerChange,
          monthlyDifference,
          yearlyInflationLoss: salary2020 * (cumulativeInflation - 1),
          isWinner: realWageChange > 0,
          vsAverage: vsAverageChange > 0 ? 'besser' : 'schlechter'
        });
        
        setIsCalculating(false);
        
        // Ergebnis-Animation
        gsap.fromTo('.salary-result', 
          { opacity: 0, y: 50, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
        );
      }
    });
  };

  return (
    <div className="bg-gradient-to-br from-green-900/20 to-yellow-900/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
          <DollarSign size={32} className="text-green-400" />
          Gehalt-Inflation-Tracker
        </h3>
        <p className="text-green-200">
          Verdienst du real mehr oder weniger als vor 4 Jahren?
        </p>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-white font-semibold mb-3 flex items-center gap-2">
            <Calendar size={20} className="text-green-400" />
            Dein Gehalt 2020 (brutto/Jahr):
          </label>
          <div className="relative">
            <input
              type="number"
              value={salary2020}
              onChange={(e) => setSalary2020(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
              placeholder="45000"
              min="20000"
              max="200000"
              step="1000"
            />
            <span className="absolute right-3 top-3 text-green-300">€</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Durchschnitt 2020: ~45.000€
          </p>
        </div>

        <div>
          <label className="block text-white font-semibold mb-3 flex items-center gap-2">
            <Briefcase size={20} className="text-blue-400" />
            Dein aktuelles Gehalt (brutto/Jahr):
          </label>
          <div className="relative">
            <input
              type="number"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
              placeholder="50000"
              min="20000"
              max="200000"
              step="1000"
            />
            <span className="absolute right-3 top-3 text-green-300">€</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Durchschnitt 2024: ~52.000€
          </p>
        </div>
      </div>

      {/* Calculate Button */}
      <div className="text-center mb-8">
        <button
          onClick={calculateRealWage}
          disabled={isCalculating || salary2020 <= 0 || currentSalary <= 0}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-yellow-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {isCalculating ? (
            <div className="flex items-center gap-3">
              <div className="salary-spinner w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
              Berechne Reallohn...
            </div>
          ) : (
            <>
              <BarChart3 size={20} className="mr-2" />
              Reallohn berechnen!
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="salary-result">
          {/* Hauptergebnis */}
          <div className={`bg-gradient-to-r ${result.isWinner ? 'from-green-500/20 to-blue-500/20 border-green-400/30' : 'from-red-500/20 to-orange-500/20 border-red-400/30'} backdrop-blur-sm rounded-xl p-6 border mb-6`}>
            <div className="text-center mb-6">
              <h4 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                {result.isWinner ? <Smile size={24} className="text-green-400" /> : <Frown size={24} className="text-red-400" />} Dein Reallohn-Ergebnis
              </h4>
              <p className={`text-lg ${result.isWinner ? 'text-green-300' : 'text-red-300'}`}>
                Du verdienst real <strong>{Math.abs(result.realWageChange).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</strong> {result.isWinner ? 'mehr' : 'weniger'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="mb-2">
                  {result.isWinner ?
                    <TrendingUp size={32} className="text-green-400 mx-auto" /> :
                    <TrendingDown size={32} className="text-red-400 mx-auto" />
                  }
                </div>
                <div className="text-sm text-gray-300">Reallohn-Änderung</div>
                <div className={`text-xl font-bold ${result.isWinner ? 'text-green-400' : 'text-red-400'}`}>
                  {result.realWageChange > 0 ? '+' : ''}{result.realWageChange.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 text-center">
                <Banknote size={32} className="text-yellow-400 mx-auto mb-2" />
                <div className="text-sm text-gray-300">Monatlich {result.isWinner ? 'mehr' : 'weniger'}</div>
                <div className={`text-xl font-bold ${result.monthlyDifference > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {result.monthlyDifference > 0 ? '+' : ''}{formatCurrency(result.monthlyDifference, 0)}
                </div>
              </div>

              <div className="bg-white/10 rounded-lg p-4 text-center">
                <Scale size={32} className="text-yellow-300 mx-auto mb-2" />
                <div className="text-sm text-gray-300">vs. Durchschnitt</div>
                <div className={`text-xl font-bold ${result.vsAverageChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {result.vsAverage}
                </div>
              </div>
            </div>
          </div>

          {/* Detailanalyse */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h5 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><BarChart3 size={20} className="text-blue-300" /> Detailanalyse 2020-2024:</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h6 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <DollarSign size={20} className="text-green-400" />
                  Gehaltsentwicklung:
                </h6>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">2020 (Start):</span>
                    <span className="text-white font-semibold">
                      {formatCurrency(result.salary2020, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">2024 (Heute):</span>
                    <span className="text-white font-semibold">
                      {formatCurrency(result.currentSalary, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-white/20 pt-2">
                    <span className="text-gray-300">Nominale Steigerung:</span>
                    <span className="text-green-400 font-semibold">
                      +{((result.currentSalary / result.salary2020 - 1) * 100).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h6 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <TrendingUp size={20} className="text-red-400" />
                  Inflation 2020-2024:
                </h6>
                <div className="space-y-2 text-sm">
                  {Object.entries(inflationData).map(([year, rate]) => (
                    <div key={year} className="flex justify-between">
                      <span className="text-gray-300">{year}:</span>
                      <span className="text-red-300">+{rate}%</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t border-white/20 pt-2">
                    <span className="text-gray-300">Kumuliert:</span>
                    <span className="text-red-400 font-semibold">
                      +{result.cumulativeInflation.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fazit */}
            <div className="mt-6 bg-blue-500/10 rounded-lg p-4">
              <h6 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Target size={18} className="text-yellow-400" /> Fazit:</h6>
              <p className="text-blue-200 text-sm leading-relaxed">
                {result.isWinner ? (
                  <>
                    <strong>Glückwunsch!</strong> Du gehörst zu den Gewinnern der Inflation. 
                    Dein Gehalt ist stärker gestiegen als die Preise. Du hast real 
                    <strong> {formatCurrency(result.monthlyDifference, 0)}
                    mehr pro Monat</strong> zur Verfügung als 2020.
                  </>
                ) : (
                  <>
                    <strong>Leider</strong> hat die Inflation deine Gehaltssteigerung &quot;aufgefressen&quot;.
                    Du hast real <strong>{formatCurrency(result.monthlyDifference, 0)}
                    weniger pro Monat</strong> zur Verfügung als 2020. Zeit für eine Gehaltsverhandlung!
                  </>
                )}
              </p>
            </div>

            {/* Handlungsempfehlung */}
            <div className="mt-4 bg-purple-500/10 rounded-lg p-4">
              <h6 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Lightbulb size={20} className="text-yellow-400" />
                Empfehlung:
              </h6>
              <p className="text-purple-200 text-sm">
                {result.isWinner ? (
                  'Investiere dein zusätzliches Einkommen in inflationsgeschützte Anlagen wie Aktien oder Immobilien!'
                ) : (
                  'Verhandle eine Gehaltserhöhung von mindestens ' + 
                  Math.abs(result.realWageChange).toLocaleString('de-DE') +
                  '% oder wechsle den Job. Parallel solltest du in Sachwerte investieren.'
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
