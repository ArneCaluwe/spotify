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

  it('should return undefined when accesToken is  undefined', () => {
    const state = {
      spotify: {
        accesToken: undefined,
      },
    };
    store.reset(state);
    const response = store.selectSnapshot(SpotifyState.accesToken);
    expect(response).toBeUndefined();
  });

  it('should return undefined when accesToken is expired', () => {
    const state = {
      spotify: {
        accesToken: {
          accessToken: 'mock-token',
          expiryDate: Date.now() - 1000, // expired
        },
      },
    };
    store.reset(state);
    const response = store.selectSnapshot(SpotifyState.accesToken);
    expect(response).toBeUndefined();
  });

  it('should return the access token when accesToken is valid', () => {
    const state = {
      spotify: {
        accesToken: {
          accessToken: 'mock-token',
          expiryDate: Date.now() + 1000, // not expired
        },
      },
    };
    store.reset(state);
    const response = store.selectSnapshot(SpotifyState.accesToken);
    expect(response).toEqual('mock-token');
  });
});
