import { 
  Component, AfterViewInit, OnDestroy, HostListener, 
  ElementRef, ViewChild, ChangeDetectorRef, NgZone 
} from '@angular/core';
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
}

@Component({
  selector: 'app-team-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './team-component.html',
  styleUrls: ['./team-component.scss']
})
export class TeamComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sliderViewport', { static: true }) sliderViewport!: ElementRef;

  activeFilter = 'all';
  hoveredMember: TeamMember | null = null;
  currentSlide = 0;
  sliderOffset = 0;

  // Swipe logic properties
  private touchStartX = 0;
  private touchEndX = 0;
  private isSwiping = false;

  // Configuration - Must match SCSS
  private cardWidth = 220; 
  private gap = 15; 

  teamMembers: TeamMember[] = [
    { id: 1, name: 'SREE RISHI', role: 'Head of the Game Department', category: 'leadership', image: 'assets/team-images/Sree-Rishi.jpg', bio: '' },
    { id: 2, name: 'KISHORE KUMAR', role: 'Creative Director', category: 'leadership', image: 'assets/team-images/Kishore-Kumar.png', bio: '' },
    { id: 3, name: 'MADHAVAN', role: 'CFX Artist', category: 'Game Art & Visual Development Team', image: 'assets/team-images/Madhavan.png', bio: '' },
    { id: 4, name: 'KAMESH', role: 'Game Environment Artist', category: 'Game Art & Visual Development Team', image: 'assets/team-images/Kamesh.png', bio: '' },
    { id: 12, name: 'GOWTHAM', role: 'Full-Stack Developer', category: 'Web & Digital Platform Development Team', image: 'assets/team-images/Gowtham-P.png', bio: '' },
    { id: 13, name: 'DHANUSH RAM', role: 'Front-End Developer', category: 'Web & Digital Platform Development Team', image: 'assets/team-images/Dhanush-Ram.png', bio: '' },
     { id: 10, name: 'UMESH', role: 'Game Developer', category: 'Game Design & Development', image: 'assets/team-images/Umesh-P.png', bio: '' },
    { id: 11, name: 'KITHIYON', role: 'UI/UX Game Designer', category: 'Game Design & Development', image: 'assets/team-images/Kithiyon.png', bio: '' },
    { id: 6, name: 'PRATHIBAN', role: 'Character & Prop Artist', category: 'Game Art & Visual Development Team', image: 'assets/team-images/Parthiban.png', bio: '' },
    { id: 5, name: 'ANUJ', role: 'Game Environment Artist', category: 'Game Art & Visual Development Team', image: '', bio: '' },
    { id: 7, name: 'NILANJAN', role: 'Texturing & Prop Artist', category: 'Game Art & Visual Development Team', image: '', bio: '' },
    { id: 8, name: 'VIKRAM', role: 'Rigging & Skinning Artist', category: 'Animation & Technical Art Team', image: '', bio: '' },
    { id: 9, name: 'BAVADHARINI', role: 'Game Animator', category: 'Animation & Technical Art Team', image: '', bio: '' }
  ];

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) {}

  get filteredMembers(): TeamMember[] {
    return this.activeFilter === 'all' ? this.teamMembers : this.teamMembers.filter(m => m.category === this.activeFilter);
  }

  get visibleCards(): number {
    if (typeof window === 'undefined') return 5;
    const vw = window.innerWidth;
    if (vw <= 600) return 1;
    if (vw <= 900) return 2;
    if (vw <= 1200) return 3;
    return 5;
  }

  get maxSlide(): number {
    return Math.max(0, this.filteredMembers.length - this.visibleCards);
  }

  get totalDots(): number {
    return this.maxSlide + 1;
  }

  get progressWidth(): number {
    if (this.maxSlide === 0) return 100;
    return (this.currentSlide / this.maxSlide) * 100;
  }

  ngAfterViewInit() {
    this.updateSliderOffset();
  }

  // --- MOBILE SWIPE HANDLERS (Same as your Video Slider) ---
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

  @HostListener('touchend')
  onTouchEnd() {
    if (!this.isSwiping) return;
    this.handleSwipe();
    this.isSwiping = false;
  }

  private handleSwipe() {
    const swipeThreshold = 50;
    const diffX = this.touchStartX - this.touchEndX;

    if (Math.abs(diffX) > swipeThreshold) {
      if (diffX > 0) {
        this.slideNext();
      } else {
        this.slidePrev();
      }
    }
  }

  // --- NAVIGATION LOGIC ---
  slideNext() {
    if (this.currentSlide < this.maxSlide) {
      this.currentSlide++;
      this.updateSliderOffset();
    }
  }

  slidePrev() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateSliderOffset();
    }
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.updateSliderOffset();
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.currentSlide = 0;
    this.updateSliderOffset();
  }
  getFilterCount(category: string): number {
    return this.teamMembers.filter(m => m.category === category).length;
  }

  private updateSliderOffset() {
    this.zone.run(() => {
      this.sliderOffset = -(this.currentSlide * (this.cardWidth + this.gap));
      this.cdr.detectChanges();
    });
  }

  @HostListener('window:resize')
  onResize() {
    if (this.currentSlide > this.maxSlide) this.currentSlide = this.maxSlide;
    this.updateSliderOffset();
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach((t: { kill: () => any; }) => t.kill());
  }
}