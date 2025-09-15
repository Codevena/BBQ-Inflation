'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Home } from 'lucide-react';
import { quizQuestions } from '@/data/inflationData';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface QuizState {
  currentQuestion: number;
  selectedAnswers: (number | null)[];
  showResults: boolean;
  score: number;
}

export default function QuizSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    selectedAnswers: new Array(quizQuestions.length).fill(null),
    showResults: false,
    score: 0
  });

  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup
      gsap.set([titleRef.current, quizRef.current], {
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
      .to(quizRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5');

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...quizState.selectedAnswers];
    newAnswers[quizState.currentQuestion] = answerIndex;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswers: newAnswers
    }));

    // Show explanation after selection
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestion < quizQuestions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
      setShowExplanation(false);
    } else {
      // Calculate final score
      const score = quizState.selectedAnswers.reduce((total: number, answer, index) => {
        return total + (answer === quizQuestions[index].correct ? 1 : 0);
      }, 0);
      
      setQuizState(prev => ({
        ...prev,
        showResults: true,
        score
      }));
    }
  };

  const handlePrevQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1
      }));
      setShowExplanation(quizState.selectedAnswers[quizState.currentQuestion - 1] !== null);
    }
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      selectedAnswers: new Array(quizQuestions.length).fill(null),
      showResults: false,
      score: 0
    });
    setShowExplanation(false);
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'Ausgezeichnet! Du verstehst Inflation sehr gut! 🎉';
    if (percentage >= 60) return 'Gut gemacht! Du hast ein solides Verständnis. 👍';
    return 'Nicht schlecht, aber da ist noch Luft nach oben! 📖';
  };

  const currentQuestion = quizQuestions[quizState.currentQuestion];
  const selectedAnswer = quizState.selectedAnswers[quizState.currentQuestion];

  return (
    <section 
      id="quiz" 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-slate-900 to-blue-900 py-20"
    >
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h2 
            ref={titleRef}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
          >
            Quiz zum Thema
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 block">
              Inflation
            </span>
          </h2>
          <p className="text-xl text-green-200">
            Wie gut verstehst du das Thema Inflation?
          </p>
        </div>

        <div ref={quizRef}>
          {!quizState.showResults ? (
            /* Quiz Questions */
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-green-200 text-sm">
                    Frage {quizState.currentQuestion + 1} von {quizQuestions.length}
                  </span>
                  <span className="text-green-200 text-sm">
                    {Math.round(((quizState.currentQuestion + 1) / quizQuestions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((quizState.currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-6 leading-relaxed">
                  {currentQuestion.question}
                </h3>

                {/* Answer Options */}
                <div className="space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                        selectedAnswer === index
                          ? index === currentQuestion.correct
                            ? 'bg-green-500/20 border-green-400 text-green-100'
                            : 'bg-red-500/20 border-red-400 text-red-100'
                          : selectedAnswer !== null && index === currentQuestion.correct
                            ? 'bg-green-500/20 border-green-400 text-green-100'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40'
                      } ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                          selectedAnswer === index
                            ? index === currentQuestion.correct
                              ? 'border-green-400 bg-green-400 text-green-900'
                              : 'border-red-400 bg-red-400 text-red-900'
                            : selectedAnswer !== null && index === currentQuestion.correct
                              ? 'border-green-400 bg-green-400 text-green-900'
                              : 'border-white/40'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {selectedAnswer !== null && (
                          <div className="text-xl">
                            {index === currentQuestion.correct ? '✓' : selectedAnswer === index ? '✗' : ''}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className="mb-8 p-6 bg-blue-500/10 border border-blue-400/30 rounded-xl animate-fadeIn">
                  <h4 className="font-semibold text-blue-300 mb-2">💡 Erklärung:</h4>
                  <p className="text-blue-100 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevQuestion}
                  disabled={quizState.currentQuestion === 0}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Zurück
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {quizState.currentQuestion === quizQuestions.length - 1 ? 'Ergebnis anzeigen' : 'Weiter →'}
                </button>
              </div>
            </div>
          ) : (
            /* Results */
            <div ref={resultsRef} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="mb-8">
                <Target size={64} className="text-blue-400 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-white mb-4">
                  Quiz abgeschlossen!
                </h3>
                <div className={`text-5xl font-bold mb-4 ${getScoreColor(quizState.score, quizQuestions.length)}`}>
                  {quizState.score} / {quizQuestions.length}
                </div>
                <p className="text-xl text-green-200 mb-6">
                  {getScoreMessage(quizState.score, quizQuestions.length)}
                </p>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-500/20 rounded-xl p-4 border border-green-400/30">
                  <div className="text-2xl font-bold text-green-400">{quizState.score}</div>
                  <div className="text-green-200">Richtig</div>
                </div>
                <div className="bg-red-500/20 rounded-xl p-4 border border-red-400/30">
                  <div className="text-2xl font-bold text-red-400">{quizQuestions.length - quizState.score}</div>
                  <div className="text-red-200">Falsch</div>
                </div>
                <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round((quizState.score / quizQuestions.length) * 100)}%
                  </div>
                  <div className="text-blue-200">Erfolgsquote</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all font-semibold"
                >
                  🔄 Nochmal versuchen
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-8 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors font-semibold"
                >
                  <Home size={20} className="mr-2" />
                  Zum Anfang
                </button>
              </div>

              {/* Thank You Message */}
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30">
                <h4 className="text-xl font-bold text-white mb-2">
                  🙏 Vielen Dank!
                </h4>
                <p className="text-purple-200">
                  Du hast die interaktive Inflation-Präsentation erfolgreich abgeschlossen. 
                  Ich hoffe, du konntest viel über dieses wichtige Wirtschaftsthema lernen!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
