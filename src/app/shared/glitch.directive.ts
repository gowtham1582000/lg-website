import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appGlitch]',
  standalone: true
})
export class GlitchDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.renderer.addClass(this.el.nativeElement, 'glitch-ready');
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.addClass(this.el.nativeElement, 'glitch-active');
    this.triggerGlitch();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeClass(this.el.nativeElement, 'glitch-active');
  }

  private triggerGlitch() {
    if (this.el.nativeElement.classList.contains('glitch-active')) {
      const x = Math.random() * 10 - 5;
      const y = Math.random() * 10 - 5;
      this.renderer.setStyle(this.el.nativeElement, 'transform', `translate(${x}px, ${y}px)`);
      
      setTimeout(() => {
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate(0, 0)');
        if (this.el.nativeElement.classList.contains('glitch-active')) {
          setTimeout(() => this.triggerGlitch(), Math.random() * 200 + 50);
        }
      }, 50);
    }
  }
}
