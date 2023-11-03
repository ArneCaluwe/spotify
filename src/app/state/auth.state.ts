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
  RefreshSpotifyToken,
} from './auth.state.actions';

export interface AuthStateModel {
  accesToken?: AccessToken;
  codeVerifier?: string;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    accesToken: undefined,
    codeVerifier: undefined,
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
        ctx.dispatch(new AccesTokenValidated());
        return;
      }
      ctx.dispatch(new RefreshSpotifyToken());
    }
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
        tap(accesToken => {
          ctx.patchState({ accesToken });
          ctx.dispatch(new AccesTokenValidated());
        })
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
          tap(accesToken => {
            ctx.patchState({ accesToken });
            ctx.dispatch(new AccesTokenValidated());
          })
        );
    }
    runInInjectionContext(this._injector, () => {
      stream$.pipe(takeUntilDestroyed()).subscribe();
    });
  }

  @Action(RefreshSpotifyToken)
  async refreshSpotifyToken(ctx: StateContext<AuthStateModel>) {
    const currentState = ctx.getState();
    if (!currentState.accesToken || !isUserAccessToken(currentState.accesToken))
      return;
    const refreshToken = currentState.accesToken.refreshToken;
    this._authService
      .refreshAuthorizationToken$(refreshToken)
      .pipe(
        map(res => {
          return {
            accessToken: res.access_token,
            expiryDate: Date.now() + res.expires_in * 1000,
            tokenType: res.token_type,
            refreshToken: res.refresh_token,
          };
        }),
        tap(accesToken => ctx.patchState({ accesToken })),
        tap(ctx.dispatch(new AccesTokenValidated()))
      )
      .subscribe();
  }

  @Action(PkceAuthenticate)
  async pkceAuthenticate(ctx: StateContext<AuthStateModel>) {
    const codeVerifier = auth.codeVerifier;
    const codeChallenge = await auth.codeChallenge();
    ctx.patchState({ codeVerifier });
    this._authService.pkceAuthenticate(codeChallenge);
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

function isUserAccessToken(
  accesToken: AccessToken
): accesToken is UserAccessToken {
  return !!(accesToken as UserAccessToken).refreshToken;
}
