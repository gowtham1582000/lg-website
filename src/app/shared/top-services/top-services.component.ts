import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-top-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-services.component.html',
  styleUrls: ['./top-services.component.scss']
})
export class TopServicesComponent implements AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('scrollContent') scrollContent!: ElementRef;

    services = [
      {
        id: 'I',
        title: 'GAME DEVELOPMENT',
        description: 'Forging immersive digital realms with cutting-edge mechanics and narrative depth.',
        image: 'assets/images/service-1.jpg',
        tags: ['PC', 'CONSOLE', 'MOBILE']
      },
      {
        id: 'II',
        title: 'AR/VR SOLUTIONS',
        description: 'Bridging the gap between reality and imagination through spatial computing.',
        image: 'assets/images/service-2.jpg',
        tags: ['OCULUS', 'VIVE', 'ARCORE']
      },
      {
        id: 'III',
        title: 'ART & ANIMATION',
        description: 'Breathe life into characters and worlds with world-class visual alchemy.',
        image: 'assets/images/service-3.jpg',
        tags: ['3D', 'VFX', 'CONCEPT ART']
      },
      {
        id: 'IV',
        title: 'METAVERSE',
        description: 'Architecting the future of social interaction and digital ownership.',
        image: 'assets/images/service-4.jpg',
        tags: ['BLOCKCHAIN', 'WEB3', 'SPATIAL']
      },
      {
        id: 'V',
        title: 'GAMIFICATION',
        description: 'Transforming experiences through game-driven engagement and logic.',
        image: 'assets/images/service-5.jpg',
        tags: ['EDTECH', 'RETAIL', 'TRAINING']
      }
    ];

  ngAfterViewInit() {
    this.initScrollAnimation();
  }

  initScrollAnimation() {
    const sections = gsap.utils.toArray('.service-card');
    const container = this.scrollContent.nativeElement;

    const tl = gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: this.scrollContainer.nativeElement,
        pin: true,
        scrub: 1,
        snap: 1 / (sections.length - 1),
        end: () => `+=${container.offsetWidth}`,
        invalidateOnRefresh: true
      }
    });

    // Animate titles and info on enter
    sections.forEach((section: any) => {
      gsap.from(section.querySelector('.service-info'), {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          containerAnimation: tl,
          start: "left center+=200",
          toggleActions: "play none none reverse"
        }
      });
    });
  }
}
