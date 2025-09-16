'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DollarSign, Home, TrendingUp, CreditCard, Shield, Calculator, Lightbulb, Coins, ShoppingCart, Building2, Zap, Scale } from 'lucide-react';
import TimeTravelSimulator from './TimeTravelSimulator';

// Consistent number formatting function to avoid hydration issues
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const inflationProtectionAssets = [
  {
    name: 'Aktien',
    protection: 85,
    risk: 'Hoch',
    timeHorizon: '5+ Jahre',
    description: 'Unternehmen können Preise anpassen',
    explanation:
      'Unternehmen erwirtschaften nominale Umsätze. Bei allgemeinem Preisauftrieb können viele Firmen Preise anheben, wodurch Umsätze und Gewinne langfristig in nominalen Größen mitwachsen. Dividenden steigen häufig mit der Zeit. Kurzfristig können Bewertungen bei Zinsanstiegen jedoch fallen – daher längerfristiger Horizont und breite Diversifikation wichtig.',
    color: '#EF4444'
  },
  {
    name: 'Immobilien',
    protection: 90,
    risk: 'Mittel',
    timeHorizon: '10+ Jahre',
    description: 'Sachwerte steigen mit Inflation',
    explanation:
      'Immobilien sind Sachwerte. Mieten enthalten oft Indexklauseln oder werden bei Neuvermietung an das Preisniveau angepasst. Bau- und Landkosten steigen langfristig mit, was Werte stützt. Gleichzeitig machen höhere Zinsen Finanzierungen teurer und können Bewertungen drücken – daher stabilisierend über lange Sicht, nicht kurzfristig.',
    color: '#F59E0B'
  },
  {
    name: 'Rohstoffe',
    protection: 75,
    risk: 'Hoch',
    timeHorizon: '3+ Jahre',
    description: 'Direkte Inflationstreiber',
    explanation:
      'Rohstoffe (Energie, Metalle, Agrar) sind oft direkte Preistreiber im Warenkorb. Steigen ihre Preise, steigt häufig auch die gemessene Inflation. Exposure bietet deshalb einen natürlichen Hedge. Gleichzeitig sind Rohstoffe sehr volatil, zyklisch und mit Lager-/Rollkosten behaftet – daher nur dosiert als Beimischung.',
    color: '#10B981'
  },
  {
    name: 'Inflationsanleihen',
    protection: 95,
    risk: 'Niedrig',
    timeHorizon: '1+ Jahre',
    description: 'Zinsen passen sich an Inflation an',
    explanation:
      'Inflationsindexierte Anleihen (z. B. TIPS, OAT€i) koppeln Kupon und/oder Rückzahlung an einen Preisindex. Unerwartete Inflation wird damit kompensiert – man erhält Realrenditen plus gemessene Inflation. Zu beachten: Indexformel, Steuern und die Sensitivität gegenüber Realzinsen.',
    color: '#3B82F6'
  },
  {
    name: 'Sparbuch',
    protection: 20,
    risk: 'Niedrig',
    timeHorizon: 'Jederzeit',
    description: 'Zinsen meist unter Inflation',
    explanation:
      'Liquidität ist wichtig – aber Nominalzinsen liegen oft unter der Inflationsrate. Dadurch verliert das Guthaben real an Kaufkraft. Für Notgroschen und kurzfristige Reserven sinnvoll, nicht als Inflationsschutz über längere Zeiträume.',
    color: '#8B5CF6'
  },
  {
    name: 'Infrastruktur/REITs',
    protection: 70,
    risk: 'Mittel',
    timeHorizon: '5+ Jahre',
    description: 'Sachwerte mit oft indexierten Erlösen',
    explanation:
      'Viele Infrastrukturprojekte und vermietete Immobilien besitzen inflationsgekoppelte Tarife oder Mieten. Cashflows wachsen dadurch mit dem Preisniveau. Gleichzeitig reagieren Bewertungen sensibel auf Zinsen und regulatorische Rahmenbedingungen – langfristig orientiert einsetzen.',
    color: '#22D3EE'
  }
];

const personalFinanceTips = [
  {
    icon: DollarSign,
    title: 'Schulden bei Inflation',
    tip: 'Feste Zinsen werden durch Inflation "weginflationiert"',
    example: '100.000€ Kredit bei 3% Zinsen + 5% Inflation = real nur 2% Kosten'
  },
  {
    icon: Home,
    title: 'Immobilienkauf',
    tip: 'Sachwerte schützen vor Inflation, aber Zinsen beachten',
    example: 'Haus für 500.000€ heute kann in 10 Jahren 650.000€ wert sein'
  },
  {
    icon: TrendingUp,
    title: 'Aktien-Sparplan',
    tip: 'Regelmäßig investieren glättet Schwankungen',
    example: '200€/Monat in ETF über 20 Jahre trotz Inflation'
  },
  {
    icon: CreditCard,
    title: 'Konsumverhalten',
    tip: 'Große Anschaffungen vor Preiserhöhungen',
    example: 'Auto oder Möbel kaufen, bevor Preise weiter steigen'
  }
];

export default function InflationEverydaySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const protectionRef = useRef<HTMLDivElement>(null);
  const tipsRef = useRef<HTMLDivElement>(null);

  const [initialAmount, setInitialAmount] = useState(10000);
  const [inflationRate, setInflationRate] = useState(3.0);
  const [years, setYears] = useState(10);
  const [selectedAsset, setSelectedAsset] = useState(0);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [baseRent, setBaseRent] = useState(950);
  const [rentIndex, setRentIndex] = useState(6);
  const [nominalRaise, setNominalRaise] = useState(3);
  const [grossIncome, setGrossIncome] = useState(45000);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([titleRef.current, calculatorRef.current, protectionRef.current, tipsRef.current], {
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
      .to(calculatorRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5')
      .to(protectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.3')
      .to(tipsRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=0.5');

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const calculateInflationImpact = () => {
    const futureValue = initialAmount * Math.pow(1 + inflationRate / 100, years);
    const realValue = initialAmount / Math.pow(1 + inflationRate / 100, years);
    const purchasingPowerLoss = ((initialAmount - realValue) / initialAmount) * 100;
    
    return {
      futureValue: futureValue.toFixed(0),
      realValue: realValue.toFixed(0),
      purchasingPowerLoss: purchasingPowerLoss.toFixed(1)
    };
  };

  const impact = calculateInflationImpact();
  const indexedRent = baseRent * (1 + rentIndex / 100);

  const supermarketItems = [
    { name: 'Wocheneinkauf', price: 70 },
    { name: 'Kaffee to go', price: 3.5 },
    { name: 'Familienpizza', price: 12 }
  ];

  const commuteBase = 120; // Durchschnittliche Monatskosten für Pendeln/Energie
  const commuteFuture = commuteBase * Math.pow(1 + inflationRate / 100, 1);

  const calculateNetIncome = (income: number) => {
    const basicAllowance = 11000;
    const taxable = Math.max(0, income - basicAllowance);
    const marginal = 0.18 + Math.min(0.22, taxable / 90000);
    const tax = taxable * marginal;
    return income - tax;
  };

  const netBefore = calculateNetIncome(grossIncome);
  const netAfter = calculateNetIncome(grossIncome * (1 + nominalRaise / 100));
  const realNetAfter = netAfter / (1 + inflationRate / 100);
  const realProgressionEffect = ((realNetAfter - netBefore) / netBefore) * 100;

  return (
    <section 
      id="everyday" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-900 py-20"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
          >
            <span className="flex items-center justify-center gap-3">
              <Lightbulb size={40} className="text-emerald-400" />
              Inflation im
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 block">
              Alltag meistern
            </span>
          </h2>
          <p className="text-xl text-emerald-200 max-w-4xl mx-auto">
            Praktische Strategien für deine persönlichen Finanzen in inflationären Zeiten
          </p>
        </div>

        {/* Personal Inflation Calculator */}
        <div ref={calculatorRef} className="mb-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
              <Calculator size={28} className="text-blue-400" />
              Persönlicher Kaufkraft-Rechner
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Input Controls */}
              <div className="space-y-6">
                <div>
                  <label className="block text-emerald-200 mb-2">Startbetrag (€)</label>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={initialAmount}
                    onChange={(e) => setInitialAmount(parseInt(e.target.value))}
                    className="w-full h-2 bg-emerald-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-emerald-300 mt-1">
                    <span>1.000€</span>
                    <span className="font-bold">{formatCurrency(initialAmount)}€</span>
                    <span>100.000€</span>
                  </div>
                </div>

                <div>
                  <label className="block text-emerald-200 mb-2">Inflationsrate (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-green-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-emerald-300 mt-1">
                    <span>0%</span>
                    <span className="font-bold">{inflationRate}%</span>
                    <span>10%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-emerald-200 mb-2">Zeitraum (Jahre)</label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(parseInt(e.target.value))}
                    className="w-full h-2 bg-teal-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-emerald-300 mt-1">
                    <span>1 Jahr</span>
                    <span className="font-bold">{years} Jahre</span>
                    <span>30 Jahre</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                <div className="bg-emerald-500/20 rounded-xl p-6 border border-emerald-400/30">
                  <h4 className="text-lg font-bold text-white mb-4">Deine Kaufkraft in {years} Jahren:</h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-200">Nominaler Wert:</span>
                      <span className="text-2xl font-bold text-white">{formatCurrency(initialAmount)}€</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-emerald-200">Realer Wert:</span>
                      <span className="text-2xl font-bold text-red-400">{formatCurrency(parseInt(impact.realValue))}€</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-200">Kaufkraftverlust:</span>
                      <span className="text-2xl font-bold text-red-400">-{impact.purchasingPowerLoss}%</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-400/30 rounded-lg">
                    <p className="text-yellow-100 text-sm">
                      <span className="flex items-center gap-2">
                        <Lightbulb size={16} className="text-yellow-400" />
                        <strong>Das bedeutet:</strong>
                      </span>
                      Was heute {formatCurrency(initialAmount)}€ kostet,
                      kostet in {years} Jahren etwa {impact.futureValue}€.
                      Deine {formatCurrency(initialAmount)}€ haben dann nur noch die Kaufkraft von {formatCurrency(parseInt(impact.realValue))}€.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Travel Simulator */}
        <div className="mb-16">
          <TimeTravelSimulator />
        </div>

        {/* Alltag konkret */}
        <div className="mb-16 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h3 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <ShoppingCart size={32} className="text-emerald-300" />
            Inflation im Alltag: Vier Beispiele
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Supermarkt */}
            <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
              <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <ShoppingCart size={20} className="text-emerald-300" />
                Supermarkt
              </h4>
              <p className="text-sm text-emerald-100 mb-3">
                Bei {inflationRate}% Inflation steigen Preise binnen eines Jahres deutlich. So wirkt sich das auf typische Einkäufe aus:
              </p>
              <ul className="space-y-2 text-sm text-emerald-100">
                {supermarketItems.map(item => {
                  const future = item.price * Math.pow(1 + inflationRate / 100, 1);
                  return (
                    <li key={item.name} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>
                        {item.price.toFixed(2)}€ → <strong className="text-white">{future.toFixed(2)}€</strong>
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="text-xs text-emerald-200 mt-3">
                Tipp: Preise vergleichen, Eigenmarken nutzen und Sonderangebote gezielt einplanen.
              </p>
            </div>

            {/* Wohnen */}
            <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
              <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Building2 size={20} className="text-blue-300" />
                Indexmiete
              </h4>
              <p className="text-sm text-emerald-100 mb-4">
                Viele Mietverträge sind an den Verbraucherpreisindex gekoppelt. Passe die Parameter an und sieh, wie sich die Monatsmiete verändert.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-emerald-200 text-xs mb-1">Ausgangsmiete (€/Monat)</label>
                  <input
                    type="range"
                    min={500}
                    max={2000}
                    step={50}
                    value={baseRent}
                    onChange={(e) => setBaseRent(parseInt(e.target.value))}
                    className="w-full h-2 bg-emerald-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-emerald-300">
                    <span>500€</span>
                    <span>{baseRent}€</span>
                    <span>2000€</span>
                  </div>
                </div>
                <div>
                  <label className="block text-emerald-200 text-xs mb-1">Indexanpassung (%)</label>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    step={0.5}
                    value={rentIndex}
                    onChange={(e) => setRentIndex(parseFloat(e.target.value))}
                    className="w-full h-2 bg-emerald-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-emerald-300">
                    <span>0%</span>
                    <span>{rentIndex}%</span>
                    <span>12%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-emerald-500/20 border border-emerald-400/30 rounded-lg p-4 text-sm text-emerald-100">
                Neue Miete: <span className="text-white font-semibold">{indexedRent.toFixed(0)}€</span> pro Monat
              </div>
              <p className="text-xs text-emerald-200 mt-3">
                Prüfe, ob Mietverträge eine Kappungsgrenze haben oder ob Vergleichsmieten verhandelt werden können.
              </p>
            </div>

            {/* Mobilität & Energie */}
            <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
              <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Zap size={20} className="text-yellow-300" />
                Mobilität & Energie
              </h4>
              <p className="text-sm text-emerald-100 mb-3">
                Beim Tanken oder bei Stromtarifen fallen Inflationsspitzen sofort auf. Der monatliche Energie-/Pendlerposten verändert sich so:
              </p>
              <div className="flex items-baseline justify-between text-sm text-emerald-100">
                <span>Aktuell:</span>
                <span className="text-white font-semibold">{commuteBase.toFixed(0)}€</span>
              </div>
              <div className="flex items-baseline justify-between text-sm text-emerald-100 mt-2">
                <span>Nach 12 Monaten:</span>
                <span className="text-white font-semibold">{commuteFuture.toFixed(0)}€</span>
              </div>
              <p className="text-xs text-emerald-200 mt-4">
                Energie sparen, ÖPNV nutzen oder Fixpreisverträge prüfen senkt die Volatilität.
              </p>
            </div>

            {/* Steuern & kalte Progression */}
            <div className="rounded-2xl border border-white/10 bg-white/10 p-6">
              <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Scale size={20} className="text-orange-300" />
                Steuern & kalte Progression
              </h4>
              <p className="text-sm text-emerald-100 mb-4">
                Nominale Gehaltserhöhungen gleichen Inflation nicht automatisch aus – höhere Steuerstufen schlagen zu. Passe dein Szenario an.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs text-emerald-200">
                <div>
                  <label className="block mb-1">Brutto (€/Jahr)</label>
                  <input
                    type="number"
                    value={grossIncome}
                    min={20000}
                    max={120000}
                    step={1000}
                    onChange={(e) => setGrossIncome(parseInt(e.target.value) || 0)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-300"
                  />
                </div>
                <div>
                  <label className="block mb-1">Nominale Gehaltserhöhung (%)</label>
                  <input
                    type="range"
                    min={0}
                    max={10}
                    step={0.5}
                    value={nominalRaise}
                    onChange={(e) => setNominalRaise(parseFloat(e.target.value))}
                    className="w-full h-2 bg-emerald-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-1 text-[10px] text-emerald-300">
                    <span>0%</span>
                    <span>{nominalRaise}%</span>
                    <span>10%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-emerald-500/20 border border-emerald-400/30 rounded-lg p-4 text-sm text-emerald-100 space-y-1">
                <div>Netto vorher: <span className="text-white font-semibold">{netBefore.toFixed(0)}€</span></div>
                <div>Netto nach Erhöhung: <span className="text-white font-semibold">{netAfter.toFixed(0)}€</span></div>
                <div>Realer Effekt (inflationsbereinigt): <span className={`font-semibold ${realProgressionEffect >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {realProgressionEffect >= 0 ? '+' : ''}{realProgressionEffect.toFixed(1)}%
                </span></div>
              </div>
              <p className="text-xs text-emerald-200 mt-3">
                Kalte Progression vermeiden: Freibeträge prüfen, steuerfreie Sachleistungen oder Einmalzahlungen verhandeln.
              </p>
            </div>
          </div>
        </div>

        {/* Inflation Protection Assets */}
        <div ref={protectionRef} className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Shield size={32} className="text-blue-400" />
            Inflationsschutz-Strategien
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inflationProtectionAssets.map((asset, index) => (
              <div
                key={index}
                role="button"
                tabIndex={0}
                aria-pressed={selectedAsset === index}
                className={`relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-xl border cursor-pointer transition-all duration-300 [perspective:1000px] ${
                  selectedAsset === index 
                    ? 'border-emerald-400 bg-white/10 scale-105' 
                    : 'border-white/10 hover:border-white/30'
                }`}
                onClick={() => {
                  setSelectedAsset(index);
                  setFlipped(prev => ({ ...prev, [index]: !prev[index] }));
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedAsset(index);
                    setFlipped(prev => ({ ...prev, [index]: !prev[index] }));
                  }
                }}
              >
                <div
                  className="relative p-6 transition-transform duration-500 [transform-style:preserve-3d] min-h-[260px]"
                  style={{ transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                  {/* Front */}
                  <div className="absolute inset-0 p-6 [backface-visibility:hidden]">
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-white mb-2">{asset.name}</h4>
                      <div className="text-3xl font-bold mb-2" style={{ color: asset.color }}>
                        {asset.protection}%
                      </div>
                      <div className="text-sm text-emerald-200">Inflationsschutz</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-emerald-200 text-sm">Risiko:</span>
                        <span className={`text-sm font-bold ${
                          asset.risk === 'Niedrig' ? 'text-green-400' : 
                          asset.risk === 'Mittel' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {asset.risk}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-emerald-200 text-sm">Zeithorizont:</span>
                        <span className="text-white text-sm font-bold">{asset.timeHorizon}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-white/5 rounded-lg">
                      <p className="text-emerald-100 text-sm">{asset.description}</p>
                    </div>

                    {/* Protection Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${asset.protection}%`,
                            backgroundColor: asset.color
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 p-6 [backface-visibility:hidden]" style={{ transform: 'rotateY(180deg)' }}>
                    <div className="h-full flex flex-col">
                      <h4 className="text-xl font-bold text-white mb-3">Warum schützt {asset.name}?</h4>
                      <p className="text-emerald-100 text-sm leading-relaxed flex-1">
                        {asset.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Finance Tips */}
        <div ref={tipsRef}>
          <h3 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <Coins size={32} className="text-yellow-400" />
            Praktische Finanz-Tipps
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {personalFinanceTips.map((tip, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="text-emerald-400">
                    <tip.icon size={32} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-3">{tip.title}</h4>
                    <p className="text-emerald-200 mb-4">{tip.tip}</p>
                    <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-lg p-3">
                      <p className="text-emerald-100 text-sm">
                        <strong>Beispiel:</strong> {tip.example}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
}
