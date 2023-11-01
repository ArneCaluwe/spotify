import { AccesToken } from './spotify.state';

export class FetchSpotifyToken {
  static readonly type = '[Spotify] Fetch Spotify Token';
}
export class AccesTokenValidated {
  static readonly type = '[Spotify] Spotify Access Token Validated';
  constructor(
    public unchanged: boolean,
    public accesToken?: AccesToken
  ) {}
}
