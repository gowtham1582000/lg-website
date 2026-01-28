import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, HostListener, signal } from '@angular/core';
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
      image: 'assets/images/animation-&-echnical-services.png',
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
    }
  ];


  currentIndex = signal<number>(0);
  isAnimating = false;
  private autoRotateInterval: any;
  private touchStartX: number = 0;
  private touchEndX: number = 0;

  ngAfterViewInit() {
    this.angleStep = 360 / this.services.length; // Dynamic step
    this.calculateDimensions();
    setTimeout(() => {
      this.initCarousel();
      this.startAutoRotate();
    }, 100);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.pauseAutoRotate();
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
    this.resumeAutoRotate();
  }

  private handleSwipe() {
    const swipeThreshold = 50;
    if (this.touchStartX - this.touchEndX > swipeThreshold) {
      this.rotate(1);
    } else if (this.touchEndX - this.touchStartX > swipeThreshold) {
      this.rotate(-1);
    }
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
    const total = this.services.length;
    let diff = index - this.currentIndex();

    // Normalize to shortest circular distance
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const angle = diff * this.angleStep;
    const radian = (angle * Math.PI) / 180;

    const x = Math.sin(radian) * this.radius;
    const z = Math.cos(radian) * this.radius - this.radius;

    const isActive = index === this.currentIndex();
    const scale = isActive ? 1.1 : Math.max(0.55, 0.6 + z / 1000);
    const opacity = isActive ? 1 : Math.max(0.3, 1 + z / 500);

    gsap.to(card, {
      x,
      z,
      rotateY: -angle * 0.5,
      scale,
      opacity,
      zIndex: Math.round(z + 1000),
      duration: 0.8,
      perspective: 1500,
      ease: 'power3.out'
    });
  }



  rotate(direction: number) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const nextIndex =
      (this.currentIndex() + direction + this.services.length) % this.services.length;

    this.currentIndex.set(nextIndex);

    const cards = document.querySelectorAll('.carousel-card');
    cards.forEach((card, i) => {
      this.positionCard(card as HTMLElement, i);
    });

    setTimeout(() => {
      this.isAnimating = false;
    }, 800);
  }


  goToSlide(index: number) {
    if (this.isAnimating || index === this.currentIndex()) return;
    this.isAnimating = true;
    this.currentIndex.set(index);

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
    }, 4000);
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
