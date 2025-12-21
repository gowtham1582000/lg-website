import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header-component/header-component';
import { HomeComponent } from './home-component/home-component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent,HomeComponent,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('lg-website');
}
