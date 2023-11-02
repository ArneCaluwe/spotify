import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { generateRandomString } from '@app/auth/code-verifier';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _httpClient = inject(HttpClient);

  /**
   * Fetch an access token from the Spotify API.
   * Does not link to a certain user,
   * so it can only be used to fetch public data.
   */
  getClientToken$(): Observable<SpotifyAccesTokenResponse> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const clientId = environment.spotifyClientId;
    const clientSecret = environment.spotifyClientSecret;
    return this._httpClient.post<SpotifyAccesTokenResponse>(
      `${environment.authApi}token`,
      `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      { headers }
    );
  }

  /**
   * fetch an access token from the Spotify API.
   * This token is linked to a certain user,
   * so it can be used to fetch private data.
   * @param authorizationCode The authorization code that was returned from the Spotify API.
   * @returns An observable that emits the access token.
   */
  getAuthorizationToken$(
    authorizationCode: string,
    codeVerifier: string
  ): Observable<SpotifyAccesTokenResponse> {
    const clientId = environment.spotifyClientId;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const body = new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code: authorizationCode,
      redirect_uri: environment.redirectUrl,
      code_verifier: codeVerifier,
    });
    return this._httpClient.post<SpotifyAccesTokenResponse>(
      `${environment.authApi}api/token`,
      body.toString(),
      { headers }
    );
  }

  async pkceAuthenticate(codeChallenge: string) {
    const clientId = environment.spotifyClientId;
    const redirectUri = environment.redirectUrl;

    const url = new URL(`${environment.authApi}authorize`);
    const params = {
      response_type: 'code',
      client_id: clientId,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
      state: generateRandomString(16),
    };
    url.search = new URLSearchParams(params).toString();
    window.location.href = url.toString();
  }
}

export type SpotifyAccesTokenResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
};
