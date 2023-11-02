import {
  Injectable,
  Injector,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as auth from '@app/auth/';
import { AuthService } from '@app/services/auth.service';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  AccesTokenValidated,
  FetchSpotifyToken,
  PkceAuthenticate,
} from './auth.state.actions';

export interface AuthStateModel {
  accesToken?: AccessToken;
  favorites: string[];
  codeVerifier?: string;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    accesToken: undefined,
    codeVerifier: undefined,
    favorites: [],
  },
})
@Injectable()
export class AuthState implements NgxsOnInit {
  private _authService = inject(AuthService);
  private _injector = inject(Injector);

  @Selector()
  static accesToken(state: AuthStateModel): string | undefined {
    if (!state.accesToken) return undefined; // when null or undefined, return undefined
    if (state.accesToken.expiryDate < Date.now()) return undefined; // when expired, return undefined

    return state.accesToken.accessToken;
  }

  @Selector()
  static accesTokenValid(state: AuthStateModel) {
    return state.accesToken && state.accesToken.expiryDate > Date.now();
  }

  ngxsOnInit(ctx: StateContext<AuthStateModel>): void {
    const currentState = ctx.getState();
    if (currentState.accesToken) {
      console.debug('Token exists, checking if expired');
      if (currentState.accesToken.expiryDate > Date.now()) {
        console.debug('Token is not expired, skipping fetch');
        ctx.dispatch(new AccesTokenValidated(true));
        return;
      }
    }
    // ctx.dispatch(new FetchSpotifyToken());
  }

  @Action(FetchSpotifyToken)
  fetchSpotifyToken(
    ctx: StateContext<AuthStateModel>,
    action: FetchSpotifyToken
  ) {
    let stream$: Observable<AccessToken>;
    if (action.flow === 'client-secret') {
      stream$ = this._authService.getClientToken$().pipe(
        map(res => {
          return {
            accessToken: res.access_token,
            expiryDate: Date.now() + res.expires_in * 1000,
            tokenType: res.token_type,
          };
        }),
        tap(accesToken =>
          ctx.dispatch(new AccesTokenValidated(false, accesToken))
        )
      );
    } else {
      const currentState = ctx.getState();
      stream$ = this._authService
        /* eslint-disable @typescript-eslint/no-non-null-assertion  */
        .getAuthorizationToken$(
          action.authenticationCode!,
          currentState.codeVerifier!
        )
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
        .pipe(
          map(res => {
            return {
              accessToken: res.access_token,
              expiryDate: Date.now() + res.expires_in * 1000,
              tokenType: res.token_type,
              refreshToken: res.refresh_token,
            };
          }),
          tap(accesToken =>
            ctx.dispatch(new AccesTokenValidated(false, accesToken))
          )
        );
    }
    runInInjectionContext(this._injector, () => {
      stream$.pipe(takeUntilDestroyed()).subscribe();
    });
  }

  @Action(PkceAuthenticate)
  async pkceAuthenticate(ctx: StateContext<AuthStateModel>) {
    const codeVerifier = auth.codeVerifier;
    const codeChallenge = await auth.codeChallenge();
    ctx.patchState({ codeVerifier });
    this._authService.pkceAuthenticate(codeChallenge);
  }

  @Action(AccesTokenValidated)
  accesTokenReceived(
    ctx: StateContext<AuthStateModel>,
    action: AccesTokenValidated
  ) {
    if (action.unchanged) return;
    ctx.patchState({ accesToken: action.accesToken });
  }
}
export type AccessToken = GenericAccesToken | UserAccessToken;

export type GenericAccesToken = {
  accessToken: string;
  expiryDate: number;
  tokenType: 'Bearer';
};

export type UserAccessToken = GenericAccesToken & {
  refreshToken: string;
};
