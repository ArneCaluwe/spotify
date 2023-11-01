import { Injectable, inject } from '@angular/core';
import {
  AuthService,
  SpotifyAccesTokenResponse,
} from '@app/services/auth.service';
import { SpotifyService } from '@app/services/spotify.service';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FetchSpotifyToken } from './spotify.state.actions';

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
    console.log(ctx.getState());
    const currentState = ctx.getState();
    if (currentState.accesToken) {
      console.debug('Token exists, checking if expired');
      if (currentState.accesToken.expiryDate > Date.now()) {
        console.debug('Token is not expired, skipping fetch');
        return;
      }
    }
    ctx
      .dispatch(new FetchSpotifyToken())
      .subscribe(() =>
        this._spotifyService
          .getArtist$('1rvnJJghrxl1xakJZct08m')
          .subscribe(console.log)
      );
  }

  @Action(FetchSpotifyToken)
  fetchSpotifyToken(
    ctx: StateContext<SpotifyStateModel>
  ): Observable<AccesToken> {
    return this._authService.getToken$().pipe(
      map<SpotifyAccesTokenResponse, AccesToken>(res => {
        return {
          accessToken: res.access_token,
          expiryDate: Date.now() + res.expires_in,
          tokenType: res.token_type,
        };
      }),
      tap(accesToken => ctx.patchState({ accesToken }))
    );
  }
}

export type AccesToken = {
  accessToken: string;
  tokenType: 'Bearer';
  expiryDate: number;
};
