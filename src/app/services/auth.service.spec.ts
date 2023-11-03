import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import {
  AuthService,
  SpotifyAccesTokenResponse,
  SpotifyUserAccessTokenResponse,
} from './auth.service';

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

  describe('getClientToken$', () => {
    it('should return an access token for client', () => {
      const mockResponse: SpotifyAccesTokenResponse = {
        access_token: 'mock-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
      };

      authService.getClientToken$().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(
        `https://accounts.spotify.com/api/token`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(
        'client_id=' +
          environment.spotifyClientId +
          '&client_secret=' +
          environment.spotifyClientSecret +
          '&grant_type=client_credentials'
      );
      expect(req.request.headers.get('Content-Type')).toEqual(
        'application/x-www-form-urlencoded'
      );

      req.flush(mockResponse);
    });
  });

  describe('getAuthorizationToken$', () => {
    it('should return an access token', () => {
      const mockResponse: SpotifyUserAccessTokenResponse = {
        access_token: 'mock-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'mock_refresh_token',
      };

      authService
        .getAuthorizationToken$('authorization_code', 'code_verifier')
        .subscribe(response => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpTestingController.expectOne(
        `https://accounts.spotify.com/api/token`
      );
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(
        'client_id=' +
          environment.spotifyClientId +
          '&code_verifier=code_verifier' +
          '&code=authorization_code' +
          '&grant_type=authorization_code' +
          '&redirect_uri=' +
          'http%3A%2F%2Flocalhost%3A4200%2Fauth%2Fcallback'
      );
      expect(req.request.headers.get('Content-Type')).toEqual(
        'application/x-www-form-urlencoded'
      );

      req.flush(mockResponse);
    });
  });

  it('should refresh an access token', () => {
    const mockResponse: SpotifyUserAccessTokenResponse = {
      access_token: 'mock-access-token',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'mock_refresh_token',
    };

    authService
      .refreshAuthorizationToken$('mock_refresh_token')
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

    const req = httpTestingController.expectOne(
      `https://accounts.spotify.com/api/token`
    );
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(
      'client_id=' +
        environment.spotifyClientId +
        '&grant_type=refresh_token' +
        '&refresh_token=mock_refresh_token'
    );
    expect(req.request.headers.get('Content-Type')).toEqual(
      'application/x-www-form-urlencoded'
    );

    req.flush(mockResponse);
  });
});
