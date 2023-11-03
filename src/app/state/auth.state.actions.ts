export class FetchSpotifyToken {
  static readonly type = '[Auth] Fetch Spotify Token';
  constructor(
    public flow: 'client-secret' | 'pkce' = 'client-secret',
    public authenticationCode?: string
  ) {}
}

export class RefreshSpotifyToken {
  static readonly type = '[Auth] Refresh Spotify Token';
}

export class PkceAuthenticate {
  static readonly type = '[Auth] PKCE Authenticate';
}

export class AccesTokenValidated {
  static readonly type = '[Auth] Spotify Access Token Validated';
}
