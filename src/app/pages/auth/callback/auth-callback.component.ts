import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AccesTokenValidated,
  FetchSpotifyAuthorizationToken,
} from '@app/state';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, Store, ofActionSuccessful } from '@ngxs/store';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-auth-callback',
  template: `authenticated`,
})
export class AuthCallbackComponent implements OnInit {
  private _store = inject(Store);
  private acessTokenValidated$ = inject(Actions).pipe(
    ofActionSuccessful(AccesTokenValidated),
    takeUntilDestroyed()
  );

  @Input()
  set code(value: string) {
    this._store.dispatch(new FetchSpotifyAuthorizationToken(value));
  }
  @Input()
  set error(value: string) {
    console.debug('authentication failed', value);
  }

  ngOnInit(): void {
    this.acessTokenValidated$.subscribe(() =>
      this._store.dispatch(new Navigate(['/']))
    );
  }
}

export type authenticationSuccessfull = {
  code: string;
  state?: string;
};
export type authenticationFailed = {
  error: string;
  state?: string;
};
