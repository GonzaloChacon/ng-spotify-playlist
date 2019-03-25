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

    _storeService.createStore('spotify', { playlists: PLAYLISTS_MOCK });
    _storeService.createEvent('updatePlaylist');

    component = new AlbumComponent(_spotifyService, _storeService, _activatedRoute);

    spySpofityGetAlbum = spyOn(_spotifyService, 'getAlbum').and.returnValue(observableOf(ALBUM_MOCK));
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

    it('should get album', done => {
      setTimeout(() => {
        component.ngOnInit();

        expect(spySpofityGetAlbum).toHaveBeenCalledWith('album123');
        done();
      }, 0);
    });
  });

  describe('playlistIncludes()', () => {
    let playlist;

    beforeEach(() => {
      playlist = {
        tracks: {
          items: [
            {
              id: '123'
            },
            {
              id: '456'
            },
            {
              id: '789'
            }
          ]
        }
      };
    });

    it('should return TRUE if playlist include track', () => {
      expect(component.playlistIncludes(playlist, { id: '123' } as any)).toBe(true);
    });

    it('should return FALSE if playlist does NOT include track', () => {
      expect(component.playlistIncludes(playlist, { id: '555' } as any)).toBe(false);
    });
  });

  describe('toggleTrackOpt()', () => {
    const e = {
      stopPropagation() { return; }
    };

    it('should store track index in options', () => {
      component.toggleTrackOpt(e, 1);

      expect(component.options).toBe(1);
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

  describe('displayTrack()', () => {
    it('should set track.display TRUE', () => {
      const track = {
        display: false
      };
      jasmine.clock().install();

      component.displayTrack(track as any, 0);
      jasmine.clock().tick(1000);

      expect(track.display).toBe(true);
      jasmine.clock().uninstall();
    });
  });
});
