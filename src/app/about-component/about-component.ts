import { Component, OnInit, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Era {
  year: string;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-about-component',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './about-component.html',
  styleUrl: './about-component.scss'
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  mouseX = 0;
  mouseY = 0;

  eras: Era[] = [
    {
      year: '300 BCE',
      title: 'THE CHOLA ASCENDANCE',
      description: 'The foundation of a maritime empire that would dominate the eastern seas for centuries. Built on stone, wisdom, and unyielding courage.',
      image: 'assets/images/home-page.png'
    },
    {
      year: '1010 CE',
      title: 'THE LIVING TEMPLES',
      description: 'Mastery of granite and geometry. Architectural marvels like Brihadeeswarar emerged as beacons of power and spiritual connection.',
      image: 'assets/images/home-curosel2.png'
    },
    {
      year: '2025 CE',
      title: 'THE NEURAL LEGACY',
      description: 'Translating ancient echoes into digital dimensions. We bridge the gap between stone inscriptions and neural interfaces.',
      image: 'assets/images/home-page.png'
    }
  ];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Center the torch initially
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initAnimations();
    }, 100);
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  onMouseMove(event: MouseEvent): void {
    // Subtle parallax background movement
    gsap.to('.stone-texture', {
      x: (event.clientX - window.innerWidth / 2) * 0.01,
      y: (event.clientY - window.innerHeight / 2) * 0.01,
      duration: 1.5,
      ease: 'power2.out'
    });
  }

  private initAnimations(): void {
    const ctx = gsap.context(() => {
      // 1. HERO REVEAL - Neat and Clean Fade-in
      const heroTl = gsap.timeline();
      
      heroTl.from('.main-title', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
      })
      .from('.ancient-script', {
        opacity: 0,
        letterSpacing: '3rem',
        duration: 1.5,
        ease: 'power2.out'
      }, '-=0.8')
      .from('.intro-text', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power2.out'
      }, '-=1')
      .from('.scroll-instruction', {
        opacity: 0,
        y: -20,
        duration: 1,
        ease: 'power2.out'
      }, '-=0.5');

      // 2. TIMELINE REVEAL - Staggered Slide-in
      gsap.utils.toArray('.era-block').forEach((block: any, i: number) => {
        const visual = block.querySelector('.era-visual');
        const content = block.querySelector('.era-content');
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: block,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });

        tl.from(visual, {
          x: i % 2 === 0 ? -50 : 50,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out'
        })
        .from(content, {
          x: i % 2 === 0 ? 50 : -50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        }, '-=0.8');

        // Subtle image scale on scroll
        gsap.to(block.querySelector('.era-img'), {
          scrollTrigger: {
            trigger: block,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          },
          scale: 1.05,
          ease: 'none'
        });
      });

      // 3. CTA REVEAL - Smooth Scale and Fade
      gsap.from('.eternal-seal-section .seal-content', {
        scrollTrigger: {
          trigger: '.eternal-seal-section',
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
      });

    }, this.el.nativeElement);
  }
}
