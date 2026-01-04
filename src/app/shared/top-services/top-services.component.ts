import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
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

  services = [
    {
      id: 'I',
      title: 'GAME ART & VISUAL DEVELOPMENT',
      description: 'We craft immersive worlds through concept art, environments, and visuals that define the soul of the game.',
      image: 'assets/images/service-1.jpg',
      tags: ['PC', 'CONSOLE', 'MOBILE']
    },
    {
      id: 'II',
      title: 'ANIMATION & TECHNICAL ART',
      description: 'We bring characters and systems to life with fluid animation and optimized technical artistry.',
      image: 'assets/images/service-2.jpg',
      tags: ['REALTIME', 'CINEMATIC', 'GAMEPLAY']
    },
    {
      id: 'III',
      title: 'GAME DESIGN AND DEVELOPMENT',
      description: 'We design and build gameplay experiences where mechanics, story, and player choice merge seamlessly.',
      image: 'assets/images/service-3.jpg',
      tags: ['UNITY', 'UNREAL', 'CUSTOM ENGINE']
    },
    {
      id: 'IV',
      title: 'WEB & DIGITAL PLATFORM DEVELOPMENT',
      description: 'We design and develop modern, responsive websites that deliver performance, clarity, and seamless user experience.',
      image: 'assets/images/service-4.jpg',
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
  private radius = 400;
  private angleStep = 360 / 5;

  ngAfterViewInit() {
    setTimeout(() => {
      this.initCarousel();
      this.startAutoRotate();
    }, 100);
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
    
    const x = Math.sin(radian) * this.radius;
    const z = Math.cos(radian) * this.radius - this.radius;
    const rotateY = angle;
    
    const scale = z < -this.radius ? 0.6 : 0.6 + (0.4 * (z + this.radius) / this.radius);
    const opacity = z < -this.radius * 0.5 ? 0.3 : 0.3 + (0.7 * (z + this.radius) / this.radius);
    const zIndex = Math.round((z + this.radius) / 10);

    gsap.to(card, {
      x: x,
      z: z,
      rotateY: rotateY,
      scale: scale,
      opacity: opacity,
      zIndex: zIndex,
      duration: 0.8,
      ease: 'power2.out'
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
    }, 5000);
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
