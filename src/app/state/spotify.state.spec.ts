import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { SpotifyState, SpotifyStateModel } from './spotify.state';
import {
  AccesTokenValidated,
  FetchSpotifyToken,
} from './spotify.state.actions';

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

  it('should not fetch token if it is not expired', () => {
    const state: SpotifyStateModel = {
      accesToken: {
        accessToken: 'mock-token',
        tokenType: 'Bearer',
        expiryDate: Date.now() + 1000, // not expired
      },
      favorites: [],
    };

    const spotifyState = TestBed.inject(SpotifyState);
    expect(spotifyState).toBeTruthy();
    const store = TestBed.inject(Store);
    store.reset({ spotify: state });
    const stateContextMock = jasmine.createSpyObj('StateContext', [
      'getState',
      'dispatch',
    ]);
    stateContextMock.getState.and.returnValue(state);
    spotifyState.ngxsOnInit(stateContextMock);

    expect(stateContextMock.dispatch).toHaveBeenCalledOnceWith(
      new AccesTokenValidated(false)
    );
  });

  it('should fetch token if it is expired', () => {
    const state: SpotifyStateModel = {
      accesToken: {
        accessToken: 'mock-token',
        tokenType: 'Bearer',
        expiryDate: Date.now() - 1000, // not expired
      },
      favorites: [],
    };

    const spotifyState = TestBed.inject(SpotifyState);
    expect(spotifyState).toBeTruthy();
    const store = TestBed.inject(Store);
    store.reset({ spotify: state });
    const stateContextMock = jasmine.createSpyObj('StateContext', [
      'getState',
      'dispatch',
    ]);
    stateContextMock.getState.and.returnValue(state);
    spotifyState.ngxsOnInit(stateContextMock);

    expect(stateContextMock.dispatch).toHaveBeenCalledOnceWith(
      new FetchSpotifyToken()
    );
  });
});
