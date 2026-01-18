import { Component, AfterViewInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/all'; // This is the correct way to get the module
gsap.registerPlugin(ScrollTrigger, Observer);

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

  // Configuration - Must match SCSS
  private cardWidth = 220; // Slightly smaller to fit 5 in a row
  private gap = 15; 
  private observer: any;

  teamMembers: TeamMember[] = [
    { id: 1, name: 'SREE RISHI', role: 'Founder & Head o f the Game Department', category: 'leadership', image: 'https://i.pravatar.cc/400?u=2', bio: '' },
    { id: 2, name: 'KISHORE KUMAR', role: 'Founder & Creative Director', category: 'leadership', image: 'https://i.pravatar.cc/400?u=2', bio: '' },
    { id: 3, name: 'MADHAVAN', role: 'CFX Artist', category: 'Game Art & Visual Development Team', image: 'https://i.pravatar.cc/400?u=3', bio: '' },
    { id: 4, name: 'KAMESH', role: 'Game Environment Artist', category: 'Game Art & Visual Development Team', image: 'https://i.pravatar.cc/400?u=4', bio: '' },
    { id: 5, name: 'ANUJ', role: 'Game Environment Artist', category: 'Game Art & Visual Development Team', image: 'https://i.pravatar.cc/400?u=5', bio: '' },
    { id: 6, name: 'PRATHIBAN', role: 'Character & Prop Artist', category: 'Game Art & Visual Development Team', image: 'https://i.pravatar.cc/400?u=1', bio: '' },
    { id: 7, name: 'NIRANJAN', role: 'Texturing & Prop Artist', category: 'Game Art & Visual Development Team', image: 'https://i.pravatar.cc/400?u=7', bio: '' },
    { id: 8, name: 'VIKRAM', role: 'Rigging & Skinning Artist', category: 'Animation & Technical Art Team', image: 'https://i.pravatar.cc/400?u=7', bio: '' },
    { id: 9, name: 'BAVADHARINI', role: 'Game Animator', category: 'Animation & Technical Art Team', image: 'https://i.pravatar.cc/400?u=7', bio: '' },
    { id: 10, name: 'UMESH', role: 'Game Developer', category: 'Game Design & Development', image: 'https://i.pravatar.cc/400?u=7', bio: '' },
    { id: 11, name: 'KITHIYON', role: 'UI/UX Game Designer', category: 'Game Design & Development', image: 'https://i.pravatar.cc/400?u=7', bio: '' },
    { id: 12, name: 'GOWTHAM', role: 'Full-Stack Developer', category: 'Web & Digital Platform Development Team', image: 'https://i.pravatar.cc/400?u=7', bio: '' },
    { id: 13, name: 'DHANUSH RAM', role: 'Front-End Developer', category: 'Web & Digital Platform Development Team', image: 'https://i.pravatar.cc/400?u=7', bio: '' },
  ];

  get filteredMembers(): TeamMember[] {
    return this.activeFilter === 'all' ? this.teamMembers : this.teamMembers.filter(m => m.category === this.activeFilter);
  }

  get visibleCards(): number {
    if (typeof window === 'undefined') return 5;
    const vw = window.innerWidth;
    if (vw <= 600) return 1;
    if (vw <= 900) return 2;
    if (vw <= 1200) return 3;
    return 5; // Default for large screens
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
    this.initSwipeSupport(); // 3. Initialize Swipe
  }

  private initSwipeSupport() {
    // This creates a listener on the viewport for horizontal "drags"
    this.observer = Observer.create({
      target: this.sliderViewport.nativeElement,
      type: "wheel,touch,pointer",
      onLeft: () => this.slideNext(),
      onRight: () => this.slidePrev(),
      tolerance: 50, // Minimum distance to trigger a swipe
      preventDefault: false // Allows normal vertical scrolling
    });
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach((t: { kill: () => any; }) => t.kill());
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.currentSlide = 0;
    this.updateSliderOffset();
  }

  slideNext() {
    if (this.currentSlide < this.maxSlide) {
      this.currentSlide++;
      this.updateSliderOffset();
    }
  }

  getFilterCount(category: string): number {
    return this.teamMembers.filter(m => m.category === category).length;
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

  private updateSliderOffset() {
    this.sliderOffset = -(this.currentSlide * (this.cardWidth + this.gap));
  }

  @HostListener('window:resize')
  onResize() {
    if (this.currentSlide > this.maxSlide) this.currentSlide = this.maxSlide;
    this.updateSliderOffset();
  }
}