import { Component, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';

@Component({
  selector: 'app-team-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './team-component.html',
  styleUrls: ['./team-component.scss']
})
export class TeamComponent implements AfterViewInit {
  @ViewChild('heroTitle') heroTitle!: ElementRef;
  @ViewChild('heroDescription') heroDescription!: ElementRef;
  @ViewChild('heroButton') heroButton!: ElementRef;

  ngAfterViewInit() {
    this.initHeroAnimation();
  }

  private initHeroAnimation() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // New Kinetic Reveal Animation
    tl.from('.line', {
      y: 150,
      opacity: 0,
      rotateX: -30,
      skewY: 10,
      stagger: 0.2,
      duration: 1.5
    })
    .from('.vertical-dash', {
      height: 0,
      duration: 1,
      ease: 'power2.inOut'
    }, '-=1')
    .from(this.heroDescription.nativeElement, {
      y: 30,
      opacity: 0,
      duration: 1.2
    }, '-=0.8')
    .from('.btn-neo-reveal', {
      scaleX: 0,
      opacity: 0,
      duration: 1,
      transformOrigin: 'left'
    }, '-=1')
    .from('.scroll-badge', {
      scale: 0,
      opacity: 0,
      rotate: -180,
      duration: 1.5,
      ease: 'back.out(1.7)'
    }, '-=1.2');

    // Subtle parallax for the lines
    gsap.to('.line-2', {
      x: 30,
      scrollTrigger: {
        trigger: '.kinetic-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    gsap.to('.line-3', {
      x: -30,
      scrollTrigger: {
        trigger: '.kinetic-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    
    gsap.to('.kinetic-title', {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.to('.nebula-cloud', {
      x: x * 2,
      y: y * 2,
      duration: 2,
      ease: 'power1.out'
    });
  }
}
