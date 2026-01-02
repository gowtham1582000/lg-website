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
        image: '../../assets/images/home-page.png'
      },
      {
        image: '../../assets/images/hero-page-2.jpg'
      },
      {
        image: '../../assets/images/hero-page-3.jpg'
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
  }

  initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.nav-dot');

    // Initial animation for the first slide
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

    // Add transitioning-out class for SCSS animation
    prevSlide.classList.add('transitioning-out');

    gsap.to(prevSlide, {
      opacity: 0,
      scale: 1.1,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        prevSlide.classList.remove('active', 'transitioning-out');
        nextSlide.classList.add('active');
        this.currentSlide = index;
        this.animateSlide(index);
        this.isTransitioning = false;
      }
    });
  }

  animateSlide(index: number) {
    const slides = document.querySelectorAll('.slide');
    const activeSlide = slides[index];
    const bg = activeSlide.querySelector('.slide-bg');

    gsap.set(activeSlide, { opacity: 1 });
    
    if (bg) {
      gsap.fromTo(bg,
        { scale: 1.3, filter: 'blur(10px) brightness(2)' },
        { scale: 1.1, filter: 'blur(0px) brightness(1)', duration: 1.5, ease: 'power2.out' }
      );
    }
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
