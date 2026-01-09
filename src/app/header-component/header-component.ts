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
  isHidden = false;   // new scroll state
  lastScrollTop = 0;
  scrollY = 0;
  scrollProgress = 0;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleNavbar() {
    this.isHidden = !this.isHidden;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.scrollY = scrollTop;

    // Calculate scroll progress (0-100%)
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollableHeight = documentHeight - windowHeight;
    this.scrollProgress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

    if (scrollTop > this.lastScrollTop && scrollTop > 100) {
      // scrolling down
      this.isHidden = true;
    } else if (scrollTop < this.lastScrollTop) {
      // optional: show navbar on scroll up
      this.isHidden = false;
    }

    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

}
