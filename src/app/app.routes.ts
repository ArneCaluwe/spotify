import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from './state';

const AuthenticatedGuard = () => {
  const accessToken = inject(Store).selectSnapshot(AuthState.accesToken);
  return accessToken ? true : inject(Router).parseUrl('/authenticate');
};

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    title: 'Spotify - Home',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'authenticate',
    title: 'Spotify - Authenticate',
    loadComponent: () =>
      import('./pages/authenticate/authenticate.component').then(
        m => m.AuthenticateComponent
      ),
  },
  {
    path: 'auth/callback',
    title: 'Spotify - Athenticating ...',
    loadComponent: () =>
      import('./pages/auth/callback/auth-callback.component').then(
        m => m.AuthCallbackComponent
      ),
  },
];
