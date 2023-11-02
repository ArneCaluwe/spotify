import { AccesToken } from './spotify.state';

export class FetchSpotifyToken {
  static readonly type = '[Spotify] Fetch Spotify Token';
  constructor(
    public flow: 'client-secret' | 'pkce' = 'client-secret',
    public authenticationCode?: string
  ) {}
}

export class PkceAuthenticate {
  static readonly type = '[Spotify] PKCE Authenticate';
}

export class AccesTokenValidated {
  static readonly type = '[Spotify] Spotify Access Token Validated';
  constructor(
    public unchanged: boolean,
    public accesToken?: AccesToken
  ) {}
}
