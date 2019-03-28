/**
 * Gonzalo Chacón
 */

import { of as observableOf } from 'rxjs';
import { SpotifyService } from '@app/playlistModule/services';
import { ActivatedRoute } from '@angular/router';
import { ARTIST_MOCK, PLAYLISTS_MOCK } from '@app/core/utils/testMocks';
import { SearchResultsComponent } from './searchResults.component';
import { StoreService } from '@app/core/services';

class MockActivatedRoute extends ActivatedRoute {
  public params = observableOf({ search: 'someText' });
}
describe('SearchResultsComponent Unit Tests:', () => {
  let component: SearchResultsComponent;
  let _spotifyService: SpotifyService;
  let _storeService: StoreService;
  let _activatedRoute: MockActivatedRoute;

  beforeEach(() => {
    _spotifyService = new SpotifyService(null);
    _storeService = new StoreService();
    _activatedRoute = new MockActivatedRoute();

    component = new SearchResultsComponent(_spotifyService, _storeService, _activatedRoute);

    _storeService.createStore('spotify', { playlists: PLAYLISTS_MOCK });
    _storeService.createEvent('updatePlaylist');
  });

  describe('ngOnInit()', () => {
    let spySearchSpotify;

    beforeEach(() => {
      jasmine.clock().install();
      spySearchSpotify = spyOn(component, 'searchOnSpotify').and.returnValue(true);
    });

    afterEach(() => {
      jasmine.clock().uninstall();
    });

    it('should subscribe to router params and call method to search for results', () => {
      component.ngOnInit();

      jasmine.clock().tick(5000);
      expect(spySearchSpotify).toHaveBeenCalledWith('someText');
    });

    it('should subscribe to spotify store and set playlists', () => {
      expect(component.playlists.length).toBe(0);
      component.ngOnInit();

      jasmine.clock().tick(5000);
      expect(component.playlists.length).toBe(1);
    });
  });

  describe('searchOnSpotify()', () => {
    let spyApi;

    beforeEach(() => {
      spyApi = spyOn(_spotifyService, 'search').and.returnValue(observableOf({ artists: { items: [] }, tracks: { items: [] }, albums: { items: [] } }));
    });

    it('should call to search for artist', () => {
      component.searchOnSpotify('someText');

      const call = spyApi.calls.allArgs()[0];

      expect(call[0]).toBe('someText');
      expect(call[1]).toBe('artist');
    });

    it('should call to search for albums', () => {
      component.searchOnSpotify('someText');

      const call = spyApi.calls.allArgs()[1];

      expect(call[0]).toBe('someText');
      expect(call[1]).toBe('album');
    });

    it('should call to search for track', () => {
      component.searchOnSpotify('someText');

      const call = spyApi.calls.allArgs()[2];

      expect(call[0]).toBe('someText');
      expect(call[1]).toBe('track');
    });

    it('should clean objects if search params not specified', () => {
      component.albums = [{}, {}, {}] as any;
      component.artists = [{}, {}, {}] as any;
      component.tracks = [{}, {}, {}] as any;

      component.searchOnSpotify(null);

      expect(component.albums.length).toBe(0);
      expect(component.artists.length).toBe(0);
      expect(component.tracks.length).toBe(0);
    });
  });

  describe('updatePlaylist()', () => {
    let updatePlaylistEvent;
    let spyEventEmitter;
    let track;

    beforeEach(() => {
      track = {
        album: {
          id: '0kaYtACg9wLVZZyrqSEHyU',
          name: 'Super awesome album',
          artists: [
            ARTIST_MOCK
          ]
        }
      };

      updatePlaylistEvent = _storeService.getEvent('updatePlaylist');
      spyEventEmitter = spyOn(updatePlaylistEvent, 'emit').and.returnValue(true);

      component.playlistEvent = updatePlaylistEvent;
    });

    it('should emit event to update playlist', () => {
      component.updatePlaylist('ADD_TRACK', 'playlist123', track);

      const res = {
        action: 'ADD_TRACK',
        tracks: [track],
        playlist: { id: 'playlist123' }
      };

      expect(spyEventEmitter).toHaveBeenCalledWith(res);
    });
  });
});
