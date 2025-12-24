import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success';
  content: string;
}

@Component({
  selector: 'app-terminal-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './terminal-assistant.html',
  styleUrl: './terminal-assistant.scss'
})
export class TerminalAssistant {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen = signal(false);
  command = '';
  history = signal<TerminalLine[]>([
    { type: 'output', content: 'NEURAL LINK ESTABLISHED...' },
    { type: 'output', content: 'WELCOME, OPERATOR. TYPE "HELP" FOR COMMANDS.' }
  ]);

  toggleTerminal() {
    this.isOpen.update(v => !v);
  }

  handleCommand() {
    if (!this.command.trim()) return;

    const cmd = this.command.trim().toLowerCase();
    this.history.update(h => [...h, { type: 'input', content: `> ${this.command}` }]);
    this.processCommand(cmd);
    this.command = '';

    setTimeout(() => this.scrollToBottom(), 50);
  }

  private processCommand(cmd: string) {
    switch (cmd) {
      case 'help':
        this.addOutput('AVAILABLE COMMANDS:\n- HELP: SHOW THIS LIST\n- STATUS: SYSTEM DIAGNOSTICS\n- SCAN: REVEAL HIDDEN DATA\n- CLEAR: WIPE TERMINAL\n- EXIT: TERMINATE SESSION');
        break;
      case 'status':
        this.addOutput('SYSTEM: ONLINE\nCORE: STABLE\nNETWORK: SECURE\nUSER_LEVEL: OPERATOR', 'success');
        break;
      case 'scan':
        this.addOutput('SCANNING AREA...');
        setTimeout(() => {
          this.addOutput('FRAGMENT FOUND: "THE FRACTURED ERA" - REWRITTEN BY THE META.', 'success');
        }, 1000);
        break;
      case 'clear':
        this.history.set([]);
        break;
      case 'exit':
        this.isOpen.set(false);
        break;
      default:
        this.addOutput(`ERROR: COMMAND "${cmd.toUpperCase()}" NOT RECOGNIZED.`, 'error');
    }
  }

  private addOutput(content: string, type: 'output' | 'error' | 'success' = 'output') {
    this.history.update(h => [...h, { type, content }]);
    setTimeout(() => this.scrollToBottom(), 50);
  }

  private scrollToBottom() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }
}
