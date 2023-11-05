import { Injectable, inject } from '@angular/core';
import {
  Album,
  AlbumArtist,
  SpotifyService,
} from '@app/services/spotify.service';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { AccesTokenValidated } from './auth.state.actions';
import { FetchNewReleases, FetchUserFavorites } from './spotify.state.actions';

export interface SpotifyStateModel {
  favorites: unknown[];
  albums: Array<Album>;
  artists: Array<AlbumArtist>;
}

@State<SpotifyStateModel>({
  name: 'spotify',
  defaults: {
    favorites: [],
    albums: [],
    artists: [],
  },
})
@Injectable()
export class SpotifyState {
  private _spotifyService = inject(SpotifyService);

  @Action(AccesTokenValidated)
  accessTokenValidated(ctx: StateContext<SpotifyStateModel>) {
    ctx.dispatch(new FetchNewReleases()).subscribe(console.log);
  }

  @Action(FetchNewReleases)
  fetchNewReleases(ctx: StateContext<SpotifyStateModel>) {
    return this._spotifyService
      .getNewReleases$()
      .pipe(
        tap(response =>
          ctx.patchState({ albums: response.albums, artists: response.artists })
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
}
