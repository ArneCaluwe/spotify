import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { SpotifyState } from './spotify.state';

describe('SpotifyState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([SpotifyState])],
    });

    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should return empty array for artists when no artists', () => {
    const state = {
      spotify: {
        artists: [],
      },
    };
    store.reset(state);
    const response = store.selectSnapshot(SpotifyState.artists);
    expect(response).toEqual([]);
  });
});
