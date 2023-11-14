import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { AlbumsState } from './album.state';

describe('SpotifyState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([AlbumsState])],
    });

    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should return empty array for new releases when no albums', () => {
    const state = {
      albums: {
        newReleases: [],
      },
    };
    store.reset(state);
    const response = store.selectSnapshot(AlbumsState.newReleases);
    expect(response).toEqual([]);
  });
});
