/**
 * Gonzalo Chacón
 */

import { of as observableOf } from 'rxjs';
import { SpotifyService } from '@app/playlistModule/services';
import { StoreService, Event } from '@app/core/services';
import { ActivatedRoute } from '@angular/router';
import { AlbumComponent } from './album.component';
import { ALBUM_MOCK, PLAYLISTS_MOCK, ARTIST_MOCK } from '@app/core/utils/testMocks';

class MockActivatedRoute extends ActivatedRoute {
  public params = observableOf({ albumId: 'album123' });
}
describe('AlbumComponent Unit Tests:', () => {
  let component: AlbumComponent;
  let _spotifyService: SpotifyService;
  let _storeService: StoreService;
  let _activatedRoute: MockActivatedRoute;

  let spySpofityGetAlbum;

  beforeEach(() => {
    _spotifyService = new SpotifyService(null);
    _storeService = new StoreService();
    _activatedRoute = new MockActivatedRoute();

    jasmine.clock().install();
    _storeService.createStore('spotify', { playlists: PLAYLISTS_MOCK });
    _storeService.createEvent('updatePlaylist');

    component = new AlbumComponent(_spotifyService, _storeService, _activatedRoute);

    spySpofityGetAlbum = spyOn(_spotifyService, 'getAlbum').and.returnValue(observableOf(ALBUM_MOCK));
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('ngOnInit()', () => {
    it('should get updatePlaylist event from store', () => {
      expect(component.playlistEvent).not.toBeDefined();
      component.ngOnInit();

      expect(component.playlistEvent).toBeDefined();
    });

    it('should subscribe to Spotify Store and get existing playlists', () => {
      expect(component.playlists.length).toBe(0);
      component.ngOnInit();

      expect(component.playlists.length).toBe(1);
    });

    it('should get album', () => {
      component.ngOnInit();

      jasmine.clock().tick(5000);
      expect(spySpofityGetAlbum).toHaveBeenCalledWith('album123');
    });
  });

  describe('updatePlaylist()', () => {
    let updatePlaylistEvent: Event;
    let spyEventEmitter;

    beforeEach(() => {
      updatePlaylistEvent = _storeService.getEvent('updatePlaylist');
      spyEventEmitter = spyOn(updatePlaylistEvent, 'emit').and.returnValue(true);

      component.playlistEvent = updatePlaylistEvent;
      component.album = ALBUM_MOCK as any;
    });

    it('should emit event to update playlist', () => {
      component.updatePlaylist('ADD_TRACK', 'playlist123', {} as any);

      const res = {
        action: 'ADD_TRACK',
        tracks: [{
          album: {
            id: '0kaYtACg9wLVZZyrqSEHyU',
            name: 'Super awesome album',
            artists: [
              ARTIST_MOCK
            ]
          }
        }],
        playlist: { id: 'playlist123' }
      };

      expect(spyEventEmitter).toHaveBeenCalledWith(res);
    });
  });
});
