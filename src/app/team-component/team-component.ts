import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-component.html',
  styleUrl: './team-component.scss',
})
export class TeamComponent {
  isBreached = signal(false);
  isBreaching = signal(false);
  breachProgress = signal(0);
  
  runes = ['ᚦ', 'ᚨ', 'ᚱ', 'ᚠ', 'ᛟ', 'ᛉ'];
  targetSequence = ['ᚦ', 'ᚨ', 'ᚱ'];
  userSequence: string[] = [];

  startBreach() {
    this.isBreaching.set(true);
    this.userSequence = [];
    this.breachProgress.set(0);
  }

  selectRune(rune: string) {
    if (!this.isBreaching()) return;
    
    this.userSequence.push(rune);
    const currentIndex = this.userSequence.length - 1;

    if (this.userSequence[currentIndex] !== this.targetSequence[currentIndex]) {
      // Failed breach
      this.isBreaching.set(false);
      this.userSequence = [];
      alert('SYSTEM BREACH FAILED: SEQUENCE MISMATCH');
      return;
    }

    this.breachProgress.set((this.userSequence.length / this.targetSequence.length) * 100);

    if (this.userSequence.length === this.targetSequence.length) {
      // Success!
      setTimeout(() => {
        this.isBreached.set(true);
        this.isBreaching.set(false);
      }, 500);
    }
  }
}
