import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-video-scroll-expand',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-scroll-expand.component.html',
  styleUrl: './video-scroll-expand.component.scss'
})
export class VideoScrollExpandComponent implements AfterViewInit, OnDestroy {
  @ViewChild('section', { static: true }) section!: ElementRef<HTMLElement>;
  @ViewChild('videoContainer', { static: true }) videoContainer!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    this.initAnimation();
  }

  private initAnimation() {
    gsap.fromTo(this.videoContainer.nativeElement, 
      {
        width: '60%',
        borderRadius: '2rem'
      },
        {
          width: '100%',
          borderRadius: '0rem',
          scrollTrigger: {
            trigger: this.section.nativeElement,
            start: 'top top',
            end: '+=50%', // Even tighter scroll distance to minimize the spacer gap
            scrub: true,
            pin: true,
            anticipatePin: 1
          }
        }
    );
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}
