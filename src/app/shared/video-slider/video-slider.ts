import { Component, ElementRef, OnInit, ViewChildren, QueryList, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AncientParticlesComponent } from '../ancient-particles/ancient-particles';

@Component({
  selector: 'app-video-slider',
  standalone: true,
  imports: [CommonModule, AncientParticlesComponent],
  templateUrl: './video-slider.html',
  styleUrls: ['./video-slider.scss']
})
export class VideoSliderComponent implements OnInit, AfterViewInit {
  @ViewChildren('mainVideo') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;
  
  isMuted: boolean = true;
  activeSlide: number = 0;
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private isSwiping: boolean = false;

  slides = [
    {
      title: 'DIVINE ARCHITECTURE',
      description: 'Uncover engineering marvels of the ancient architects. Every pillar tells a thousand-year story.',
      features: ['Sacred Geometry', 'Hidden Truths'],
      videoSrc: 'assets/videos/Cinematic_Warrior_Walks_Through_Ruins.mp4'
    },
    {
      title: 'FORGOTTEN REALM',
      description: 'An ancient open-world epic where history meets myth. Experience a civilization etched in stone.',
      features: ['Living Combat Legacy', 'Sacred Open World'],
      videoSrc: 'assets/videos/middle-section.mp4'
    }
  ];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.updateVideoState();
    }, 100);
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.isSwiping = true;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.isSwiping) return;
    this.touchEndX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (!this.isSwiping) return;
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
    this.isSwiping = false;
  }

  private handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.goToNext();
      } else {
        this.goToPrev();
      }
    }
  }

  private updateVideoState() {
    this.videoElements?.forEach((video, index) => {
      const el = video.nativeElement;
      el.muted = this.isMuted;
      if (index === this.activeSlide) {
        el.currentTime = 0;
        el.play().catch(err => console.log('Auto-play blocked:', err));
      } else {
        el.pause();
        el.currentTime = 0;
      }
    });
  }

  toggleMute(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.isMuted = !this.isMuted;
    const activeVideo = this.videoElements?.toArray()[this.activeSlide];
    if (activeVideo) {
      activeVideo.nativeElement.muted = this.isMuted;
    }
  }

  goToNext() {
    this.activeSlide = (this.activeSlide + 1) % this.slides.length;
    this.updateVideoState();
  }

  goToPrev() {
    this.activeSlide = (this.activeSlide - 1 + this.slides.length) % this.slides.length;
    this.updateVideoState();
  }

  goToSlide(index: number) {
    if (index === this.activeSlide) return;
    this.activeSlide = index;
    this.updateVideoState();
  }
}
