export class FetchUserFavorites {
  static readonly type = '[Spotify] Fetch User Favorites';
}

export class FetchNewReleases {
  static readonly type = '[Spotify] Fetch New Releases';
}

export class FetchRelatedArtists {
  static readonly type = '[Spotify] Fetch Related Artists';
  constructor(public artistId: string) {}
}
