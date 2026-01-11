import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-split-service-reveal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './split-service-reveal.component.html',
  styleUrls: ['./split-service-reveal.component.scss']
})
export class SplitServiceRevealComponent implements AfterViewInit, OnDestroy {
  @ViewChild('section', { static: true }) section!: ElementRef;
  @ViewChild('card1', { static: true }) card1!: ElementRef;
  @ViewChild('card2', { static: true }) card2!: ElementRef;
  @ViewChild('content', { static: true }) content!: ElementRef;

  private ctx?: any;

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger);
    
    this.ctx = gsap.context(() => {
      const tl = gsap.timeline({
          scrollTrigger: {
            trigger: this.section.nativeElement,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 0.5,
            snap: {
              snapTo: [0, 1],
              duration: 0.5,
              delay: 0
            },
            anticipatePin: 1
          }
      });

      // Initially stack cards
      gsap.set([this.card1.nativeElement, this.card2.nativeElement], {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        zIndex: 10
      });

      // Spread cards further to sides to clear center content
      tl.to(this.card1.nativeElement, {
        x: '-120%', // Use percentage for better responsiveness
        rotation: -12,
        scale: 0.85,
        ease: 'power2.inOut',
        force3D: true
      }, 0)
      .to(this.card2.nativeElement, {
        x: '120%', // Use percentage for better responsiveness
        rotation: 12,
        scale: 0.85,
        ease: 'power2.inOut'
      }, 0)
      
      // Reveal content in the center with a slight delay
      .to(this.content.nativeElement, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.out'
      }, 0.2);

    }, this.section.nativeElement);
  }

  ngOnDestroy() {
    if (this.ctx) {
      this.ctx.revert();
    }
  }
}
