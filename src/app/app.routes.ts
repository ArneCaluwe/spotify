import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./pages/auth/callback/auth-callback.component').then(
        m => m.AuthCallbackComponent
      ),
  },
];
