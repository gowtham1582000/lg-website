import { Component, ElementRef, OnInit, ViewChildren, QueryList, AfterViewInit, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AncientParticlesComponent } from '../ancient-particles/ancient-particles';
import { startWith, Subject, Subscription, switchMap, takeUntil, timer } from 'rxjs';

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
  private autoSlideInterval: any = null;
  private autoSlideDelay = 5000; // 6 seconds (cinematic pace)
  private touchStartY: number = 0;
  private touchEndY: number = 0;

  // RxJS tools for clean timing
  private readonly stop$ = new Subject<void>();
  private readonly interaction$ = new Subject<void>();
  private timerSubscription?: Subscription;
  slides = [
    {
      title: 'DIVINE ARCHITECTURE',
      description: 'Uncover engineering marvels of the ancient architects. Every pillar tells a thousand-year story.',
      features: ['Sacred Geometry', 'Hidden Truths'],
      videoSrc: '',
      image:'assets/images/slider-image-1.png'
    },
    {
      title: 'FORGOTTEN REALM',
      description: 'An ancient open-world epic where history meets myth. Experience a civilization etched in stone.',
      features: ['Living Combat Legacy', 'Sacred Open World'],
      videoSrc: '',
      image:'assets/images/image-slider-2.png'
    }
  ];

  constructor(private cdr: ChangeDetectorRef, // To force view update
    private zone: NgZone) {}

  ngOnInit() {
    this.initAutoSlide();
  }

  ngAfterViewInit() {
    this.updateVideoState();
  }

  ngOnDestroy() {
    this.stop$.next();
    this.stop$.complete();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.isSwiping = true;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.isSwiping) return;

    this.touchEndX = event.touches[0].clientX;
    this.touchEndY = event.touches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (!this.isSwiping) return;

    this.handleSwipe();
    this.isSwiping = false;
  }


  private initAutoSlide() {
    // We run this inside NgZone to ensure Angular stays in sync
    this.zone.runOutsideAngular(() => {
      this.timerSubscription = this.interaction$.pipe(
        startWith(null),
        switchMap(() => timer(this.autoSlideDelay, this.autoSlideDelay)),
        takeUntil(this.stop$)
      ).subscribe(() => {
        // We move back inside the zone to update the UI
        this.zone.run(() => {
          this.goToNext();
          this.cdr.detectChanges(); // Force the "active" class to apply
        });
      });
    });
  }

  private triggerInteraction() {
    this.interaction$.next();
  }

  private handleSwipe() {
    const swipeThreshold = 50;
    const diffX = this.touchStartX - this.touchEndX;
    // ... your diff check logic
    if (Math.abs(diffX) > swipeThreshold) {
      this.triggerInteraction(); // Resets timer on swipe
      if (diffX > 0) this.goToNext();
      else this.goToPrev();
    }
  }

  private updateVideoState() {
    // Small timeout ensures the DOM has updated the 'active' class
    setTimeout(() => {
      this.videoElements?.forEach((video, index) => {
        const el = video.nativeElement;
        if (index === this.activeSlide) {
          el.muted = this.isMuted;
          el.currentTime = 0;
          el.play().catch(() => {}); 
        } else {
          el.pause();
        }
      });
    }, 0);
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
    this.cdr.detectChanges();
  }

  goToPrev() {
    this.activeSlide = (this.activeSlide - 1 + this.slides.length) % this.slides.length;
    this.updateVideoState();
    this.cdr.detectChanges();
  }

  goToSlide(index: number) {
    if (index === this.activeSlide) return;
    this.activeSlide = index;
    this.updateVideoState();
    this.triggerInteraction(); // Resets timer on click
    this.cdr.detectChanges();
  }

}
