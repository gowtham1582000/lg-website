import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header-component',
  imports: [],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
   isMenuOpen = false;

    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    }

}
