import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpotifyState } from '@app/state';
import { NgxsModule } from '@ngxs/store';
import { AuthenticateComponent } from './authenticate.component';

describe('AuthenticateComponent', () => {
  let component: AuthenticateComponent;
  let fixture: ComponentFixture<AuthenticateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AuthenticateComponent,
        NgxsModule.forRoot([SpotifyState]),
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
