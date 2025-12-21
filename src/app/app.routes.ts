import { Routes } from '@angular/router';
import { HomeComponent } from './home-component/home-component';
import { TeamComponent } from './team-component/team-component';
import { ContactComponent } from './contact-component/contact-component';

export const routes: Routes = [
  { path: '', component: HomeComponent },        // default route
  { path: 'home', component: HomeComponent },
  { path: 'team', component: TeamComponent },
  { path: 'contact', component: ContactComponent },

  // optional: redirect unknown routes
  { path: '**', redirectTo: '', pathMatch: 'full' }
];