import {AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header-component/header-component';
import { FooterComponent } from './footer-component/footer-component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent,RouterOutlet,FooterComponent],
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

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animate = () => {
      // Smooth follow (LERP)
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;

      pulse.style.left = `${currentX}px`;
      pulse.style.top = `${currentY}px`;

      requestAnimationFrame(animate);
    };

    animate();
  }
}
