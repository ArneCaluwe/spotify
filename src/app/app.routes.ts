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
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'authenticate',
    loadComponent: () =>
      import('./pages/authenticate/authenticate.component').then(
        m => m.AuthenticateComponent
      ),
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./pages/auth/callback/auth-callback.component').then(
        m => m.AuthCallbackComponent
      ),
  },
];
