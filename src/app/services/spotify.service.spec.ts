import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Album, AlbumArtist, SpotifyService } from './spotify.service';

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
        artists: Array<AlbumArtist>;
      } = {
        albums: [],
        artists: [],
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
