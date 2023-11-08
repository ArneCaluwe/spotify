import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  AccesTokenValidated,
  FetchSpotifyAuthorizationToken,
  SpotifyState,
} from '@app/state';
import { Navigate } from '@ngxs/router-plugin';
import { Actions, NgxsModule, Store } from '@ngxs/store';
import { Subject, of } from 'rxjs';
import { AuthCallbackComponent } from './auth-callback.component';

describe(AuthCallbackComponent.name, () => {
  let component: AuthCallbackComponent;
  let fixture: ComponentFixture<AuthCallbackComponent>;

  let store: Store;
  let actions$: Subject<AccesTokenValidated>;
  beforeEach(async () => {
    actions$ = new Subject<AccesTokenValidated>();
    await TestBed.configureTestingModule({
      imports: [
        AuthCallbackComponent,
        NgxsModule.forRoot([SpotifyState]),
        HttpClientTestingModule,
      ],
    })
      .overrideProvider(Actions, {
        useValue: { pipe: () => actions$.asObservable() },
      })
      .compileComponents();

    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.returnValue(of(undefined));

    fixture = TestBed.createComponent(AuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch fetchAuthorizationToken with token when token is provided', () => {
    component.code = 'mock-authentication-code';
    expect(store.dispatch).toHaveBeenCalledOnceWith(
      new FetchSpotifyAuthorizationToken('mock-authentication-code')
    );
  });

  it('should navigate to root on success', () => {
    actions$.next(new AccesTokenValidated());
    expect(store.dispatch).toHaveBeenCalledOnceWith(new Navigate(['/']));
  });
});
