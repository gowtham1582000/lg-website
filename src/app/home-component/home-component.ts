import { CommonModule } from '@angular/common';
import { Component, computed, signal, OnInit, AfterViewInit } from '@angular/core';
import { VideoScrollExpandComponent } from '../shared/video-scroll-expand/video-scroll-expand.component';
import { TopServicesComponent } from '../shared/top-services/top-services.component';
import { SplitServiceRevealComponent } from '../shared/split-service-reveal/split-service-reveal.component';
import { ThreeDViewerComponent } from '../shared/three-d-viewer/three-d-viewer.component';
import { gsap } from 'gsap';

interface GameFeature {
  id: string;
  title: string;
  icon: string;
  description: string;
  status: 'ONLINE' | 'LOCKED' | 'MAINTENANCE';
}

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule, VideoScrollExpandComponent, TopServicesComponent, SplitServiceRevealComponent, ThreeDViewerComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {
  sliderValue=signal<number>(50);
  
  currentSlide = 0;
  totalSlides = 3;
  isTransitioning = false;

    heroSlides = [
      {
        image: '../../assets/images/Slider-One.png'
      },
      {
        image: '../../assets/images/Slider-2.png'
      },
      {
        image: '../../assets/images/Slider-3.png'
      }
    ];

  features: GameFeature[] = [
    { id: 'F01', title: 'TACTICAL OPS', icon: 'fa-crosshairs', description: '5v5 competitive defusal mode.', status: 'ONLINE' },
    { id: 'F02', title: 'ARSENAL', icon: 'fa-gun', description: 'Over 50 customizable weapon platforms.', status: 'ONLINE' },
    { id: 'F03', title: 'RANKED', icon: 'fa-trophy', description: 'Skill-based matchmaking ladder.', status: 'ONLINE' },
    { id: 'F04', title: 'CLAN WARS', icon: 'fa-users', description: 'Weekly territory control tournaments.', status: 'LOCKED' },
    { id: 'F05', title: 'BATTLE PASS', icon: 'fa-ticket', description: 'Season 1: Cyber-Dawn rewards.', status: 'ONLINE' },
    { id: 'F06', title: 'ANTI-CHEAT', icon: 'fa-shield-halved', description: 'Kernel-level protection system.', status: 'MAINTENANCE' }
  ];

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initSlider();
    this.startAutoPlay();
    this.initMouseParallax();
  }

  initMouseParallax() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    slider.addEventListener('mousemove', (e: any) => {
      if (this.isTransitioning) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPos = (clientX / innerWidth) - 0.5;
      const yPos = (clientY / innerHeight) - 0.5;
      
      const activeBg = document.querySelector('.slide.active .slide-bg');
      if (activeBg) {
        gsap.to(activeBg, {
          duration: 1.5,
          x: xPos * 100,
          y: yPos * 100,
          rotationY: xPos * 10,
          rotationX: -yPos * 10,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }
    });
  }

  initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.nav-dot');

    // Initial animation for the first slide
    gsap.set(slides, { opacity: 0, visibility: 'hidden', zIndex: 1 });
    if (slides[0]) {
      slides[0].classList.add('active');
      gsap.set(slides[0], { opacity: 1, visibility: 'visible', zIndex: 2 });
      const bg = slides[0].querySelector('.slide-bg');
      if (bg) gsap.set(bg, { scale: 1, z: 0 });
    }
    this.animateSlide(0);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (this.currentSlide !== index && !this.isTransitioning) {
          this.goToSlide(index);
        }
      });
    });
  }

 goToSlide(index: number) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.nav-dot');
    
    if (!slides.length || !slides[this.currentSlide] || !slides[index]) {
      this.isTransitioning = false;
      return;
    }

    const prevSlide = slides[this.currentSlide];
    const nextSlide = slides[index];

    // Update dots
    if (dots[this.currentSlide]) dots[this.currentSlide].classList.remove('active');
    if (dots[index]) dots[index].classList.add('active');

    // 3D Transition
    const direction = index > this.currentSlide ? 1 : -1;

    // Outgoing slide animation
    gsap.to(prevSlide, {
      opacity: 0,
      z: -3000,
      rotationY: direction * 360,
      rotationX: direction * 45,
      scale: 0.2,
      duration: 2.5,
      ease: 'expo.inOut',
      onComplete: () => {
        prevSlide.classList.remove('active', 'transitioning-out');
        gsap.set(prevSlide, { visibility: 'hidden', z: 0, rotationY: 0, rotationX: 0, scale: 1 });
      }
    });

    // Incoming slide setup
    nextSlide.classList.add('active');
    const nextBg = nextSlide.querySelector('.slide-bg');
    if (nextBg) {
      gsap.set(nextBg, { scale: 1, z: 0 });
    }

    gsap.set(nextSlide, { 
      opacity: 0, 
      visibility: 'visible', 
      z: 3000, 
      rotationY: direction * -360,
      rotationX: direction * -45,
      scale: 0.2,
      zIndex: 2 
    });

    // Incoming slide animation
    gsap.to(nextSlide, {
      opacity: 1,
      z: 0,
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      duration: 2.5,
      ease: 'expo.inOut',
      onComplete: () => {
        this.currentSlide = index;
        this.animateSlide(index);
        this.isTransitioning = false;
      }
    });
  }
  animateSlide(index: number) {
   
  }

  startAutoPlay() {
    setInterval(() => {
      if (!this.isTransitioning) {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
      }
    }, 8000);
  }

  updateSlider(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.sliderValue.set(parseInt(value, 10));
  }
  dangerMode = computed(() => this.sliderValue() > 80);

  runes = [
    { id: 1, char: 'ᚠ' }, { id: 2, char: 'ᚢ' }, 
    { id: 3, char: 'ᚦ' }, { id: 4, char: 'ᚩ' }
  ];
  correctSequence = [3, 1, 4, 2]; // The secret order
  
  // State
  userSequence: number[] = [];
  storyUnlocked = false;
  isError = false;
  statusMessage = "WAITING_FOR_INPUT...";

  inputRune(id: number) {
    if (this.isError || this.storyUnlocked) return;

    this.userSequence.push(id);
    
    // Check if the current click matches the sequence
    const currentIndex = this.userSequence.length - 1;
    if (this.userSequence[currentIndex] !== this.correctSequence[currentIndex]) {
      this.handleError();
      return;
    }

    // Check for win
    if (this.userSequence.length === this.correctSequence.length) {
      this.statusMessage = "DECRYPTION_SUCCESSFUL";
      setTimeout(() => this.storyUnlocked = true, 1000);
    }
  }

  handleError() {
    this.isError = true;
    this.statusMessage = "SEQUENCE_ERROR: RESETTING_CORE";
    setTimeout(() => {
      this.userSequence = [];
      this.isError = false;
      this.statusMessage = "WAITING_FOR_INPUT...";
    }, 1500);
  }
}
