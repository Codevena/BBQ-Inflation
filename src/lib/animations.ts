import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const fadeInUp = (element: string | Element, delay: number = 0) => {
  return gsap.fromTo(element, 
    {
      opacity: 0,
      y: 50,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      delay,
      ease: "power2.out"
    }
  );
};

export const fadeInLeft = (element: string | Element, delay: number = 0) => {
  return gsap.fromTo(element,
    {
      opacity: 0,
      x: -50,
    },
    {
      opacity: 1,
      x: 0,
      duration: 1,
      delay,
      ease: "power2.out"
    }
  );
};

export const scaleIn = (element: string | Element, delay: number = 0) => {
  return gsap.fromTo(element,
    {
      opacity: 0,
      scale: 0.8,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 1,
      delay,
      ease: "back.out(1.7)"
    }
  );
};

export const drawLine = (element: string | Element, duration: number = 2) => {
  return gsap.fromTo(element,
    {
      strokeDasharray: "0 1000",
    },
    {
      strokeDasharray: "1000 0",
      duration,
      ease: "power2.inOut"
    }
  );
};

export const typeWriter = (element: string | Element, text: string, speed: number = 0.05) => {
  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;
  
  el.textContent = '';
  const chars = text.split('');
  
  return gsap.to({}, {
    duration: chars.length * speed,
    ease: "none",
    onUpdate: function() {
      const progress = this.progress();
      const currentIndex = Math.floor(progress * chars.length);
      el.textContent = chars.slice(0, currentIndex).join('');
    }
  });
};

export const parallaxScroll = (element: string | Element, speed: number = 0.5) => {
  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
};

export const pinSection = (element: string | Element, endTrigger?: string) => {
  return ScrollTrigger.create({
    trigger: element,
    start: "top top",
    end: endTrigger ? `${endTrigger} bottom` : "bottom top",
    pin: true,
    pinSpacing: false
  });
};

export const horizontalScroll = (container: string | Element, sections: string | Element[]) => {
  const containerEl = typeof container === 'string' ? document.querySelector(container) : container;
  if (!containerEl) return;

  const sectionsArray = Array.isArray(sections) ? sections : document.querySelectorAll(sections as string);
  
  return gsap.to(sectionsArray, {
    xPercent: -100 * (sectionsArray.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      snap: 1 / (sectionsArray.length - 1),
      end: () => "+=" + (containerEl as HTMLElement).offsetWidth
    }
  });
};

export const staggerAnimation = (elements: string | Element[], delay: number = 0.1) => {
  return gsap.fromTo(elements,
    {
      opacity: 0,
      y: 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: delay,
      ease: "power2.out"
    }
  );
};

export const morphPath = (element: string | Element, newPath: string, duration: number = 1) => {
  return gsap.to(element, {
    attr: { d: newPath },
    duration,
    ease: "power2.inOut"
  });
};

export const countUp = (element: string | Element, endValue: number, duration: number = 2) => {
  const el = typeof element === 'string' ? document.querySelector(element) : element;
  if (!el) return;

  return gsap.to({ value: 0 }, {
    value: endValue,
    duration,
    ease: "power2.out",
    onUpdate: function() {
      const currentValue = Math.round(this.targets()[0].value * 10) / 10;
      el.textContent = currentValue.toString();
    }
  });
};
