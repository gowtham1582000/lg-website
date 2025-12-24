import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { GlitchDirective } from '../shared/glitch.directive';

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
  imports: [CommonModule, GlitchDirective],
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
}
