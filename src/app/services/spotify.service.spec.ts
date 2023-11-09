import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Album, AlbumArtist, Artist, SpotifyService } from './spotify.service';

describe('SpotifyService', () => {
  let spotifyService: SpotifyService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    spotifyService = TestBed.inject(SpotifyService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(spotifyService).toBeTruthy();
  });

  describe('getNewReleases$', () => {
    it('should return all new releases', () => {
      const mockResponse = [] as const;

      const expectedResponse: {
        albums: Array<Album>;
        artists: { [key: string]: AlbumArtist };
      } = {
        albums: [],
        artists: {},
      };

      spotifyService.getNewReleases$().subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpTestingController.expectOne(
        `https://api.spotify.com/v1/browse/new-releases`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(mockResponse);
    });

    it('should correctly map albums', () => {
      const expectedResponse: {
        albums: Array<Album>;
        artists: { [key: string]: AlbumArtist };
      } = {
        albums: [
          {
            href: 'mock-href',
            id: 'mock-id',
            images: [
              {
                height: 640,
                url: 'mock-image-url',
                width: 640,
              },
            ],
            name: 'mock-name',
            uri: 'mock-uri',
            artist: 'mock-artist-id',
          },
        ],
        artists: {
          'mock-artist-id': {
            href: 'mock-href',
            id: 'mock-artist-id',
            name: 'mock-name',
            uri: 'mock-uri',
          },
        },
      };

      spotifyService.getNewReleases$().subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpTestingController.expectOne(
        `https://api.spotify.com/v1/browse/new-releases`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(MOCK_ALBUM_RESPONSE);
    });
  });

  describe('getRelatedArtists$', () => {
    it('should return all related artists', () => {
      const mockResponse = { artists: [] as const };

      const expectedResponse = [] as const;

      spotifyService.getRelatedArtists$('mock-artist').subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpTestingController.expectOne(
        `https://api.spotify.com/v1/artists/mock-artist/related-artists`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(mockResponse);
    });

    it('should correctly map artists', () => {
      const expectedResponse: Array<Artist> = [
        {
          id: 'mock-id',
          name: 'mock-name',
          uri: 'mock-uri',
          href: 'mock-href',
          genres: ['mock-genre'],
          images: [
            {
              height: 640,
              url: 'mock-image-url',
              width: 640,
            },
          ],
        },
      ];
      spotifyService.getRelatedArtists$('mock-artist').subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpTestingController.expectOne(
        `https://api.spotify.com/v1/artists/mock-artist/related-artists`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(MOCK_ARTIST_RESPONSE);
    });
  });

  describe('getTopItems$', () => {
    it('should return an authorized users favorites', () => {
      const mockResponse = [] as const;

      const expectedResponse = [] as const;

      spotifyService.getTopItems$().subscribe(response => {
        expect(response).toEqual(expectedResponse);
      });

      const req = httpTestingController.expectOne(
        `https://api.spotify.com/v1/me/top/tracks`
      );
      expect(req.request.method).toEqual('GET');

      req.flush(mockResponse);
    });
  });
});

const MOCK_ALBUM_RESPONSE = [
  {
    album_type: 'mock-album-type',
    artists: [
      {
        external_urls: {
          spotify: 'mock-artitst-url',
        },
        href: 'mock-href',
        id: 'mock-artist-id',
        name: 'mock-name',
        type: 'artist',
        uri: 'mock-uri',
      },
    ],
    available_markets: 'MOCK-MARKET',
    external_urls: {
      spotify: 'mock-spotify-url',
    },
    href: 'mock-href',
    id: 'mock-id',
    images: [
      {
        height: 640,
        url: 'mock-image-url',
        width: 640,
      },
    ],
    name: 'mock-name',
    release_date: 'mock-release-date',
    release_date_precision: 'day',
    total_tracks: 5,
    type: 'album',
    uri: 'mock-uri',
  },
];

const MOCK_ARTIST_RESPONSE = [
  {
    external_urls: {
      spotify: 'mock-spotify-url',
    },
    followers: {
      href: null,
      total: 0,
    },
    genres: ['mock-genre'],
    href: 'mock-href',
    id: 'mock-id',
    images: [
      {
        height: 640,
        url: 'mock-image-url',
        width: 640,
      },
    ],
    name: 'mock-name',
    popularity: 0,
    type: 'artist',
    uri: 'mock-uri',
  },
];
