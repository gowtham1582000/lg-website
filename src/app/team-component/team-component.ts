import { Component, AfterViewInit, HostListener, OnDestroy, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  id: number;
  name: string;
  role: string;
  category: string;
  image: string;
  bio: string;
  linkedin?: string;
  twitter?: string;
}

interface Particle {
  x: number;
  y: number;
  duration: number;
  delay: number;
  size: number;
}

interface CardTransform {
  rotateX: number;
  rotateY: number;
}

@Component({
  selector: 'app-team-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './team-component.html',
  styleUrls: ['./team-component.scss']
})
export class TeamComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('cardRef') cardRefs!: QueryList<ElementRef>;
  
  activeFilter = 'all';
  hoveredMember: TeamMember | null = null;
  particles: Particle[] = [];
  cardTransforms: Map<number, CardTransform> = new Map();
  private animationFrame: number | null = null;
  private mouseX = 0;
  private mouseY = 0;

  teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'GOWTHAM RAJA',
      role: 'FOUNDER & CREATIVE VISIONARY',
      category: 'leadership',
      image: 'https://i.pravatar.cc/400?u=gowtham',
      bio: 'A passionate storyteller and game enthusiast who founded Orchid to create mythological gaming experiences that bridge ancient legends with modern technology.',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    {
      id: 2,
      name: 'ARJUN MEHTA',
      role: 'TECHNICAL DIRECTOR',
      category: 'engineering',
      image: 'https://i.pravatar.cc/400?u=arjun',
      bio: 'Expert in Unreal Engine and custom game engines with 10+ years building AAA-quality combat systems, physics simulations, and real-time rendering pipelines.',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 3,
      name: 'RHEA SHARMA',
      role: 'ART DIRECTOR',
      category: 'creative',
      image: 'https://i.pravatar.cc/400?u=rhea',
      bio: 'Former concept artist at major studios, now leading our visual identity. Specializes in blending traditional Indian art styles with contemporary game aesthetics.',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    {
      id: 4,
      name: 'VIKRAM SINGH',
      role: 'LEAD GAME DESIGNER',
      category: 'creative',
      image: 'https://i.pravatar.cc/400?u=vikram',
      bio: 'Master of game mechanics and player psychology. Creates deeply engaging combat systems and progression loops inspired by souls-like and action RPG genres.',
      twitter: 'https://twitter.com'
    },
    {
      id: 5,
      name: 'PRIYA NAIR',
      role: 'NARRATIVE DIRECTOR',
      category: 'creative',
      image: 'https://i.pravatar.cc/400?u=priya',
      bio: 'Award-winning writer who crafts epic tales rooted in Hindu mythology. Transforms ancient epics into interactive narratives that resonate with modern audiences.',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 6,
      name: 'KARTHIK IYER',
      role: 'LEAD ENGINE PROGRAMMER',
      category: 'engineering',
      image: 'https://i.pravatar.cc/400?u=karthik',
      bio: 'Graphics programming wizard specializing in shader development, optimization, and creating stunning visual effects that bring our mythological worlds to life.',
      linkedin: 'https://linkedin.com'
    },
    {
      id: 7,
      name: 'ANANYA REDDY',
      role: 'STUDIO MANAGER',
      category: 'leadership',
      image: 'https://i.pravatar.cc/400?u=ananya',
      bio: 'Orchestrates our creative teams and production pipelines. Ensures every project milestone is met while maintaining the artistic vision and quality standards.',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    {
      id: 8,
      name: 'RAVI KRISHNAN',
      role: 'SENIOR 3D CHARACTER ARTIST',
      category: 'creative',
      image: 'https://i.pravatar.cc/400?u=ravi',
      bio: 'Digital sculptor extraordinaire who brings gods, demons, and heroes to life. Expert in ZBrush, Maya, and creating game-ready characters with cinematic quality.',
      linkedin: 'https://linkedin.com'
    }
  ];

  constructor() {
    this.generateParticles();
  }

  get filteredMembers(): TeamMember[] {
    if (this.activeFilter === 'all') {
      return this.teamMembers;
    }
    return this.teamMembers.filter(m => m.category === this.activeFilter);
  }

  ngAfterViewInit() {
    ScrollTrigger.getAll().forEach((t: ScrollTrigger) => t.kill());
    ScrollTrigger.refresh();
    
    setTimeout(() => {
      this.initAnimations();
      this.initScrollAnimations();
    }, 100);
  }

  ngOnDestroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    ScrollTrigger.getAll().forEach((t: ScrollTrigger) => t.kill());
  }

  private generateParticles() {
    this.particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * -20,
      size: 2 + Math.random() * 4
    }));
  }

  private initAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.from('.hero-tag', {
      y: 30,
      opacity: 0,
      duration: 1
    })
    .from('.title-line', {
      y: 100,
      opacity: 0,
      stagger: 0.15,
      duration: 1.2
    }, '-=0.6')
    .from('.hero-subtitle', {
      y: 20,
      opacity: 0,
      duration: 1
    }, '-=0.8')
    .from('.scroll-indicator', {
      opacity: 0,
      y: 20,
      duration: 1
    }, '-=0.5');

    gsap.fromTo('.filter-tab', 
      { y: 20, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.team-filter-section',
          start: 'top 90%'
        },
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out'
      }
    );

    gsap.from('.cta-content', {
      scrollTrigger: {
        trigger: '.team-cta',
        start: 'top 80%'
      },
      x: -50,
      opacity: 0,
      duration: 1
    });

    gsap.from('.cta-decoration', {
      scrollTrigger: {
        trigger: '.team-cta',
        start: 'top 80%'
      },
      scale: 0.8,
      opacity: 0,
      duration: 1,
      delay: 0.3
    });
  }

  private initScrollAnimations() {
    gsap.utils.toArray('.team-card').forEach((card: any, i: number) => {
      gsap.fromTo(card, 
        { 
          opacity: 0, 
          y: 80,
          rotateX: 15,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          delay: i * 0.08
        }
      );
    });

    gsap.fromTo('.grid-lines .h-line', 
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.team-grid-section',
          start: 'top 70%'
        }
      }
    );

    gsap.fromTo('.grid-lines .v-line', 
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 1.5,
        stagger: 0.15,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: '.team-grid-section',
          start: 'top 70%'
        }
      }
    );
  }

  setFilter(filter: string) {
    if (this.activeFilter === filter) return;
    
    const cards = document.querySelectorAll('.team-card');
    
    gsap.to(cards, {
      opacity: 0,
      y: 30,
      scale: 0.95,
      rotateY: -5,
      stagger: 0.03,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        this.activeFilter = filter;
        setTimeout(() => {
          const newCards = document.querySelectorAll('.team-card');
          gsap.fromTo(newCards, 
            { 
              opacity: 0, 
              y: 50, 
              scale: 0.9,
              rotateY: 10
            },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              rotateY: 0,
              stagger: 0.08, 
              duration: 0.5,
              ease: 'back.out(1.2)'
            }
          );
        }, 50);
      }
    });
  }

  getFilterCount(category: string): number {
    return this.teamMembers.filter(m => m.category === category).length;
  }

  onCardHover(member: TeamMember, event: MouseEvent) {
    this.hoveredMember = member;
    const card = (event.currentTarget as HTMLElement);
    
    gsap.to(card.querySelector('.card-shimmer'), {
      opacity: 1,
      duration: 0.3
    });

    gsap.to(card.querySelector('.scan-line'), {
      top: '100%',
      duration: 0.8,
      ease: 'power2.inOut'
    });

    gsap.to(card.querySelector('.hover-ring'), {
      scale: 1.5,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.to(card.querySelectorAll('.corner-accent span'), {
      scale: 1,
      opacity: 1,
      stagger: 0.05,
      duration: 0.3
    });

    const otherCards = document.querySelectorAll('.team-card:not(.is-hovered)');
    gsap.to(otherCards, {
      opacity: 0.4,
      scale: 0.98,
      duration: 0.4,
      ease: 'power2.out'
    });
  }

  onCardLeave(event: MouseEvent) {
    const card = (event.currentTarget as HTMLElement);
    this.hoveredMember = null;
    this.cardTransforms.clear();

    gsap.to(card.querySelector('.card-shimmer'), {
      opacity: 0,
      duration: 0.3
    });

    gsap.set(card.querySelector('.scan-line'), {
      top: '-10%'
    });

    gsap.to(card.querySelector('.hover-ring'), {
      scale: 1,
      opacity: 0.5,
      duration: 0.3
    });

    gsap.to(card.querySelectorAll('.corner-accent span'), {
      scale: 0,
      opacity: 0,
      duration: 0.2
    });

    gsap.to(card.querySelector('.card-inner'), {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power3.out'
    });

    const allCards = document.querySelectorAll('.team-card');
    gsap.to(allCards, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    });
  }

  onCardMove(event: MouseEvent) {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const rotateY = ((event.clientX - centerX) / (rect.width / 2)) * 8;
    const rotateX = -((event.clientY - centerY) / (rect.height / 2)) * 8;

    if (this.hoveredMember) {
      this.cardTransforms.set(this.hoveredMember.id, { rotateX, rotateY });
    }

    const shimmer = card.querySelector('.card-shimmer') as HTMLElement;
    if (shimmer) {
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      shimmer.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(212, 175, 55, 0.3) 0%, transparent 50%)`;
    }
  }

  getCardTransform(memberId: number): string {
    const transform = this.cardTransforms.get(memberId);
    if (transform) {
      return `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`;
    }
    return 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  }

  onSocialHover(event: MouseEvent) {
    const link = event.currentTarget as HTMLElement;
    gsap.fromTo(link.querySelector('.social-bg'), 
      { scale: 0 },
      { scale: 1, duration: 0.4, ease: 'power2.out' }
    );
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    
    gsap.to('.orb-1', {
      x: x * 1.5,
      y: y * 1.5,
      duration: 2,
      ease: 'power1.out'
    });

    gsap.to('.orb-2', {
      x: -x * 1.2,
      y: -y * 1.2,
      duration: 2.5,
      ease: 'power1.out'
    });

    gsap.to('.floating-particles', {
      x: x * 0.5,
      y: y * 0.5,
      duration: 3,
      ease: 'power1.out'
    });
  }
}
