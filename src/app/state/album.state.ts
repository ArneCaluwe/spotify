import { Injectable, inject } from '@angular/core';
import {
  Album,
  AlbumArtist,
  SpotifyService,
} from '@app/services/spotify.service';
import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { AccesTokenValidated } from './auth.state.actions';
import { FetchNewReleases } from './spotify.state.actions';

export interface AlbumsStateModel {
  newReleases: Array<Album>;
  albumArtists: { [key: string]: AlbumArtist };
}

const ALBUM_STATE_TOKEN = new StateToken<AlbumsStateModel[]>('albums');
@State<AlbumsStateModel>({
  name: ALBUM_STATE_TOKEN,
  defaults: {
    newReleases: [],
    albumArtists: {},
  },
})
@Injectable()
export class AlbumsState {
  private _spotifyService = inject(SpotifyService);

  @Selector()
  static newReleases(state: AlbumsStateModel) {
    return state.newReleases;
  }

  @Selector()
  static albumArtists(state: AlbumsStateModel) {
    return state.albumArtists;
  }

  @Action(AccesTokenValidated)
  accessTokenValidated(ctx: StateContext<AlbumsStateModel>) {
    ctx.dispatch(new FetchNewReleases());
  }

  @Action(FetchNewReleases)
  fetchNewReleases(ctx: StateContext<AlbumsStateModel>) {
    return this._spotifyService.getNewReleases$().pipe(
      tap(response =>
        ctx.patchState({
          newReleases: response.albums,
          albumArtists: response.artists,
        })
      )
    );
  }
}
