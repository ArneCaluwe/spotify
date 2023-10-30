import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _httpClient = inject(HttpClient);

  getToken$(): Observable<SpotifyAccesTokenResponse> {
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const clientId = environment.spotifyClientId;
    const clientSecret = environment.spotifyClientSecret;
    return this._httpClient.post<SpotifyAccesTokenResponse>(
      `${environment.authApi}token`,
      `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      { headers }
    );
  }
}

export type SpotifyAccesTokenResponse = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
};
