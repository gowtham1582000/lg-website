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

    setTimeout(() => {
      document.querySelector('.gate-intro')?.classList.add('open');
    }, 800);

    setTimeout(() => {
      this.showGate.set(false);
      document.body.classList.remove('lock-scroll');
      //document.querySelector('.gate-intro')?.classList.add('close');
    }, 2800);
  }

    ngAfterViewInit() {
    const pulse = document.querySelector('.neural-pulse') as HTMLElement;
    const grid = document.querySelector('.background-grid') as HTMLElement;
    const particlesContainer = document.querySelector('.data-particles') as HTMLElement;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

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
      particlesContainer.appendChild(p);
      setTimeout(() => p.remove(), 7000);
    };

    setInterval(createParticle, 300);

    const animate = () => {
      // Smooth follow (LERP)
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      pulse.style.left = `${currentX}px`;
      pulse.style.top = `${currentY}px`;

      // Create trail effect
      if (Math.abs(mouseX - currentX) > 10 || Math.abs(mouseY - currentY) > 10) {
        const trail = document.createElement('div');
        trail.className = 'pulse-trail';
        trail.style.left = `${currentX}px`;
        trail.style.top = `${currentY}px`;
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 500);
      }

      // Parallax Grid
      const moveX = (mouseX / window.innerWidth - 0.5) * 20;
      const moveY = (mouseY / window.innerHeight - 0.5) * 20;
      grid.style.transform = `translate(${moveX}px, ${moveY}px)`;

      requestAnimationFrame(animate);
    };

    animate();
  }
}

