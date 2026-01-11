import { Component, ElementRef, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
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

  slides = [
    {
      title: 'DIVINE ARCHITECTURE',
      description: 'Uncover engineering marvels of the ancient architects. Every pillar tells a thousand-year story.',
      features: ['Sacred Geometry', 'Hidden Truths'],
      videoSrc: 'assets/videos/footer.mp4'
    },
    {
      title: 'FORGOTTEN REALM',
      description: 'An ancient open-world epic where history meets myth. Experience a civilization etched in stone.',
      features: ['Living Combat Legacy', 'Sacred Open World'],
      videoSrc: 'assets/videos/middle-section.mp4'
    }
  ];

  ngOnInit() {}

  ngAfterViewInit() {
    this.updateVideoState();
  }

  private updateVideoState() {
    const activeVideo = this.videoElements?.toArray()[this.activeSlide];
    if (activeVideo) {
      activeVideo.nativeElement.muted = this.isMuted;
      activeVideo.nativeElement.play().catch(err => console.log('Auto-play blocked or error:', err));
    }
  }

  toggleMute(event: Event) {
    event.stopPropagation(); // Prevents click from bubbling up
    this.isMuted = !this.isMuted;
    const activeVideo = this.videoElements?.toArray()[this.activeSlide];
    if (activeVideo) {
      activeVideo.nativeElement.muted = this.isMuted;
    }
  }

  nextSlide() {
    this.activeSlide = (this.activeSlide + 1) % this.slides.length;
    this.resetVideo();
  }

  prevSlide() {
    this.activeSlide = (this.activeSlide - 1 + this.slides.length) % this.slides.length;
    this.resetVideo();
  }

  resetVideo() {
    setTimeout(() => {
      this.updateVideoState();
    }, 0);
  }
}
