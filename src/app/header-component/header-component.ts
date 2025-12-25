import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  isMenuOpen = false;
  isNavbarCollapsed = false;   // new scroll state
  lastScrollTop = 0;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.lastScrollTop && scrollTop > 100) {
      // scrolling down
      this.isNavbarCollapsed = true;
    } else if (scrollTop < this.lastScrollTop) {
      // optional: show navbar on scroll up
      this.isNavbarCollapsed = false;
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

}
