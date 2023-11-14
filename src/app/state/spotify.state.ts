import { Injectable, inject } from '@angular/core';
import { Artist, SpotifyService } from '@app/services/spotify.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { AccesTokenValidated } from './auth.state.actions';
import {
  FetchRelatedArtists,
  FetchUserFavorites,
} from './spotify.state.actions';

export interface SpotifyStateModel {
  favorites: unknown[];
  artists: Array<Artist>;
}

@State<SpotifyStateModel>({
  name: 'spotify',
  defaults: {
    favorites: [],
    artists: [],
  },
})
@Injectable()
export class SpotifyState {
  private _spotifyService = inject(SpotifyService);

  @Selector()
  static favorites(state: SpotifyStateModel) {
    return state.favorites;
  }
  @Selector()
  static artists(state: SpotifyStateModel) {
    return state.artists;
  }

  @Action(AccesTokenValidated)
  accessTokenValidated(ctx: StateContext<SpotifyStateModel>) {
    ctx.dispatch(new FetchRelatedArtists('7oPftvlwr6VrsViSDV7fJY'));
  }

  @Action(FetchUserFavorites)
  fetchUserFavorites(ctx: StateContext<SpotifyStateModel>) {
    return this._spotifyService
      .getTopItems$('tracks')
      .pipe(
        tap(response => ctx.patchState({ favorites: response as unknown[] }))
      );
  }

  @Action(FetchRelatedArtists)
  fetchRelatedArtists(
    ctx: StateContext<SpotifyStateModel>,
    action: FetchRelatedArtists
  ) {
    return this._spotifyService
      .getRelatedArtists$(action.artistId)
      .pipe(tap(response => ctx.patchState({ artists: response })));
  }
}
