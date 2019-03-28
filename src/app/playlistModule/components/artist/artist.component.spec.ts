/**
 * Gonzalo Chacón
 */

import { of as observableOf } from 'rxjs';
import { SpotifyService } from '@app/playlistModule/services';
import { ActivatedRoute } from '@angular/router';
import { ALBUM_MOCK, ARTIST_MOCK } from '@app/core/utils/testMocks';
import { ArtistComponent } from './artist.component';

class MockActivatedRoute extends ActivatedRoute {
  public params = observableOf({ artistId: 'artist123' });
}
describe('ArtistComponent Unit Tests:', () => {
  let component: ArtistComponent;
  let _spotifyService: SpotifyService;
  let _activatedRoute: MockActivatedRoute;

  let spySpofityGetArtist;
  let spySpofityGetArtistAlbums;
  let spySpofityGetArtistRelated;

  beforeEach(() => {
    _spotifyService = new SpotifyService(null);
    _activatedRoute = new MockActivatedRoute();

    jasmine.clock().install();
    component = new ArtistComponent(_spotifyService, _activatedRoute);

    spySpofityGetArtist = spyOn(_spotifyService, 'getArtist').and.returnValue(observableOf(ARTIST_MOCK));
    spySpofityGetArtistAlbums = spyOn(_spotifyService, 'getArtistAlbums').and.returnValue(observableOf([ALBUM_MOCK]));
    spySpofityGetArtistRelated = spyOn(_spotifyService, 'getArtistRelated').and.returnValue(observableOf([ARTIST_MOCK]));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('ngOnInit()', () => {
    it('should get artist', () => {
      component.ngOnInit();

      jasmine.clock().tick(5000);
      expect(spySpofityGetArtist).toHaveBeenCalledWith('artist123');
    });

    it('should get artist albums', () => {
      component.ngOnInit();

      jasmine.clock().tick(5000);
      expect(spySpofityGetArtistAlbums).toHaveBeenCalledWith('artist123');
    });

    it('should get artist related', () => {
      component.ngOnInit();

      jasmine.clock().tick(5000);
      expect(spySpofityGetArtistRelated).toHaveBeenCalledWith('artist123');
    });
  });
});
