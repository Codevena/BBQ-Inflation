'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CountUpNumberProps {
  endValue: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  triggerOnce?: boolean;
}

export default function CountUpNumber({ 
  endValue, 
  duration = 2000, 
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
  triggerOnce = true
}: CountUpNumberProps) {
  const [currentValue, setCurrentValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
            startCountUp();
            if (triggerOnce) {
              setHasAnimated(true);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [endValue, duration, hasAnimated, triggerOnce, startCountUp]);

  const startCountUp = () => {
    setCurrentValue(0);
    
    gsap.to({ value: 0 }, {
      value: endValue,
      duration: duration / 1000,
      ease: "power2.out",
      onUpdate: function() {
        const value = this.targets()[0].value;
        setCurrentValue(value);
      }
    });
  };

  const formatValue = (value: number) => {
    // Use consistent formatting to avoid hydration issues
    const formatted = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);

    return `${prefix}${formatted}${suffix}`;
  };

  return (
    <span ref={elementRef} className={className}>
      {formatValue(currentValue)}
    </span>
  );
}
