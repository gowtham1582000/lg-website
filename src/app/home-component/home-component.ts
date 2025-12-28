import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { VideoScrollExpandComponent } from '../shared/video-scroll-expand/video-scroll-expand.component';
import { TopServicesComponent } from '../shared/top-services/top-services.component';
import { SplitServiceRevealComponent } from '../shared/split-service-reveal/split-service-reveal.component';

interface GameFeature {
  id: string;
  title: string;
  icon: string; // FontAwesome class
  description: string;
  status: 'ONLINE' | 'LOCKED' | 'MAINTENANCE';
}

@Component({
  selector: 'app-home-component',
  standalone: true,
  imports: [CommonModule, VideoScrollExpandComponent, TopServicesComponent, SplitServiceRevealComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.scss',
})
export class HomeComponent {
  sliderValue=signal<number>(50);
  features: GameFeature[] = [
    { id: 'F01', title: 'TACTICAL OPS', icon: 'fa-crosshairs', description: '5v5 competitive defusal mode.', status: 'ONLINE' },
    { id: 'F02', title: 'ARSENAL', icon: 'fa-gun', description: 'Over 50 customizable weapon platforms.', status: 'ONLINE' },
    { id: 'F03', title: 'RANKED', icon: 'fa-trophy', description: 'Skill-based matchmaking ladder.', status: 'ONLINE' },
    { id: 'F04', title: 'CLAN WARS', icon: 'fa-users', description: 'Weekly territory control tournaments.', status: 'LOCKED' },
    { id: 'F05', title: 'BATTLE PASS', icon: 'fa-ticket', description: 'Season 1: Cyber-Dawn rewards.', status: 'ONLINE' },
    { id: 'F06', title: 'ANTI-CHEAT', icon: 'fa-shield-halved', description: 'Kernel-level protection system.', status: 'MAINTENANCE' }
  ];
  updateSlider(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.sliderValue.set(parseInt(value, 10));
  }
  dangerMode = computed(() => this.sliderValue() > 80);

  runes = [
    { id: 1, char: 'ᚠ' }, { id: 2, char: 'ᚢ' }, 
    { id: 3, char: 'ᚦ' }, { id: 4, char: 'ᚩ' }
  ];
  correctSequence = [3, 1, 4, 2]; // The secret order
  
  // State
  userSequence: number[] = [];
  storyUnlocked = false;
  isError = false;
  statusMessage = "WAITING_FOR_INPUT...";

  inputRune(id: number) {
    if (this.isError || this.storyUnlocked) return;

    this.userSequence.push(id);
    
    // Check if the current click matches the sequence
    const currentIndex = this.userSequence.length - 1;
    if (this.userSequence[currentIndex] !== this.correctSequence[currentIndex]) {
      this.handleError();
      return;
    }

    // Check for win
    if (this.userSequence.length === this.correctSequence.length) {
      this.statusMessage = "DECRYPTION_SUCCESSFUL";
      setTimeout(() => this.storyUnlocked = true, 1000);
    }
  }

  handleError() {
    this.isError = true;
    this.statusMessage = "SEQUENCE_ERROR: RESETTING_CORE";
    setTimeout(() => {
      this.userSequence = [];
      this.isError = false;
      this.statusMessage = "WAITING_FOR_INPUT...";
    }, 1500);
  }
}
