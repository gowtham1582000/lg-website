import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  char: string;
  fontSize: number;
  rotation: number;
  rotationSpeed: number;
}

@Component({
  selector: 'app-ancient-particles',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #canvas></canvas>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      pointer-events: none;
    }
    canvas {
      width: 100%;
      height: 100%;
    }
  `]
})
export class AncientParticlesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D | null;
  private particles: Particle[] = [];
  private animationId!: number;
  
  // Ancient Tamil/Brahmi inspired characters
  private chars = [
    'ய', 'ா', 'து', 'ம்', 'ஊ', 'ரே', 'வ', 'ரு', 'ம்', 'கே', 'ளி', 'ர்',
    '𑀬', '𑀸', '𑀢', '𑀼', '𑀫', '𑀉', '𑀭', '𑁂', '𑀓', '𑁂', '𑀴', '𑀺', '𑀭𑁆',
    '⚔️', '🔱', '☸️'
  ];

  ngOnInit() {}

  ngAfterViewInit() {
    this.initCanvas();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    this.onResize();
  }

  private onResize() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.createParticles(); // Re-create for new size
  }

  private createParticles() {
    this.particles = [];
    const count = Math.floor((window.innerWidth * window.innerHeight) / 15000);
    
    for (let i = 0; i < count; i++) {
      this.particles.push(this.generateParticle());
    }
  }

  private generateParticle(): Particle {
    const canvas = this.canvasRef.nativeElement;
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      char: this.chars[Math.floor(Math.random() * this.chars.length)],
      fontSize: Math.floor(Math.random() * 14) + 10,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01
    };
  }

  private animate() {
    if (!this.ctx) return;
    
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    this.particles.forEach(p => {
      // Update
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      
      // Wrap around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      
      // Draw
      this.ctx!.save();
      this.ctx!.translate(p.x, p.y);
      this.ctx!.rotate(p.rotation);
      this.ctx!.globalAlpha = p.opacity;
      
      this.ctx!.fillStyle = '#e2b34c';
      this.ctx!.font = `${p.fontSize}px 'Avenir'`;
      this.ctx!.fillText(p.char, 0, 0);
      
      // Draw small particle dots too
      this.ctx!.beginPath();
      this.ctx!.arc(2, 2, p.size / 2, 0, Math.PI * 2);
      this.ctx!.fill();
      
      this.ctx!.restore();
    });
    
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }
}
