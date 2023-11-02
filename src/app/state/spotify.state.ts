import { Injectable } from '@angular/core';
import { State } from '@ngxs/store';

export interface SpotifyStateModel {
  favorites: string[];
}

@State<SpotifyStateModel>({
  name: 'spotify',
  defaults: {
    favorites: [],
  },
})
@Injectable()
export class SpotifyState {
  constructor() {
    console.log('SpotifyState constructor');
  }
}
