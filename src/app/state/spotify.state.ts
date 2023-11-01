import { Injectable, inject } from '@angular/core';
import {
  AuthService,
  SpotifyAccesTokenResponse,
} from '@app/services/auth.service';
import { SpotifyService } from '@app/services/spotify.service';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { map, tap } from 'rxjs/operators';
import {
  AccesTokenValidated,
  FetchSpotifyToken,
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
  private _spotifyService = inject(SpotifyService);

  @Selector()
  static accesToken(state: SpotifyStateModel): string | undefined {
    if (!state.accesToken) return undefined; // when null or undefined, return undefined
    if (state.accesToken.expiryDate < Date.now()) return undefined; // when expired, return undefined

    return state.accesToken.accessToken;
  }

  @Selector()
  static accesTokenExists(state: SpotifyStateModel) {
    return Boolean(state.accesToken);
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
    ctx.dispatch(new FetchSpotifyToken());
  }

  @Action(FetchSpotifyToken)
  fetchSpotifyToken(ctx: StateContext<SpotifyStateModel>) {
    this._authService
      .getToken$()
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
