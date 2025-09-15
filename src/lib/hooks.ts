import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import Lenis from 'lenis';

export const useLenis = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.6,  // Reduziert von 1.2 für direkteres Gefühl
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  type LenisScrollOptions = {
    duration?: number;
    offset?: number;
    immediate?: boolean;
    lock?: boolean;
    easing?: (t: number) => number;
    [key: string]: unknown;
  };
  const scrollTo = useCallback((target: string | number, options?: LenisScrollOptions) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    }
  }, []);

  return { lenis: lenisRef.current, scrollTo };
};

export const useKeyboardNavigation = (sections: string[], onNavigate?: (index: number) => void) => {
  const [currentSection, setCurrentSection] = useState(0);
  const { scrollTo } = useLenis();

  const navigateToSection = useCallback((index: number) => {
    if (index >= 0 && index < sections.length) {
      setCurrentSection(index);
      scrollTo(sections[index], { duration: 1 });
      onNavigate?.(index);
    }
  }, [sections, scrollTo, onNavigate]);

  // Scroll detection to update current section
  useEffect(() => {
    const updateCurrentSection = () => {
      const sectionElements = sections.map(id => document.querySelector(id));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;

          if (scrollPosition >= elementTop) {
            if (i !== currentSection) {
              setCurrentSection(i);
            }
            break;
          }
        }
      }
    };

    // Throttle scroll events
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateCurrentSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    updateCurrentSection(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, currentSection]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          navigateToSection(currentSection + 1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          navigateToSection(currentSection - 1);
          break;
        case 'Home':
          e.preventDefault();
          navigateToSection(0);
          break;
        case 'End':
          e.preventDefault();
          navigateToSection(sections.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, navigateToSection]);

  return { currentSection, navigateToSection };
};

export const useScrollTrigger = (
  trigger: string,
  animation: () => gsap.core.Timeline | gsap.core.Tween,
  options?: ScrollTrigger.Vars
) => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = animation();
      
      ScrollTrigger.create({
        trigger,
        start: "top 80%",
        end: "bottom 20%",
        animation: tl,
        toggleActions: "play none none reverse",
        ...options
      });
    });

    return () => ctx.revert();
  }, [trigger, animation, options]);
};

export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit
) => {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => callback(entry.isIntersecting),
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [elementRef, callback, options]);
};

export const useAnimationOnScroll = (
  elementRef: React.RefObject<Element>,
  animationFn: (element: Element) => void,
  threshold: number = 0.1
) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useIntersectionObserver(
    elementRef,
    (isIntersecting) => {
      if (isIntersecting && !hasAnimated && elementRef.current) {
        animationFn(elementRef.current);
        setHasAnimated(true);
      }
    },
    { threshold }
  );

  return hasAnimated;
};

export const useChartAnimation = (
  chartRef: React.RefObject<{ chartInstance?: { data: { datasets: Array<{ data: number[] }> }; update: (mode?: unknown) => void } }>,
  data: number[],
  duration: number = 2
) => {
  const [animatedData, setAnimatedData] = useState<number[]>(new Array(data.length).fill(0));

  const startAnimation = useCallback(() => {
    gsap.to({ progress: 0 }, {
      progress: 1,
      duration,
      ease: "power2.out",
      onUpdate: function() {
        const progress = this.targets()[0].progress;
        const newData = data.map(value => value * progress);
        setAnimatedData([...newData]);
        
        if (chartRef.current?.chartInstance) {
          chartRef.current.chartInstance.data.datasets[0].data = newData;
          chartRef.current.chartInstance.update('none');
        }
      }
    });
  }, [data, duration, chartRef]);

  return { animatedData, startAnimation };
};

export const useTypewriter = (
  text: string,
  speed: number = 50,
  startDelay: number = 0
) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Warte auf Client-Side Hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Nur auf Client-Side ausführen
    if (!isMounted) return;

    // Reset State
    setDisplayText('');
    setIsComplete(false);

    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [isMounted, text, speed, startDelay]);

  return { displayText, isComplete };
};

export const useCountUp = (
  endValue: number,
  duration: number = 2000,
  startDelay: number = 0
) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const startAnimation = useCallback(() => {
    setCurrentValue(0);
    setIsComplete(false);

    setTimeout(() => {
      gsap.to({ value: 0 }, {
        value: endValue,
        duration: duration / 1000,
        ease: "power2.out",
        onUpdate: function() {
          setCurrentValue(Math.round(this.targets()[0].value * 10) / 10);
        },
        onComplete: () => setIsComplete(true)
      });
    }, startDelay);
  }, [endValue, duration, startDelay]);

  return { currentValue, isComplete, startAnimation };
};
