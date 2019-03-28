/**
 * Gonzalo Chacón
 */

import { PlaylistTracksComponent } from './playlistTracks.component';
import { StoreService, Event } from '@app/core/services';

describe('PlaylistTracksComponent Unit Tests:', () => {
  let component: PlaylistTracksComponent;
  let _storeService: StoreService;

  beforeEach(() => {
    _storeService = new StoreService();
    _storeService.createEvent('updatePlaylist');

    component = new PlaylistTracksComponent(_storeService);
  });

  describe('ngOnInit()', () => {
    it('should get updatePlaylist event from store', () => {
      expect(component.playlistEvent).not.toBeDefined();
      component.ngOnInit();

      expect(component.playlistEvent).toBeDefined();
    });
  });

  describe('deleteTrack()', () => {
    let updatePlaylistEvent: Event;
    let spyEventEmitter;

    beforeEach(() => {
      updatePlaylistEvent = _storeService.getEvent('updatePlaylist');
      spyEventEmitter = spyOn(updatePlaylistEvent, 'emit').and.returnValue(true);

      component.playlistEvent = updatePlaylistEvent;
    });

    it('should emit event to update playlist', () => {
      component.playlistId = 'playlist123';
      component.deleteTrack({ name: 'track1' } as any);

      const res = {
        action: 'DELETE_TRACK',
        tracks: [{ name: 'track1' }],
        playlist: { id: 'playlist123' }
      };

      expect(spyEventEmitter).toHaveBeenCalledWith(res);
    });
  });

  describe('set newLenght()', () => {
    beforeEach(() => {
      jasmine.clock().install();
      component.tracks = [
        {
          id: 'track1',
          display: false
        },
        {
          id: 'track1',
          display: false
        }
      ] as any;
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should call set track.display TRUE if tracks length', () => {
      component.newLenght = 2;

      jasmine.clock().tick(5000);
      expect(component.tracks[0].display).toBe(true);
      expect(component.tracks[1].display).toBe(true);
    });
  });

  describe('set playlistTracks()', () => {
    beforeEach(() => {
      jasmine.clock().install();
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should call store tracks in component', () => {
      expect(component.tracks).toBe(undefined);
      component.playlistTracks = [
        {
          id: 'track1',
          display: false
        },
        {
          id: 'track1',
          display: false
        }
      ] as any;

      jasmine.clock().tick(5000);
      expect(component.tracks.length).toBe(2);
    });

    it('should call set track.display TRUE', () => {
      expect(component.tracks).toBe(undefined);
      component.playlistTracks = [
        {
          id: 'track1',
          display: false
        },
        {
          id: 'track1',
          display: false
        }
      ] as any;

      jasmine.clock().tick(5000);
      expect(component.tracks[0].display).toBe(true);
      expect(component.tracks[1].display).toBe(true);
    });
  });
});
