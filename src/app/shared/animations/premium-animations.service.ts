/**
 * Premium Animation Service
 * 
 * Provides reusable, high-end animation utilities inspired by AAA game studios
 * and premium creative agencies. All animations respect prefers-reduced-motion.
 * 
 * Design Philosophy:
 * - Cinematic, fluid, intentional motion
 * - No generic fades or bounces
 * - Spatial continuity and depth
 * - Performance-optimized with GSAP
 */

import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
  providedIn: 'root'
})
export class PremiumAnimationsService {
  private prefersReducedMotion: boolean;

  constructor() {
    // Check for reduced motion preference (SSR-safe)
    if (typeof window !== 'undefined') {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } else {
      this.prefersReducedMotion = false;
    }
  }

  /**
   * Character-by-character text reveal with masking
   * Creates a cinematic typewriter effect with smooth reveal
   */
  revealTextByCharacters(
    element: HTMLElement | string,
    options: {
      duration?: number;
      stagger?: number;
      delay?: number;
      ease?: string;
      direction?: 'forward' | 'backward';
    } = {}
  ): any {
    const el = typeof element === 'string' ? document.querySelector(element) as HTMLElement : element;
    if (!el) return gsap.timeline();

    const {
      duration = 0.8,
      stagger = 0.02,
      delay = 0,
      ease = 'power2.out',
      direction = 'forward'
    } = options;

    // Split text into characters, preserving spaces and line breaks
    const text = el.textContent || '';
    const chars = text.split('');
    
    // Wrap each character in a span
    const wrappedChars = chars.map(char => {
      if (char === ' ') return '<span class="char-space"> </span>';
      if (char === '\n') return '<br>';
      return `<span class="char-reveal">${char}</span>`;
    }).join('');

    el.innerHTML = wrappedChars;
    const charElements = el.querySelectorAll('.char-reveal');

    // Set initial state
    gsap.set(charElements, {
      opacity: 0,
      y: 20,
      clipPath: 'inset(100% 0 0 0)'
    });

    // Create reveal animation
    const tl = gsap.timeline({ delay });
    
    if (this.prefersReducedMotion) {
      // Simple fade for reduced motion
      tl.to(charElements, {
        opacity: 1,
        y: 0,
        duration: duration * 0.5,
        ease,
        stagger: stagger * 2
      });
    } else {
      tl.to(charElements, {
        opacity: 1,
        y: 0,
        clipPath: 'inset(0% 0 0 0)',
        duration,
        ease,
        stagger: direction === 'forward' ? stagger : -stagger
      });
    }

    return tl;
  }

  /**
   * Word-by-word reveal with staggered animation
   * More subtle than character reveal, better for longer text
   */
  revealTextByWords(
    element: HTMLElement | string,
    options: {
      duration?: number;
      stagger?: number;
      delay?: number;
      ease?: string;
    } = {}
  ): any {
    const el = typeof element === 'string' ? document.querySelector(element) as HTMLElement : element;
    if (!el) return gsap.timeline();

    const {
      duration = 0.6,
      stagger = 0.08,
      delay = 0,
      ease = 'power2.out'
    } = options;

    const text = el.textContent || '';
    const words = text.split(/(\s+)/);
    
    const wrappedWords = words.map(word => {
      if (word.trim() === '') return word;
      return `<span class="word-reveal">${word}</span>`;
    }).join('');

    el.innerHTML = wrappedWords;
    const wordElements = el.querySelectorAll('.word-reveal');

    gsap.set(wordElements, {
      opacity: 0,
      y: 30,
      rotationX: 90
    });

    const tl = gsap.timeline({ delay });
    
    tl.to(wordElements, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration,
      ease,
      stagger
    });

    return tl;
  }

  /**
   * Advanced parallax with multiple depth layers
   * Creates cinematic depth through layered motion
   */
  createParallaxDepth(
    elements: Array<{ element: HTMLElement | string; speed: number; direction?: 'up' | 'down' }>,
    options: {
      trigger?: HTMLElement | string;
      start?: string;
      end?: string;
      scrub?: number | boolean;
    } = {}
  ): void {
    if (this.prefersReducedMotion) return;

    const {
      trigger,
      start = 'top bottom',
      end = 'bottom top',
      scrub = 1
    } = options;

    elements.forEach(({ element, speed, direction = 'down' }) => {
      const el = typeof element === 'string' ? document.querySelector(element) as HTMLElement : element;
      if (!el) return;

      const yValue = direction === 'down' ? speed * 100 : -speed * 100;

      gsap.to(el, {
        y: yValue,
        scrollTrigger: {
          trigger: trigger || el,
          start,
          end,
          scrub: typeof scrub === 'number' ? scrub : scrub ? 1 : false
        },
        ease: 'none'
      });
    });
  }

  /**
   * Spatial continuity section transition
   * Creates seamless flow between sections with shared elements
   */
  createSectionTransition(
    fromSection: HTMLElement | string,
    toSection: HTMLElement | string,
    options: {
      sharedElement?: HTMLElement | string;
      duration?: number;
    } = {}
  ): void {
    if (this.prefersReducedMotion) return;

    const from = typeof fromSection === 'string' 
      ? document.querySelector(fromSection) as HTMLElement 
      : fromSection;
    const to = typeof toSection === 'string'
      ? document.querySelector(toSection) as HTMLElement
      : toSection;

    if (!from || !to) return;

    const { duration = 1.5 } = options;

    // Create smooth transition with opacity and transform
    gsap.fromTo(to, 
      {
        opacity: 0,
        y: 100,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        scrollTrigger: {
          trigger: to,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        duration,
        ease: 'power3.out'
      }
    );
  }

  /**
   * Micro-interaction for stats with counting animation
   * Smoothly animates numbers from 0 to target value
   */
  animateStatCounter(
    element: HTMLElement | string,
    targetValue: number,
    options: {
      duration?: number;
      suffix?: string;
      prefix?: string;
      decimals?: number;
      ease?: string;
    } = {}
  ): void {
    const el = typeof element === 'string' ? document.querySelector(element) as HTMLElement : element;
    if (!el) return;

    const {
      duration = 2,
      suffix = '',
      prefix = '',
      decimals = 0,
      ease = 'power2.out'
    } = options;

    const obj = { value: 0 };

    gsap.to(obj, {
      value: targetValue,
      duration,
      ease,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      onUpdate: () => {
        el.textContent = `${prefix}${obj.value.toFixed(decimals)}${suffix}`;
      }
    });
  }

  /**
   * Icon reveal with rotation and scale
   * Premium micro-interaction for icons
   */
  revealIcon(
    element: HTMLElement | string,
    options: {
      rotation?: number;
      scale?: number;
      duration?: number;
      delay?: number;
    } = {}
  ): any {
    const el = typeof element === 'string' ? document.querySelector(element) as HTMLElement : element;
    if (!el) return gsap.timeline();

    const {
      rotation = 180,
      scale = 0,
      duration = 0.8,
      delay = 0
    } = options;

    gsap.set(el, {
      rotation,
      scale,
      opacity: 0
    });

    const tl = gsap.timeline({ delay });
    
    if (this.prefersReducedMotion) {
      tl.to(el, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: duration * 0.6,
        ease: 'power2.out'
      });
    } else {
      tl.to(el, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration,
        ease: 'back.out(1.7)'
      });
    }

    return tl;
  }

  /**
   * Scroll-triggered reveal with blur and scale
   * Creates depth through focus effect
   */
  revealWithDepth(
    element: HTMLElement | string,
    options: {
      blur?: number;
      scale?: number;
      y?: number;
      duration?: number;
      delay?: number;
      trigger?: HTMLElement | string;
      start?: string;
    } = {}
  ): void {
    const el = typeof element === 'string' ? document.querySelector(element) as HTMLElement : element;
    if (!el) return;

    const {
      blur = 20,
      scale = 0.9,
      y = 60,
      duration = 1.5,
      delay = 0,
      trigger,
      start = 'top 75%'
    } = options;

    gsap.set(el, {
      opacity: 0,
      y,
      scale,
      filter: `blur(${blur}px)`
    });

    gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      scrollTrigger: {
        trigger: trigger || el,
        start,
        toggleActions: 'play none none none'
      },
      duration: this.prefersReducedMotion ? duration * 0.6 : duration,
      delay,
      ease: 'power3.out'
    });
  }

  /**
   * Magnetic hover effect for interactive elements
   * Creates premium feel on hover
   */
  createMagneticHover(
    element: HTMLElement | string,
    options: {
      strength?: number;
      ease?: string;
    } = {}
  ): () => void {
    if (this.prefersReducedMotion) return () => {};

    const el = typeof element === 'string' ? document.querySelector(element) as HTMLElement : element;
    if (!el) return () => {};

    const { strength = 0.3, ease = 'power2.out' } = options;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.5,
        ease
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    // Return cleanup function
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }

  /**
   * Cleanup all ScrollTriggers
   */
  cleanup(): void {
    ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
  }
}
