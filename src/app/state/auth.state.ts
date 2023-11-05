import { Injectable, inject } from '@angular/core';
import * as auth from '@app/auth/';
import {
  AuthService,
  SpotifyAccessToken,
  isSpotifyAuthenticationToken,
} from '@app/services/auth.service';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {
  AccesTokenValidated,
  FetchSpotifyAuthorizationToken,
  FetchSpotifyClientToken,
  PkceAuthenticate,
  RefreshSpotifyToken,
  RequestFailed,
} from './auth.state.actions';

export interface AuthStateModel {
  accesToken?: SpotifyAccessToken;
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
  @Selector()
  static accesToken(state: AuthStateModel): string | undefined {
    return accessTokenValid(state.accesToken)
      ? state.accesToken.accessToken
      : undefined;
  }

  @Selector()
  static hasAccesToken(state: AuthStateModel): boolean {
    return !!state.accesToken;
  }

  @Selector()
  static accesTokenValid(state: AuthStateModel) {
    return state.accesToken && state.accesToken.expiryDate > Date.now();
  }

  ngxsOnInit(ctx: StateContext<AuthStateModel>): void {
    const currentState = ctx.getState();
    if (currentState.accesToken) {
      console.debug('Token exists, checking if expired');
      console.log(
        new Date(currentState.accesToken.expiryDate),
        new Date(Date.now())
      );
      if (currentState.accesToken.expiryDate > Date.now()) {
        console.debug('Token is not expired, skipping fetch');
        ctx.dispatch(new AccesTokenValidated());
        return;
      }
    }
  }

  @Action(FetchSpotifyClientToken)
  fetchSpotifyClientToken(ctx: StateContext<AuthStateModel>) {
    return this._authService.getClientToken$().pipe(
      tap(accesToken => {
        catchError(err => {
          ctx.dispatch(new RequestFailed(err));
          return of(undefined);
        }),
          ctx.patchState({ accesToken });
        ctx.dispatch(new AccesTokenValidated());
      })
    );
  }

  @Action(FetchSpotifyAuthorizationToken)
  fetchSpotifyAuthorizationToken(
    ctx: StateContext<AuthStateModel>,
    action: FetchSpotifyAuthorizationToken
  ) {
    const currentState = ctx.getState();
    if (!currentState.codeVerifier)
      throw Error('Code verifier could not be fetched from state');

    return this._authService
      .getAuthorizationToken$(
        action.authenticationCode,
        currentState.codeVerifier
      )
      .pipe(
        catchError(err => {
          ctx.dispatch(new RequestFailed(err));
          return of(undefined);
        }),
        tap(accesToken => {
          ctx.patchState({ accesToken });
          ctx.dispatch(new AccesTokenValidated());
        })
      );
  }

  @Action(RefreshSpotifyToken)
  refreshSpotifyToken(ctx: StateContext<AuthStateModel>) {
    const currentState = ctx.getState();
    if (
      !currentState.accesToken ||
      !isSpotifyAuthenticationToken(currentState.accesToken)
    )
      throw Error(
        'Accesstoken does not exist, or does not have a refreshtoken'
      );

    const refreshToken = currentState.accesToken.refreshToken;
    return this._authService.refreshAuthorizationToken$(refreshToken).pipe(
      catchError(err => {
        ctx.dispatch(new RequestFailed(err));
        return of(undefined);
      }),
      tap(accesToken => ctx.patchState({ accesToken })),
      tap(ctx.dispatch(new AccesTokenValidated()))
    );
  }

  @Action(PkceAuthenticate)
  async pkceAuthenticate(ctx: StateContext<AuthStateModel>) {
    const codeVerifier = auth.codeVerifier;
    const codeChallenge = await auth.codeChallenge();
    ctx.patchState({ codeVerifier });
    this._authService.pkceAuthenticate(codeChallenge);
  }

  @Action(RequestFailed)
  requestFailed(action: RequestFailed) {
    console.error(action.error);
  }
}

function accessTokenValid(
  accesToken?: SpotifyAccessToken
): accesToken is SpotifyAccessToken {
  if (!accesToken) {
    console.debug('no access token provided');
    return false;
  }
  if (accesToken.expiryDate < Date.now()) {
    console.debug(`access token expired at ${new Date(accesToken.expiryDate)}`);
    return false;
  }
  return true;
}
