import {AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header-component/header-component';
import { FooterComponent } from './footer-component/footer-component';
import { TerminalAssistant } from './terminal-assistant/terminal-assistant';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, TerminalAssistant],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit,AfterViewInit {
  protected readonly title = signal('lg-website');
  showGate = signal<boolean>(true);

   ngOnInit() {
    this.startLoadingSequence();
  }

    private startLoadingSequence() {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 5) + 2;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          this.completeLoading();
        }
        
        this.updateLoaderUI(progress);
      }, 100);
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
      }, 1000);
    }, 500);
  }

    ngAfterViewInit() {
    const cursor = document.querySelector('.custom-cursor') as HTMLElement;
    const core = document.querySelector('.cursor-core') as HTMLElement;
    const hud = document.querySelector('.cursor-hud') as HTMLElement;
    const glow = document.querySelector('.cursor-glow') as HTMLElement;
    const grid = document.querySelector('.background-grid') as HTMLElement;
    const particlesContainer = document.querySelector('.data-particles') as HTMLElement;

    let mouseX = 0;
    let mouseY = 0;
    let lastX = 0;
    let lastY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let glowX = 0;
    let glowY = 0;
    let velocity = 0;
    let angle = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Add hover listeners
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], .interactive');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor?.classList.add('hover');
          glow?.classList.add('hover');
          hud?.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
          cursor?.classList.remove('hover');
          glow?.classList.remove('hover');
          hud?.classList.remove('hover');
        });
      });
    };

    // Re-run hover listeners periodically or on route change if needed
    addHoverListeners();
    setInterval(addHoverListeners, 2000);

    // Generate background particles
    const createParticle = () => {
      const p = document.createElement('div');
      p.className = 'particle';
      const binary = Math.random() > 0.5 ? '0' : '1';
      const hex = Math.floor(Math.random() * 16).toString(16).toUpperCase();
      p.innerText = Math.random() > 0.5 ? binary : hex;
      p.style.left = `${Math.random() * 100}vw`;
      p.style.animationDuration = `${Math.random() * 3 + 4}s`;
      p.style.opacity = `${Math.random() * 0.3}`;
      particlesContainer?.appendChild(p);
      setTimeout(() => p.remove(), 7000);
    };

    setInterval(createParticle, 300);

    const animate = () => {
      // Velocity calculation
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const instantVelocity = Math.sqrt(dx * dx + dy * dy);
      
      // Smoothing velocity
      velocity += (instantVelocity - velocity) * 0.1;
      
      // Angle for rotation
      if (instantVelocity > 0) {
        angle = Math.atan2(dy, dx) * 180 / Math.PI;
      }

      lastX = mouseX;
      lastY = mouseY;

      // Faster LERP for core cursor
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;

      // Slower, smoother LERP for aura glow
      glowX += (mouseX - glowX) * 0.1;
      glowY += (mouseY - glowY) * 0.1;

      if (cursor) {
        // Apply velocity-based stretching to core
        const stretch = 1 + Math.min(velocity / 100, 1.5);
        const squash = 1 / stretch;
        
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) rotate(${angle}deg)`;
        
        if (core) {
          core.style.transform = `scale(${stretch}, ${squash})`;
        }

        if (hud) {
          const hudScale = 1 + (velocity / 400);
          hud.style.transform = `scale(${hudScale})`; 
        }
      }

      if (glow) {
        glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
      }

      // Parallax Grid
      const moveX = (mouseX / window.innerWidth - 0.5) * 20;
      const moveY = (mouseY / window.innerHeight - 0.5) * 20;
      if (grid) {
        grid.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    animate();
  }
}

