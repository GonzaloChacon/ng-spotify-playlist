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
});
