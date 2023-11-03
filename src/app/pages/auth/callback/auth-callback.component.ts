import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AccesTokenValidated, FetchSpotifyToken } from '@app/state';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, Store, ofActionSuccessful } from '@ngxs/store';
import { z } from 'zod';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-auth-callback',
  template: `authenticated`,
})
export class AuthCallbackComponent {
  private _store = inject(Store);
  private _actions$ = inject(Actions);

  constructor() {
    const params = inject(ActivatedRoute).snapshot.queryParams;
    const scheme = z.object({ code: z.string(), state: z.string().optional() });
    const result = scheme.safeParse(params);
    if (result.success) {
      this._store.dispatch(new FetchSpotifyToken('pkce', result.data.code));
    } else {
      const errorScheme = z.object({
        error: z.string(),
        state: z.string().optional(),
      });
      const errorResult = errorScheme.safeParse(params);
      if (errorResult.success) {
        console.debug('authentication failed', errorResult.data.error);
      } else {
        console.error('something went wrong', errorResult.error);
      }
    }
    this._actions$
      .pipe(ofActionSuccessful(AccesTokenValidated), takeUntilDestroyed())
      .subscribe(() => this._store.dispatch(new Navigate(['/'])));
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
