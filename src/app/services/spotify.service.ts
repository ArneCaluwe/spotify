import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@env/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private _httpClient = inject(HttpClient);

  getTopItems$(type: 'artists' | 'tracks' = 'tracks') {
    return this._httpClient.get(`${environment.spotifyApi}me/top/${type}`);
  }

  getNewReleases$() {
    return this._httpClient
      .get<{ albums: NewReleasesResponse }>(
        `${environment.spotifyApi}browse/new-releases`
      )
      .pipe(map(mapNewReleases));
  }

  getRelatedArtists$(id: string) {
    return this._httpClient
      .get<{ artists: Array<ArtistResponse> }>(
        `${environment.spotifyApi}artists/${id}/related-artists`
      )
      .pipe(map(mapArtists));
  }
}

function mapNewReleases(newReleases: { albums: NewReleasesResponse }) {
  const releaseValues = newReleases.albums.items
    .map(item => {
      const artist = item.artists.map(artist => {
        return {
          id: artist.id,
          name: artist.name,
          uri: artist.uri,
          href: artist.href,
        };
      })[0];
      // we suppose only a single artist will be found for each album

      const album = {
        id: item.id,
        name: item.name,
        images: item.images,
        artist: item.artists[0].name,
        uri: item.uri,
        href: item.href,
      };
      return { album, artist };
    })
    .reduce<
      [
        { [key: string]: Album },
        {
          [key: string]: AlbumArtist;
        },
      ]
    >(
      ([accAlbums, accArtists], { album, artist }) => {
        if (accAlbums[album.id] === undefined) {
          accAlbums[album.id] = album;
        }

        if (accArtists[artist.id] === undefined) {
          accArtists[artist.id] = artist;
        }
        return [accAlbums, accArtists];
      },
      [{}, {}]
    );

  const albums = Object.values(releaseValues[0]);
  const artists = releaseValues[1];

  console.debug('succesfully mapped new releases', newReleases, {
    albums,
    artists,
  });

  return { albums, artists };
}

function mapArtists(artists: { artists: Array<Artist> }) {
  return artists.artists.map(artist => {
    return {
      id: artist.id,
      name: artist.name,
      uri: artist.uri,
      href: artist.href,
      genres: artist.genres,
      images: artist.images,
    };
  });
}

export type Artist = {
  id: string;
  name: string;
  uri: string;
  href: string;
  genres: Array<string>;
  images: Array<ImageResponse>;
};

export type AlbumArtist = {
  id: string;
  name: string;
  uri: string;
  href: string;
};

export type Album = {
  id: string;
  name: string;
  images: Array<ImageResponse>;
  artist: string;
  uri: string;
  href: string;
};

type NewReleasesResponse = {
  href: string;
  items: Array<AlbumResponse>;
  limit: number;
  offset: number;
  previous: null;
  total: number;
  next: string;
};

type AlbumResponse = {
  album_type: string;
  artists: Array<AlbumArtistResponse>;
  available_markets: Array<string>;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Array<ImageResponse>;
  name: string;
  release_date: string;
  release_date_precision: 'day';
  total_tracks: number;
  type: 'album';
  uri: string;
};

type AlbumArtistResponse = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
};

type ArtistResponse = {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null;
    total: number;
  };
  genres: Array<string>;
  href: string;
  id: string;
  images: Array<ImageResponse>;
  name: string;
  popularity: number;
  type: 'artist';
  uri: string;
};

type ImageResponse = {
  height: number;
  url: string;
  width: number;
};
