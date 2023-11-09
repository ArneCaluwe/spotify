import { Injectable, inject } from '@angular/core';
import {
  Album,
  AlbumArtist,
  Artist,
  SpotifyService,
} from '@app/services/spotify.service';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { AccesTokenValidated } from './auth.state.actions';
import {
  FetchNewReleases,
  FetchRelatedArtists,
  FetchUserFavorites,
} from './spotify.state.actions';

export interface SpotifyStateModel {
  favorites: unknown[];
  albums: Array<Album>;
  albumArtists: { [key: string]: AlbumArtist };
  artists: Array<Artist>;
}

@State<SpotifyStateModel>({
  name: 'spotify',
  defaults: {
    favorites: [],
    albums: [],
    albumArtists: {},
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
  static albums(state: SpotifyStateModel) {
    return state.albums;
  }

  @Selector()
  static artists(state: SpotifyStateModel) {
    return state.artists;
  }

  @Action(AccesTokenValidated)
  accessTokenValidated(ctx: StateContext<SpotifyStateModel>) {
    ctx.dispatch(new FetchNewReleases());
    ctx.dispatch(new FetchRelatedArtists('7oPftvlwr6VrsViSDV7fJY'));
  }

  @Action(FetchNewReleases)
  fetchNewReleases(ctx: StateContext<SpotifyStateModel>) {
    return this._spotifyService.getNewReleases$().pipe(
      tap(response =>
        ctx.patchState({
          albums: response.albums,
          albumArtists: response.artists,
        })
      )
    );
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
