import { inject } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { FetchSpotifyToken } from './spotify.state.actions';

export interface SpotifyStateModel {
  accesToken?: string;
}

@State<SpotifyStateModel>({
  name: 'spotify',
  defaults: {
    accesToken: '',
  },
})
export class SpotifyState implements NgxsOnInit {
  ngxsOnInit(ctx: StateContext<SpotifyStateModel>): void {
    ctx.dispatch(new FetchSpotifyToken());
  }
  private _authService = inject(AuthService);

  @Selector()
  static accesToken(state: SpotifyStateModel) {
    return state.accesToken;
  }

  @Action(FetchSpotifyToken)
  fetchSpotifyToken(ctx: StateContext<SpotifyStateModel>) {
    this._authService.getToken$().subscribe(res => {
      ctx.patchState({ accesToken: res.access_token });
    });
  }
}
