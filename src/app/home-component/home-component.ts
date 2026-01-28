import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VideoScrollExpandComponent } from '../shared/video-scroll-expand/video-scroll-expand.component';
import { TopServicesComponent } from '../shared/top-services/top-services.component';
import { SplitServiceRevealComponent } from '../shared/split-service-reveal/split-service-reveal.component';
import { ThreeDViewerComponent } from '../shared/three-d-viewer/three-d-viewer.component';
import { VideoSliderComponent } from '../shared/video-slider/video-slider';

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule, VideoScrollExpandComponent, TopServicesComponent, SplitServiceRevealComponent, ThreeDViewerComponent, VideoSliderComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent implements OnInit {

  ngOnInit() {
  }
  runes = [
    { id: 1, char: 'ᚠ' }, { id: 2, char: 'ᚢ' }, 
    { id: 3, char: 'ᚦ' }, { id: 4, char: 'ᚩ' }
  ];
  correctSequence = [3, 1, 4, 2]; // The secret order
  showComingSoon = false;

  openComingSoon() {
    this.showComingSoon = true;
  }

}
