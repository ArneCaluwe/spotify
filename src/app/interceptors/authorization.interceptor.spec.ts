import { TestBed } from '@angular/core/testing';

import { HttpEvent, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpotifyState } from '@app/state/spotify.state';
import { NgxsModule, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { authorizationInterceptor } from './authorization.interceptor';

describe('authorizationInterceptor', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([SpotifyState])],
      providers: [],
    });

    store = TestBed.inject(Store);
  });

  // ...

  it('should add an Authorization header', () => {
    const mockToken = 'mock-token';
    spyOn(store, 'selectSnapshot').and.returnValue(mockToken);

    const next = (
      req: HttpRequest<unknown>
    ): Observable<HttpEvent<unknown>> => {
      expect(req.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      return new Observable();
    };

    TestBed.runInInjectionContext(() => {
      authorizationInterceptor(new HttpRequest('GET', '/'), next);
    });
  });
});
