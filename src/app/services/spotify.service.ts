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

  getArtist$(id: string) {
    return this._httpClient.get(`${environment.spotifyApi}artists/${id}`);
  }

  getNewReleases$() {
    return this._httpClient
      .get<{ albums: NewReleasesResponse }>(
        `${environment.spotifyApi}browse/new-releases`
      )
      .pipe(map(mapNewReleases));
  }
}

function mapNewReleases(newReleases: { albums: NewReleasesResponse }) {
  type accMap = {
    [key: string]: Album | AlbumArtist;
  };

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
    .reduce(
      ([accAlbums, accArtists], { album, artist }) => {
        if (accAlbums[album.id] === undefined) {
          accAlbums[album.id] = album;
        }

        if (accArtists[artist.id] === undefined) {
          accArtists[artist.id] = artist;
        }
        return [accAlbums, accArtists];
      },
      [{} as accMap, {} as accMap]
    );

  const albums = Object.values(releaseValues[0]) as Array<Album>;
  const artists = Object.values(releaseValues[1]) as Array<AlbumArtist>;

  console.debug('succesfully mapped new releases', newReleases, {
    albums,
    artists,
  });

  return { albums, artists };
}

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
  artists: Array<ArtistResponse>;
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

type ArtistResponse = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: 'artist';
  uri: string;
};

type ImageResponse = {
  height: number;
  url: string;
  width: number;
};
