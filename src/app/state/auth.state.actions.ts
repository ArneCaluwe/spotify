export class FetchSpotifyClientToken {
  static readonly type = '[Auth] Fetch Spotify Client Token';
}

export class FetchSpotifyAuthorizationToken {
  static readonly type = '[Auth] Fetch Spotify Authorization Token';
  constructor(public authenticationCode: string) {}
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

export class RequestFailed {
  static readonly type = '[Auth] Request Failed';
  constructor(
    public error: Error,
    public msg?: string
  ) {}
}
