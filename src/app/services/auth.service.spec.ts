import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should return an access token', () => {
    const mockResponse = {
      access_token: 'mock-access-token',
      token_type: 'Bearer',
      expires_in: 3600,
    };

    authService.getToken$().subscribe(response => {
      expect(response.access_token).toEqual(mockResponse.access_token);
      expect(response.token_type).toEqual(mockResponse.token_type);
      expect(response.expires_in).toEqual(mockResponse.expires_in);
    });

    const req = httpTestingController.expectOne(`${environment.authApi}token`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(
      'grant_type=client_credentials&client_id=' +
        environment.spotifyClientId +
        '&client_secret=' +
        environment.spotifyClientSecret
    );
    expect(req.request.headers.get('Content-Type')).toEqual(
      'application/x-www-form-urlencoded'
    );

    req.flush(mockResponse);
  });
});
