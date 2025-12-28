import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-component.html',
  styleUrl: './about-component.scss'
})
export class AboutComponent implements OnInit, AfterViewInit {
  studioRoadmap = [
    {
      phase: 'ERA I',
      title: 'THE AWAKENING',
      status: 'AWAKENED',
      description: 'The convergence of three souls beneath the constellation of the Weaver. The Ancient Covenant was forged, binding timeless wisdom with the tools of the future.',
      icon: 'fa-eye',
      techOverlay: 'CORE_SYNC_ESTABLISHED'
    },
    {
      phase: 'ERA II',
      title: 'RUNIC FOUNDATIONS',
      status: 'TRANSCRIBING',
      description: 'Etching the first lines of the Relic Nexus. A bridge between stone and silicon, where procedural alchemy breathes life into forgotten landscapes.',
      icon: 'fa-feather-pointed',
      techOverlay: 'ALPHA_BUILD_V1.0'
    },
    {
      phase: 'ERA III',
      title: 'THE GATHERING',
      status: 'Q3 2026',
      description: 'Inviting the seekers to witness the emergence. Opening the Ethereal Hub for the collective consciousness to shape our shared reality.',
      icon: 'fa-hands-holding-circle',
      techOverlay: 'COMMUNITY_LINK_PENDING'
    },
    {
      phase: 'ERA IV',
      title: 'UNIVERSAL ASCENSION',
      status: '2027',
      description: 'The final alignment. When the digital echo becomes as real as the stone it mimics, reaching every corner of the known world.',
      icon: 'fa-mountain-sun',
      techOverlay: 'GLOBAL_INIT_READY'
    }
  ];

  neuralPillars = [
    {
      title: 'PRIMAL WISDOM',
      description: 'Guided by the echoes of civilizations long lost, we build on foundations that have stood the test of eternity.',
      icon: 'fa-scroll',
      color: '#d4af37'
    },
    {
      title: 'ETHEREAL PRECISION',
      description: 'Though we use the tools of the machine, our aim is to capture the imperfect beauty of nature and history.',
      icon: 'fa-wand-magic-sparkles',
      color: '#f5f5dc'
    },
    {
      title: 'COLLECTIVE SOUL',
      description: 'Every traveler adds a thread to the tapestry. Our path is paved by the footprints of those who walk with us.',
      icon: 'fa-om',
      color: '#8b4513'
    }
  ];

  studioImages = [
    {
      url: 'assets/images/about-us-bg.jpg',
      title: 'The Sanctum',
      description: 'Where parchment meets the screen, and the old gods watch over our servers.'
    },
    {
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1974&auto=format&fit=crop',
      title: 'Hall of Echoes',
      description: 'A sanctuary for deep contemplation and the birth of new legends.'
    },
    {
      url: 'assets/images/Neural Core.png',
      title: 'The Relic Heart',
      description: 'The central artifact powering our digital landscapes with ancient energy.'
    },
    {
      url: 'https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?q=80&w=1974&auto=format&fit=crop',
      title: 'Obsidian Archive',
      description: 'Preserving the digital blueprints of our world within stone-cold memory.'
    }
  ];

  neuralStats = [
    { label: 'MYTHS UNCOVERED', value: 1248, suffix: '', current: 0, icon: 'fa-monument' },
    { label: 'SCROLLS WRITTEN', value: 8.4, suffix: 'M+', current: 0, icon: 'fa-pen-nib' },
    { label: 'SOULS CONNECTED', value: 52400, suffix: '', current: 0, icon: 'fa-sun' },
    { label: 'RITUAL STABILITY', value: 99.9, suffix: '%', current: 0, icon: 'fa-ankh' }
  ];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('stats-grid')) {
            this.animateStats();
          }
        }
      });
    }, { threshold: 0.2 });

    const items = this.el.nativeElement.querySelectorAll('.timeline-item, .stats-grid');
    items.forEach((item: Element) => observer.observe(item));
  }

  animateStats() {
    this.neuralStats.forEach(stat => {
      const duration = 2000;
      const steps = 60;
      const stepValue = stat.value / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        if (stat.value % 1 === 0) {
          stat.current = Math.floor(stepValue * currentStep);
        } else {
          stat.current = Number((stepValue * currentStep).toFixed(1));
        }

        if (currentStep >= steps) {
          stat.current = stat.value;
          clearInterval(interval);
        }
      }, duration / steps);
    });
  }
}
