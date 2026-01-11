import { CommonModule } from '@angular/common';
import { Component, computed, signal, OnInit, AfterViewInit } from '@angular/core';
import { VideoScrollExpandComponent } from '../shared/video-scroll-expand/video-scroll-expand.component';
import { TopServicesComponent } from '../shared/top-services/top-services.component';
import { SplitServiceRevealComponent } from '../shared/split-service-reveal/split-service-reveal.component';
import { ThreeDViewerComponent } from '../shared/three-d-viewer/three-d-viewer.component';
import { VideoSliderComponent } from '../shared/video-slider/video-slider';
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
  imports: [CommonModule, VideoScrollExpandComponent, TopServicesComponent, SplitServiceRevealComponent, ThreeDViewerComponent, VideoSliderComponent],
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
        Image: '/assets/images/final-attempt.png'
      },
      {
        image: '/assets/images/Slider-2.png'
      },
      {
        image: '/assets/images/Slider-3.png'
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
   setTimeout(() => {
      this.initCarousel();
      this.startAutoPlay();
    }, 100);
  }

  initCarousel() {
    // Initialize slides with fade animation
    const items = document.querySelectorAll('.slide-item');
    if (items.length === 0) return;

    // Set initial state - first slide should be visible
    items.forEach((item, i) => {
      if (i === this.currentSlide) {
        gsap.set(item, {
          opacity: 1,
          scale: 1,
          zIndex: 10
        });
      } else {
        gsap.set(item, {
          opacity: 0,
          scale: 0.95,
          zIndex: 1
        });
      }
    });
  }

  goToSlide(index: number) {
    if (this.isTransitioning || index === this.currentSlide) return;
    this.isTransitioning = true;

    const currentItem = document.querySelector(`.slide-item:nth-child(${this.currentSlide + 1})`);
    const nextItem = document.querySelector(`.slide-item:nth-child(${index + 1})`);

    if (currentItem && nextItem) {
      // Animate current slide out
      gsap.to(currentItem, {
        opacity: 0,
        scale: 0.95,
        zIndex: 1,
        duration: 0.8,
        ease: 'power2.inOut'
      });

      // Animate next slide in
      gsap.fromTo(nextItem, 
        {
          opacity: 0,
          scale: 1.05,
          zIndex: 10
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            this.currentSlide = index;
            this.isTransitioning = false;
          }
        }
      );
    } else {
      this.currentSlide = index;
      this.isTransitioning = false;
    }
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
