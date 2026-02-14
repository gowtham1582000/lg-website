import { AfterViewInit, Component, OnInit, signal, OnDestroy, inject, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header-component/header-component';
import { FooterComponent } from './footer-component/footer-component';
import { TerminalAssistant } from './terminal-assistant/terminal-assistant';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  protected readonly title = signal('lg-website');
  showGate = signal<boolean>(true);
  private animationFrameId?: number;
  private particleIntervalId?: any;
  private loaderIntervalId?: any;
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);

  // Ancient Cursor State
  cursorTransform: string = 'translate(-50%, -50%)';

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]); 
      }
    });
    this.startLoadingSequence();
  }

  // Implementation of Ancient Cursor tracking via HostListener
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    // Direct transform for the main container for immediate response
    this.cursorTransform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  }

  ngOnDestroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.particleIntervalId) clearInterval(this.particleIntervalId);
    if (this.loaderIntervalId) clearInterval(this.loaderIntervalId);
    document.removeEventListener('mouseover', this.handleHover);
    document.removeEventListener('mouseout', this.handleHover);
  }

  private startLoadingSequence() {
    let progress = 0;
    this.loaderIntervalId = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(this.loaderIntervalId);
        this.completeLoading();
      }
      this.updateLoaderUI(progress);
    }, 80);
  }

  private updateLoaderUI(progress: number) {
    const fill = document.querySelector('.fill') as HTMLElement;
    const percent = document.querySelector('.progress-percent') as HTMLElement;
    if (fill) fill.style.width = `${progress}%`;
    if (percent) percent.innerText = `${progress}%`;
  }

  private completeLoading() {
    setTimeout(() => {
      document.querySelector('.gate-intro')?.classList.add('open');
      setTimeout(() => {
        this.showGate.set(false);
        document.body.classList.remove('lock-scroll');
      }, 800);
    }, 300);
  }

  private mouseX = 0;
  private mouseY = 0;

  private handleHover = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactive = target.closest('a, button, [role="button"], select, input, textarea, .interactive');
    const cursor = document.querySelector('.custom-cursor');
    const glow = document.querySelector('.cursor-glow');
    
    // Logic for "Ancient" cursor expansion on interactive elements
    if (e.type === 'mouseover' && interactive) {
      cursor?.classList.add('hover');
      glow?.classList.add('hover');
    } else if (e.type === 'mouseout') {
      cursor?.classList.remove('hover');
      glow?.classList.remove('hover');
    }
  };

  ngAfterViewInit() {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    const core = document.querySelector('.cursor-core') as HTMLElement;
    const glow = document.querySelector('.cursor-glow') as HTMLElement;
    const grid = document.querySelector('.background-grid') as HTMLElement;
    const particlesContainer = document.querySelector('.data-particles') as HTMLElement;

    if (!cursor || !core || !glow) return;

    let lastX = 0, lastY = 0;
    let cursorX = 0, cursorY = 0;
    let glowX = 0, glowY = 0;
    let velocity = 0, angle = 0;

    document.addEventListener('mouseover', this.handleHover);
    document.addEventListener('mouseout', this.handleHover);

    const createParticle = () => {
      if (particlesContainer.children.length > 20) return;
      const p = document.createElement('div');
      p.className = 'particle';
      p.innerText = Math.random() > 0.5 ? (Math.random() > 0.5 ? '0' : '1') : Math.floor(Math.random() * 16).toString(16).toUpperCase();
      p.style.left = `${Math.random() * 100}vw`;
      p.style.animationDuration = `${Math.random() * 2 + 3}s`;
      p.style.opacity = `${Math.random() * 0.2}`;
      particlesContainer.appendChild(p);
      setTimeout(() => p.remove(), 5000);
    };

    this.particleIntervalId = setInterval(createParticle, 800);

    const animate = () => {
      const dx = this.mouseX - lastX;
      const dy = this.mouseY - lastY;
      const instantVelocity = Math.sqrt(dx * dx + dy * dy);
      velocity += (instantVelocity - velocity) * 0.15;
      
      if (instantVelocity > 0) {
        angle = Math.atan2(dy, dx) * 180 / Math.PI;
      }

      lastX = this.mouseX;
      lastY = this.mouseY;

      // Smooth interpolation for the Ancient "Follower" effect
      cursorX += (this.mouseX - cursorX) * 0.25;
      cursorY += (this.mouseY - cursorY) * 0.25;
      glowX += (this.mouseX - glowX) * 0.12;
      glowY += (this.mouseY - glowY) * 0.12;

      const stretch = 1 + Math.min(velocity / 120, 1.2);
      
      // Applying transforms for the Ring, Core, and Glow separately
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) rotate(${angle}deg)`;
      core.style.transform = `scale(${stretch}, ${1/stretch})`;
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;

      if (grid) {
        const moveX = (this.mouseX / window.innerWidth - 0.5) * 15;
        const moveY = (this.mouseY / window.innerHeight - 0.5) * 15;
        grid.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }
}