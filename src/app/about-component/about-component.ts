import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, NgOptimizedImage, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PremiumAnimationsService } from '../shared/animations/premium-animations.service';

gsap.registerPlugin(ScrollTrigger);

interface Era {
  year: string;
  title: string;
  description: string;
  image: string;
}

interface Pillar {
  name: string;
  description: string;
  glyph: string;
}

@Component({
  selector: 'app-about-component',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, RouterModule],
  templateUrl: './about-component.html',
  styleUrl: './about-component.scss'
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  focusItems = [
    {
      title: 'Original IP Creation',
      description: 'We create unique, self-owned game worlds and stories that stand apart in the global gaming landscape.',
      icon: '𑁧'
    },
    {
      title: 'Cultural Depth with Modern Technology',
      description: 'We blend ancient cultural heritage with cutting-edge technology to craft meaningful and immersive experiences.',
      icon: '𑁨'
    },
    {
      title: 'World-Class Production Quality',
      description: 'We deliver AAA-level visuals, sound, and gameplay polished to meet international standards.',
      icon: '𑁩'
    },
    {
      title: 'Long-Lasting Game Universes',
      description: 'We build expansive universes designed to grow, evolve, and engage players for years.',
      icon: '𑁪'
    }
  ];

  pillars: Pillar[] = [
    {
      name: 'HERITAGE',
      description: 'Preserving the essence of ancient craftsmanship through digital preservation and immersive storytelling.',
      glyph: '&#x16A0;'
    },
    {
      name: 'INNOVATION',
      description: 'Pushing the boundaries of technology with neural interfaces and procedural world generation.',
      glyph: '&#x16D2;'
    },
    {
      name: 'IMPACT',
      description: 'Creating transformative experiences that reshape how we perceive history and the future.',
      glyph: '&#x16AB;'
    }
  ];

  eras: Era[] = [
    {
      year: '2026 Q1',
      title: '✦ Creative technology solutions for interactive media',
      description: 'We develop innovative technology-driven solutions that power engaging and interactive digital experiences.',
      image: 'assets/images/Creative technology solutions for interactive media.png'
    },
    {
      year: '2026 Q2',
      title: '◉ AR / VR experiences and immersive storytelling',
      description: 'We create immersive AR and VR experiences that place users at the center of powerful, interactive narratives.',
      image: 'assets/images/AR and VR experiences and immersive storytelling.png'
    },
    {
      year: '2026 Q3',
      title: '⬢ Real-time 3D, animation, and virtual production',
      description: 'We leverage real-time 3D pipelines to deliver high-quality animation and virtual production efficiently.',
      image: 'assets/images/Real-time 3D, animation, and virtual production.png'
    },
    {
      year: '2026 Q4',
      title: '⚙︎ High-end game art, VFX, and technical services for global clients',
      description: 'We provide world-class game art, visual effects, and technical services tailored for international studios and brands.',
      image: 'assets/images/High-end game art, VFX, and technical services for global clients.png'
    }
  ];

  private gsapContext: any = null;

  constructor(
    private el: ElementRef,
    private premiumAnimations: PremiumAnimationsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    setTimeout(() => {
      this.initAnimations();
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.gsapContext) {
      this.gsapContext.revert();
    }
    this.premiumAnimations.cleanup();
  }

  onMouseMove(event: MouseEvent): void {
    gsap.to('.stone-texture', {
      x: (event.clientX - window.innerWidth / 2) * 0.008,
      y: (event.clientY - window.innerHeight / 2) * 0.008,
      duration: 2,
      ease: 'power2.out'
    });

    gsap.to('.layer-far', {
      x: (event.clientX - window.innerWidth / 2) * 0.02,
      y: (event.clientY - window.innerHeight / 2) * 0.02,
      duration: 1.5,
      ease: 'power2.out'
    });

    gsap.to('.layer-mid', {
      x: (event.clientX - window.innerWidth / 2) * 0.01,
      y: (event.clientY - window.innerHeight / 2) * 0.01,
      duration: 1.8,
      ease: 'power2.out'
    });

    // Showcase Viewport Tilt
    const viewport = this.el.nativeElement.querySelector('.showcase-viewport');
    if (viewport) {
      const rect = viewport.getBoundingClientRect();
      if (event.clientY > rect.top - 200 && event.clientY < rect.bottom + 200) {
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        
        gsap.to('.showcase-layers', {
          rotationY: x * 15,
          rotationX: -y * 15,
          duration: 1,
          ease: 'power2.out'
        });
      }
    }
  }

  private initAnimations(): void {
    const self = this;
    this.gsapContext = gsap.context(() => {
      self.initHeroAnimations();
      self.initManifestoAnimations();
      self.initPillarsAnimations();
      self.initShowcaseAnimations();
      self.initFocusAnimations();
      self.initTimelineAnimations();
      self.initCTAAnimations();
    }, this.el.nativeElement);
  }

  protected initHeroAnimations(): void {
    const section = this.el.nativeElement.querySelector('.hero-section');
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        pin: true,
        pinSpacing: false
      }
    });

    tl.to('.layer-far', { y: 200, scale: 1.2, ease: 'none' }, 0)
      .to('.layer-mid', { y: 100, scale: 1.1, ease: 'none' }, 0)
      .to('.layer-near', { y: 50, ease: 'none' }, 0)
      .to('.hero-text-block', { y: -100, opacity: 0, filter: 'blur(20px)', ease: 'none' }, 0);

    // Initial entrance
    gsap.from('.title-line', {
      y: 100,
      opacity: 0,
      rotateX: -45,
      stagger: 0.2,
      duration: 1.5,
      ease: 'expo.out'
    });

    gsap.from('.hero-label', {
      opacity: 0,
      letterSpacing: '20px',
      duration: 2,
      ease: 'power4.out'
    });

    gsap.from('.hero-subtitle', {
      opacity: 0,
      y: 20,
      duration: 1.2,
      delay: 0.8,
      ease: 'power3.out'
    });
  }

  protected initManifestoAnimations(): void {
    const section = this.el.nativeElement.querySelector('.manifesto-section');
    if (!section) return;

    gsap.from('.manifesto-title', {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: -50,
      letterSpacing: '0.5em',
      duration: 1.5,
      ease: 'power4.out'
    });

    gsap.from('.manifesto-lead', {
      scrollTrigger: {
        trigger: '.manifesto-lead',
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.manifesto-text', {
      scrollTrigger: {
        trigger: '.manifesto-text',
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2
    });

    gsap.from('.visual-frame', {
      scrollTrigger: {
        trigger: '.manifesto-visual',
        start: 'top 70%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scale: 0.8,
      rotationY: 45,
      duration: 2,
      ease: 'expo.out'
    });

    // Frame corners animation
    gsap.from('.frame-corner', {
      scrollTrigger: {
        trigger: '.manifesto-visual',
        start: 'top 60%',
        toggleActions: 'play none none none'
      },
      scale: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'back.out(2)'
    });
  }

  protected initPillarsAnimations(): void {
    const section = this.el.nativeElement.querySelector('.pillars-section');
    if (!section) return;

    gsap.from('.pillars-title', {
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      filter: 'blur(10px)',
      duration: 1.2,
      ease: 'power3.out'
    });

    const pillarCards = this.el.nativeElement.querySelectorAll('.pillar-card');
    pillarCards.forEach((card: HTMLElement, i: number) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 60,
        rotationX: 15,
        duration: 1.2,
        delay: i * 0.15,
        ease: 'power4.out'
      });

      // Hover glow animation
      card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.card-glow'), {
          opacity: 0.6,
          scale: 1.2,
          duration: 0.5
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.card-glow'), {
          opacity: 0,
          scale: 1,
          duration: 0.5
        });
      });
    });
  }

  protected initShowcaseAnimations(): void {
    const section = this.el.nativeElement.querySelector('.showcase-section');
    if (!section) return;

    // Viewport Reveal
    gsap.from('.showcase-viewport', {
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scale: 0.9,
      filter: 'blur(30px)',
      duration: 1.8,
      ease: 'power4.out'
    });

    // Portal Core Reveal
    gsap.from('.portal-core', {
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scale: 0.5,
      z: -500,
      duration: 2,
      ease: 'expo.out',
      delay: 0.5
    });

    // Artifact Floating (Inside Core)
    gsap.to('.floating-artifact', {
      y: -20,
      rotation: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // HUD Node Reveal
    gsap.from('.hud-node', {
      scrollTrigger: {
        trigger: section,
        start: 'top 50%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      scale: 0,
      filter: 'blur(10px)',
      duration: 1,
      stagger: 0.15,
      ease: 'back.out(2)',
      delay: 1
    });

    // Information Reveal
    const infoTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.showcase-info',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    infoTl
      .from('.info-tag', { opacity: 0, x: -20, duration: 0.8 })
      .from('.showcase-title', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' }, '-=0.4')
      .from('.info-line', { scaleX: 0, transformOrigin: 'left center', duration: 0.8 }, '-=0.6')
      .from('.showcase-desc', { opacity: 0, y: 20, duration: 0.8 }, '-=0.4')
      .from('.stat', { opacity: 0, y: 20, stagger: 0.1, duration: 0.8 }, '-=0.4');

    // Layer Parallax on Scroll
    gsap.to('.layer-bg', {
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: 100,
      ease: 'none'
    });

    gsap.to('.portal-core', {
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: -50,
      ease: 'none'
    });
  }

  protected initFocusAnimations(): void {
    const section = this.el.nativeElement.querySelector('.focus-section');
    if (!section) return;

    gsap.from('.focus-header .section-marker', {
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      x: -30,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.from('.focus-title', {
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 50,
      filter: 'blur(15px)',
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2
    });

    const items = this.el.nativeElement.querySelectorAll('.focus-item');
    items.forEach((item: HTMLElement, i: number) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        delay: i * 0.1
      });

      item.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        item.style.setProperty('--mouse-x', `${x}px`);
        item.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }

  protected initTimelineAnimations(): void {
    const section = this.el.nativeElement.querySelector('.timeline-section');
    if (!section) return;

    gsap.from('.timeline-header .section-marker', {
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.from('.timeline-title', {
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 50,
      filter: 'blur(15px)',
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.1
    });

    gsap.from('.timeline-line', {
      scrollTrigger: {
        trigger: '.timeline-track',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1
      },
      scaleY: 0,
      transformOrigin: 'top center',
      ease: 'none'
    });

    const eraBlocks = this.el.nativeElement.querySelectorAll('.era-block');
    eraBlocks.forEach((block: HTMLElement, i: number) => {
      const marker = block.querySelector('.era-marker');
      const card = block.querySelector('.era-card');
      const visual = block.querySelector('.era-visual');
      const content = block.querySelector('.era-content');

      gsap.from(marker, {
        scrollTrigger: {
          trigger: block,
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(2)'
      });

      gsap.from(visual, {
        scrollTrigger: {
          trigger: block,
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: i % 2 === 0 ? -80 : 80,
        filter: 'blur(20px)',
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2
      });

      gsap.from(content, {
        scrollTrigger: {
          trigger: block,
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: i % 2 === 0 ? 60 : -60,
        duration: 1,
        ease: 'power3.out',
        delay: 0.4
      });

      if (visual) {
        gsap.to(visual.querySelector('.era-img'), {
          scrollTrigger: {
            trigger: block,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2
          },
          y: -30,
          ease: 'none'
        });
      }
    });
  }

  protected initCTAAnimations(): void {
    const section = this.el.nativeElement.querySelector('.cta-section');
    if (!section) return;

    gsap.from('.cta-title', {
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 60,
      scale: 0.95,
      filter: 'blur(15px)',
      duration: 1.4,
      ease: 'power3.out'
    });

    gsap.from('.cta-text', {
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power2.out',
      delay: 0.3
    });

    gsap.from('.cta-button', {
      scrollTrigger: {
        trigger: section,
        start: 'top 65%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      scale: 0.9,
      duration: 1,
      ease: 'back.out(1.5)',
      delay: 0.5
    });

    gsap.from('.rune', {
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      rotation: 180,
      stagger: 0.15,
      duration: 0.8,
      ease: 'back.out(2)',
      delay: 0.8
    });

    const btn = this.el.nativeElement.querySelector('.cta-button') as HTMLElement;
    if (btn) {
      this.premiumAnimations.createMagneticHover(btn, { strength: 0.25 });
    }
  }
}
