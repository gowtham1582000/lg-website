import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-footer-component',
  imports: [],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.scss',
})
export class FooterComponent {

  @ViewChild('bgVideo') videoRef!: ElementRef<HTMLVideoElement>;

ngAfterViewInit() {
  const video = this.videoRef.nativeElement;

  video.muted = true;

  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Fallback: play after user interaction
      const resume = () => {
        video.play();
        window.removeEventListener('touchstart', resume);
        window.removeEventListener('click', resume);
      };

      window.addEventListener('touchstart', resume, { once: true });
      window.addEventListener('click', resume, { once: true });
    });
  }
}

}
