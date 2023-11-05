import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { AuthState, AuthStateModel } from './auth.state';
import { AccesTokenValidated } from './auth.state.actions';

describe('AuthState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([AuthState])],
    });

    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should return undefined when accesToken is  undefined', () => {
    const state = {
      auth: {
        accesToken: undefined,
      },
    };
    store.reset(state);
    const response = store.selectSnapshot(AuthState.accesToken);
    expect(response).toBeUndefined();
  });

  it('should return undefined when accesToken is expired', () => {
    const state = {
      auth: {
        accesToken: {
          accessToken: 'mock-token',
          expiryDate: Date.now() - 1000, // expired
        },
      },
    };
    store.reset(state);
    const response = store.selectSnapshot(AuthState.accesToken);
    expect(response).toBeUndefined();
  });

  it('should return the access token when accesToken is valid', () => {
    const state = {
      auth: {
        accesToken: {
          accessToken: 'mock-token',
          expiryDate: Date.now() + 1000, // not expired
        },
      },
    };
    store.reset(state);
    const response = store.selectSnapshot(AuthState.accesToken);
    expect(response).toEqual('mock-token');
  });

  it('should return the access token when accesToken is valid', () => {
    const state = {
      auth: {
        accesToken: {
          accessToken: 'mock-token',
          expiryDate: Date.now() + 1000, // not expired
        },
      },
    };
    store.reset(state);
    const response = store.selectSnapshot(AuthState.accesToken);
    expect(response).toEqual('mock-token');
  });

  describe('ngOnInit', () => {
    let state: AuthStateModel;
    let authState: AuthState;
    let store: Store;
    beforeEach(() => {
      state = {
        accesToken: {
          accessToken: 'mock-token',
          tokenType: 'Bearer',
          expiryDate: Date.now() + 1000, // not expired
        },
      };

      authState = TestBed.inject(AuthState);
      store = TestBed.inject(Store);

      store.reset({ spotify: state });
    });

    it('should dispatch AccessToken-validated if access token is not expired', () => {
      const stateContextMock = jasmine.createSpyObj('StateContext', [
        'getState',
        'dispatch',
      ]);
      stateContextMock.getState.and.returnValue(state);
      authState.ngxsOnInit(stateContextMock);

      expect(stateContextMock.dispatch).toHaveBeenCalledOnceWith(
        new AccesTokenValidated()
      );
    });
  });
});
