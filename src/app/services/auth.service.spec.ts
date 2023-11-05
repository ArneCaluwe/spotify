import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import {
  AuthService,
  SpotifyAuthenticationToken,
  SpotifyClientToken,
} from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;

  jasmine.clock().install();
  const baseTime = new Date(2013, 9, 23);
  jasmine.clock().mockDate(baseTime);

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
      const mockResponse = {
        access_token: 'mock-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
      };

      const expectedResponse: SpotifyClientToken = {
        accessToken: 'mock-access-token',
        tokenType: 'Bearer',
        expiryDate: baseTime.valueOf() + 3_600_000,
      };

      authService.getClientToken$().subscribe(response => {
        expect(response).toEqual(expectedResponse);
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
      const mockResponse = {
        access_token: 'mock-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: 'mock_refresh_token',
      };

      const expectedResponse: SpotifyAuthenticationToken = {
        accessToken: 'mock-access-token',
        tokenType: 'Bearer',
        refreshToken: 'mock_refresh_token',
        expiryDate: baseTime.valueOf() + 3_600_000,
      };

      authService
        .getAuthorizationToken$('authorization_code', 'code_verifier')
        .subscribe(response => {
          expect(response).toEqual(expectedResponse);
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
          'http%3A%2F%2Flocalhost%3A4200%2Fauth%2Fcallback' +
          '&scope=user-top-read'
      );
      expect(req.request.headers.get('Content-Type')).toEqual(
        'application/x-www-form-urlencoded'
      );

      req.flush(mockResponse);
    });
  });

  it('should refresh an access token', () => {
    const mockResponse = {
      access_token: 'mock-access-token',
      token_type: 'Bearer',
      expires_in: 3600,
      refresh_token: 'mock_refresh_token',
    };

    const expectedResponse: SpotifyAuthenticationToken = {
      accessToken: 'mock-access-token',
      tokenType: 'Bearer',
      refreshToken: 'mock_refresh_token',
      expiryDate: baseTime.valueOf() + 3_600_000,
    };

    authService
      .refreshAuthorizationToken$('mock_refresh_token')
      .subscribe(response => {
        expect(response).toEqual(expectedResponse);
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
