import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, signal, HostListener } from '@angular/core';
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

  // Draggable properties
  terminalPos = signal({ x: 0, y: 0 });
  isDragging = false;
  dragOffset = { x: 0, y: 0 };

  toggleTerminal() {
    this.isOpen.update(v => !v);
    if (this.isOpen()) {
      // Reset position to default if opened
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      this.terminalPos.set({ 
        x: viewportWidth - 450, 
        y: viewportHeight - 550 
      });
    }
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
    const parts = cmd.split(' ');
    const mainCmd = parts[0];

    switch (mainCmd) {
      case 'help':
        this.addOutput('AVAILABLE COMMANDS:\n- HELP: SHOW THIS LIST\n- STATUS: SYSTEM DIAGNOSTICS\n- SCAN: REVEAL HIDDEN DATA\n- MATRIX: ACTIVATE PROTOCOL\n- DARKMODE: TOGGLE THEME\n- WHOAMI: USER IDENTITY\n- CLEAR: WIPE TERMINAL\n- EXIT: TERMINATE SESSION');
        break;
      case 'status':
        this.addOutput('SYSTEM: ONLINE\nCORE: STABLE\nNETWORK: SECURE\nUSER_LEVEL: OPERATOR\nUPTIME: 342:12:05', 'success');
        break;
      case 'scan':
        this.addOutput('SCANNING AREA...');
        setTimeout(() => {
          this.addOutput('FRAGMENT FOUND: "THE FRACTURED ERA" - REWRITTEN BY THE META.', 'success');
          this.addOutput('NODE DETECTED: [TEAM_ENCRYPTED] - USE "REVEAL" TO DECRYPT.', 'output');
        }, 1000);
        break;
      case 'matrix':
        this.addOutput('INITIATING MATRIX PROTOCOL...', 'success');
        document.body.classList.toggle('matrix-effect');
        break;
      case 'darkmode':
        this.addOutput('TOGGLING LUMINANCE VALUES...');
        document.body.classList.toggle('light-mode');
        break;
      case 'whoami':
        this.addOutput('USER: OPERATOR_842\nID: 0x88F2A\nACCESS: GRANTED', 'success');
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

  // Draggable Methods
  onDragStart(event: MouseEvent) {
    this.isDragging = true;
    const currentPos = this.terminalPos();
    this.dragOffset = {
      x: event.clientX - currentPos.x,
      y: event.clientY - currentPos.y
    };
    event.preventDefault();
  }

  @HostListener('window:mousemove', ['$event'])
  onDragMove(event: MouseEvent) {
    if (this.isDragging) {
      this.terminalPos.set({
        x: event.clientX - this.dragOffset.x,
        y: event.clientY - this.dragOffset.y
      });
    }
  }

  @HostListener('window:mouseup')
  onDragEnd() {
    this.isDragging = false;
  }
}
