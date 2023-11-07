import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FetchSpotifyAuthorizationToken, SpotifyState } from '@app/state';
import { NgxsModule, Store } from '@ngxs/store';
import { AuthCallbackComponent } from './auth-callback.component';

describe(AuthCallbackComponent.name, () => {
  let component: AuthCallbackComponent;
  let fixture: ComponentFixture<AuthCallbackComponent>;

  let store: Store;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuthCallbackComponent,
        NgxsModule.forRoot([SpotifyState]),
        RouterTestingModule,
        HttpClientTestingModule,
      ],
    }).compileComponents();

    const activatedRoute = TestBed.inject(ActivatedRoute);
    activatedRoute.snapshot.queryParams = {
      code: 'mock-authentication-code',
    };
    store = TestBed.inject(Store);
    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(AuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch fetchAuthorizationToken with snapshot', () => {
    expect(store.dispatch).toHaveBeenCalledOnceWith(
      new FetchSpotifyAuthorizationToken('mock-authentication-code')
    );
  });
});
