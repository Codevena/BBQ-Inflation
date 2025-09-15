'use client';

import { useState, useEffect, useRef } from 'react';

interface SequentialTypewriterProps {
  texts: string[];
  speeds?: number[];
  delays?: number[];
  onComplete?: () => void;
}

export default function SequentialTypewriter({ 
  texts, 
  speeds = [80, 50], 
  delays = [500, 1000],
  onComplete 
}: SequentialTypewriterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayTexts, setDisplayTexts] = useState<string[]>(new Array(texts.length).fill(''));
  const [isComplete, setIsComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Runtime guards to avoid double-start (React StrictMode) and to clean timers
  const startedRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const intervalsRef = useRef<number[]>([]);
  const completedRef = useRef(false);

  // Warte auf Client-Side Hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Observe visibility to start typing only when in view (start earlier; add fallback)
  useEffect(() => {
    if (!isMounted) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      // Fallback: start immediately if IO not available
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.05, rootMargin: '0px 0px -10%' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMounted]);

  // Safety fallback: start regardless after short delay if not yet started (avoid freeze when scrolling upward)
  useEffect(() => {
    if (!isMounted || startedRef.current) return;
    const t = window.setTimeout(() => {
      if (!startedRef.current) setIsVisible(true);
    }, 1200);
    return () => window.clearTimeout(t);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || isComplete || startedRef.current || !isVisible) return;

    const typeText = (textIndex: number) => {
      if (textIndex >= texts.length) {
        if (!completedRef.current) {
          completedRef.current = true;
          setIsComplete(true);
          onComplete?.();
        }
        return;
      }

      setCurrentTextIndex(textIndex);
      const text = texts[textIndex];
      const speed = speeds[textIndex] || 50;
      const delay = delays[textIndex] || 0;

      const startTimeout = window.setTimeout(() => {
        let index = 0;
        const interval = window.setInterval(() => {
          if (index <= text.length) {
            setDisplayTexts(prev => {
              const newTexts = [...prev];
              newTexts[textIndex] = text.slice(0, index);
              return newTexts;
            });
            index++;
          } else {
            window.clearInterval(interval);
            intervalsRef.current = intervalsRef.current.filter(i => i !== interval);
            // Nächsten Text nach kurzer Pause (verkürzt)
            const nextTimeout = window.setTimeout(() => {
              typeText(textIndex + 1);
            }, 100);
            timeoutsRef.current.push(nextTimeout);
          }
        }, speed);
        intervalsRef.current.push(interval);
      }, delay);
      timeoutsRef.current.push(startTimeout);
    };

    startedRef.current = true;
    typeText(0);
    return () => {
      // Cleanup timers on unmount
      timeoutsRef.current.forEach(t => window.clearTimeout(t));
      intervalsRef.current.forEach(i => window.clearInterval(i));
      timeoutsRef.current = [];
      intervalsRef.current = [];
    };
  }, [isMounted, isVisible, texts, speeds, delays, isComplete, onComplete]);

  return (
    <div ref={containerRef}>
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
        {displayTexts[0]}
        {currentTextIndex === 0 && !isComplete && <span className="animate-pulse">|</span>}
      </h1>

      <p className="text-xl md:text-2xl text-blue-200 mb-12 leading-relaxed max-w-3xl mx-auto">
        {displayTexts[1]}
        {currentTextIndex === 1 && !isComplete && <span className="animate-pulse">|</span>}
        {isComplete && <span className="animate-pulse">|</span>}
      </p>
    </div>
  );
}
