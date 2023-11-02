import { Injectable, inject } from '@angular/core';
import {
  AuthService,
  SpotifyAccesTokenResponse,
} from '@app/services/auth.service';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import {
  AccesTokenValidated,
  FetchSpotifyToken,
  PkceAuthenticate,
} from './spotify.state.actions';

export interface SpotifyStateModel {
  accesToken?: AccesToken;
  favorites: string[];
}

@State<SpotifyStateModel>({
  name: 'spotify',
  defaults: {
    accesToken: undefined,
    favorites: [],
  },
})
@Injectable()
export class SpotifyState implements NgxsOnInit {
  private _authService = inject(AuthService);

  @Selector()
  static accesToken(state: SpotifyStateModel): string | undefined {
    if (!state.accesToken) return undefined; // when null or undefined, return undefined
    if (state.accesToken.expiryDate < Date.now()) return undefined; // when expired, return undefined

    return state.accesToken.accessToken;
  }

  @Selector()
  static accesTokenExists(state: SpotifyStateModel) {
    return state.accesToken && state.accesToken.expiryDate > Date.now();
  }

  ngxsOnInit(ctx: StateContext<SpotifyStateModel>): void {
    const currentState = ctx.getState();
    if (currentState.accesToken) {
      console.debug('Token exists, checking if expired');
      if (currentState.accesToken.expiryDate > Date.now()) {
        console.debug('Token is not expired, skipping fetch');
        ctx.dispatch(new AccesTokenValidated(false));
        return;
      }
    }
    // ctx.dispatch(new FetchSpotifyToken());
  }

  @Action(FetchSpotifyToken)
  fetchSpotifyToken(
    ctx: StateContext<SpotifyStateModel>,
    action: FetchSpotifyToken
  ) {
    if (action.flow === 'client-secret') {
      this._authService
        .getClientToken$()
        .pipe(
          map<SpotifyAccesTokenResponse, AccesToken>(res => {
            return {
              accessToken: res.access_token,
              expiryDate: Date.now() + res.expires_in * 1000,
              tokenType: res.token_type,
            };
          }),
          tap(accesToken =>
            ctx.dispatch(new AccesTokenValidated(true, accesToken))
          )
        )
        .subscribe();
    } else {
      this._authService
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .getAuthorizationToken$(action.authenticationCode!)
        .subscribe(console.log);
    }
  }

  @Action(PkceAuthenticate)
  pkceAuthenticate() {
    this._authService.pkceAuthenticate();
  }

  @Action(AccesTokenValidated)
  accesTokenReceived(
    ctx: StateContext<SpotifyStateModel>,
    action: AccesTokenValidated
  ) {
    if (action.unchanged) return;
    ctx.patchState({ accesToken: action.accesToken });
  }
}

export type AccesToken = {
  accessToken: string;
  expiryDate: number;
  tokenType: 'Bearer';
};
