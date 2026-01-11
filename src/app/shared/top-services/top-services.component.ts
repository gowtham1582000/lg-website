import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-top-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-services.component.html',
  styleUrls: ['./top-services.component.scss']
})
export class TopServicesComponent implements AfterViewInit, OnDestroy {
  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  private radius = 400;
  private angleStep = 0; // Will be calculated based on length

  @HostListener('window:resize')
  onResize() {
    this.calculateDimensions();
    this.updateCarouselPositions();
  }
  services = [
    {
      id: 'I',
      title: 'GAME ART & VISUAL DEVELOPMENT',
      description: 'We craft immersive worlds through concept art, environments, and visuals that define the soul of the game.',
      image: 'assets/images/game-art-service.png',
      tags: ['PC', 'CONSOLE', 'MOBILE']
    },
    {
      id: 'II',
      title: 'ANIMATION & TECHNICAL ART',
      description: 'We bring characters and systems to life with fluid animation and optimized technical artistry.',
      image: 'assets/images/ANIMATION-service.png',
      tags: ['REALTIME', 'CINEMATIC', 'GAMEPLAY']
    },
    {
      id: 'III',
      title: 'GAME DESIGN AND DEVELOPMENT',
      description: 'We design and build gameplay experiences where mechanics, story, and player choice merge seamlessly.',
      image: 'assets/images/Game-Design-service.png',
      tags: ['UNITY', 'UNREAL', 'CUSTOM ENGINE']
    },
    {
      id: 'IV',
      title: 'WEB & DIGITAL PLATFORM DEVELOPMENT',
      description: 'We design and develop modern, responsive websites that deliver performance, clarity, and seamless user experience.',
      image: 'assets/images/website-service.png',
      tags: ['ANGULAR', 'GIT', 'UI/UX']
    },
    // {
    //   id: 'V',
    //   title: 'GAMIFICATION',
    //   description: 'Transforming experiences through game-driven engagement and logic.',
    //   image: 'assets/images/service-5.jpg',
    //   tags: ['EDTECH', 'RETAIL', 'TRAINING']
    // }
  ];

  currentIndex = 0;
  isAnimating = false;
  private autoRotateInterval: any;

  ngAfterViewInit() {
    this.angleStep = 360 / this.services.length; // Dynamic step
    this.calculateDimensions();
    setTimeout(() => {
      this.initCarousel();
      this.startAutoRotate();
    }, 100);
  }

  private calculateDimensions() {
    const width = window.innerWidth;
    if (width < 768) {
      this.radius = width * 0.7; // Smaller radius for mobile
    } else if (width < 1200) {
      this.radius = 300;
    } else {
      this.radius = 450; // Larger for wide screens
    }
  }

  private updateCarouselPositions() {
    const cards = document.querySelectorAll('.carousel-card');
    cards.forEach((card, i) => {
      this.positionCard(card as HTMLElement, i);
    });
  }

  ngOnDestroy() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
    }
  }

  initCarousel() {
    const cards = document.querySelectorAll('.carousel-card');
    cards.forEach((card, i) => {
      this.positionCard(card as HTMLElement, i);
    });
  }

  positionCard(card: HTMLElement, index: number) {
      const angle = (index - this.currentIndex) * this.angleStep;
      const radian = (angle * Math.PI) / 180;
      
      // Dynamic Z-space for clarity
      const x = Math.sin(radian) * this.radius;
      const z = Math.cos(radian) * this.radius - this.radius;
      
      // Scale logic: make sure the active card is much larger (1.2) than background cards
      const isActive = index === this.currentIndex;
      const scale = isActive ? 1.1 : Math.max(0.5, 0.6 + (z / 1000));
      const opacity = isActive ? 1 : Math.max(0.2, 1 + (z / 500));
      
      gsap.to(card, {
        x: x,
        z: z,
        rotateY: angle * -0.5, // Subtle counter-rotation for readability
        scale: scale,
        opacity: opacity,
        zIndex: Math.round(z + 1000),
        duration: 0.8,
        perspective: 1500,
        ease: 'power3.out'
      });
    } 


  rotate(direction: number) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    this.currentIndex = (this.currentIndex + direction + this.services.length) % this.services.length;
    
    const cards = document.querySelectorAll('.carousel-card');
    cards.forEach((card, i) => {
      this.positionCard(card as HTMLElement, i);
    });

    setTimeout(() => {
      this.isAnimating = false;
    }, 800);
  }

  goToSlide(index: number) {
    if (this.isAnimating || index === this.currentIndex) return;
    this.isAnimating = true;
    this.currentIndex = index;

    const cards = document.querySelectorAll('.carousel-card');
    cards.forEach((card, i) => {
      this.positionCard(card as HTMLElement, i);
    });

    setTimeout(() => {
      this.isAnimating = false;
    }, 800);
  }

  startAutoRotate() {
    this.autoRotateInterval = setInterval(() => {
      this.rotate(1);
    }, 3000);
  }

  pauseAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
    }
  }

  resumeAutoRotate() {
    this.startAutoRotate();
  }
}
