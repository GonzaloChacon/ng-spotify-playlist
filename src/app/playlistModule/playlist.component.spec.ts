/**
 * Gonzalo Chacón
 */

import { of as observableOf } from 'rxjs';
import { StoreService } from '@app/core/services';
import { SpotifyService } from './services';
import { PlaylistComponent } from './playlist.component';
import { USER_MOCK, PLAYLISTS_MOCK, TRACKS_MOCK } from '@app/core/utils/testMocks';

class MockRouter {
  navigate = jasmine.createSpy().and.returnValue(true);
}

describe('PlaylistTracksComponent Unit Tests:', () => {
  let component: PlaylistComponent;
  let _spotifyService: SpotifyService;
  let _storeService: StoreService;
  let _router: MockRouter;

  let spyGetUser;
  let spyGetAllPlaylists;
  let spyGetPlaylistTracks;

  beforeEach(() => {
    _spotifyService = new SpotifyService(null);
    _router = new MockRouter();
    _storeService = new StoreService();
    _storeService.createStore('spotify', { playlists: [] });
    _storeService.createEvent('loading');

    spyGetUser = spyOn(_spotifyService, 'getUser').and.returnValue(observableOf(USER_MOCK));
    spyGetAllPlaylists = spyOn(_spotifyService, 'getAllPlaylists').and.returnValue(observableOf([PLAYLISTS_MOCK]));
    spyGetPlaylistTracks = spyOn(_spotifyService, 'getPlaylistTracks').and.returnValue(observableOf(TRACKS_MOCK));

    component = new PlaylistComponent(_spotifyService, _storeService, (_router as any));
  });

  describe('component creation()', () => {
    it('should create event updatePlaylist', () => {
      expect(component.playlistEvent).toBeDefined();
    });
  });

  describe('ngOnInit()', () => {
    let spyGetPlaylists;
    let spyUpdatePlaylist;

    beforeEach(() => {
      spyGetPlaylists = spyOn(component, 'getPalylists').and.returnValue(true);
      spyUpdatePlaylist = spyOn(component, 'updatePlaylist').and.returnValue(true);
    });

    it('should subscribe to spotifyStore', () => {
      expect(component.spotifyStore).not.toBeDefined();
      component.ngOnInit();

      expect(component.spotifyStore).toBeDefined();
    });

    it('should subscribe to spotify store', done => {
      component.ngOnInit();

      component.spotifyStore.update({ playlists: PLAYLISTS_MOCK });

      setTimeout(() => {
        expect(component.playlists.length).toBe(1);
        done();
      }, 0);
    });

    it('should get user info', () => {
      component.ngOnInit();

      expect(spyGetUser).toHaveBeenCalled();
    });

    it('should call getPalylists() after getting user info', () => {
      component.ngOnInit();

      expect(spyGetPlaylists).toHaveBeenCalled();
    });

    it('should subscribe to updatePlaylist and call updatePlaylist', () => {
      jasmine.clock().install();
      component.ngOnInit();

      const update = { action: 'ADD_TRACK' };

      _storeService.getEvent('updatePlaylist').emit(update);
      jasmine.clock().tick(100);

      expect(spyUpdatePlaylist).toHaveBeenCalledWith(update);
      jasmine.clock().uninstall();
    });

    it('should emit event loading', () => {
      const spyEvent = spyOn(_storeService, 'emitEvent').and.returnValue(true);
      component.ngOnInit();

      expect(spyEvent).toHaveBeenCalledWith('loading', false);
    });
  });

  describe('getPalylists()', () => {
    let spySlideInPlaylist;
    const update = jasmine.createSpy();
    let spyGetPlaylistTracksC;

    beforeEach(() => {
      spySlideInPlaylist = spyOn(component, 'slideInPlaylist').and.returnValue(true);
      spyGetPlaylistTracksC = spyOn(component, 'getPlaylistTracks').and.returnValue(true);

      component.spotifyStore = {
        update
      } as any;
      component.user = USER_MOCK as any;
      component.playlists = [];
      component.getPalylists();
    });

    it('should get user playlists', () => {
      expect(spyGetAllPlaylists).toHaveBeenCalledWith(USER_MOCK.id);
    });

    it('should call getPlaylistTracks()', () => {
      expect(spyGetPlaylistTracksC).toHaveBeenCalled();
    });

    it('should call slideInPlaylist()', () => {
      expect(spySlideInPlaylist).toHaveBeenCalled();
    });

    it('should update spotify store', () => {
      expect(update).toHaveBeenCalled();
    });
  });

  describe('getPlaylistTracks()', () => {
    const playlist = {
      id: 'playlist123',
      tracks: {
        items: undefined
      }
    };

    beforeEach(() => {
      component.user = USER_MOCK as any;
      component.getPlaylistTracks(playlist as any);
    });

    it('should get user playlists tracks', () => {
      expect(spyGetPlaylistTracks).toHaveBeenCalledWith(USER_MOCK.id, playlist.id);
    });

    it('should store tracks in playlist', () => {
      expect(playlist.tracks.items.length).toBe(2);
    });
  });

  describe('slideInPlaylist()', () => {
    it('should set playlist.display TRUE', done => {
      const playlist = {
        display: false
      };

      component.slideInPlaylist(playlist as any, 0);

      setTimeout(() => {
        expect(playlist.display).toBe(true);
        done();
      }, 0);
    });
  });

  describe('setDisplays()', () => {
    const playlist = {
      tracks: {
        items: [
          {
            display: true
          },
          {
            display: true
          }
        ]
      }
    };

    it('should set tracks.display to false', () => {
      component.setDisplays(playlist as any);

      expect(playlist.tracks.items[0].display).toBe(false);
      expect(playlist.tracks.items[1].display).toBe(false);
    });

    it('should store playlist reference in currentPlaylist', () => {
      component.setDisplays(playlist as any);

      expect(component.currentPlaylist).toBe(playlist as any);
    });
  });

  describe('updatePlaylist()', () => {
    let spyApi;
    let track;
    let tracks;
    let spyStore;

    beforeEach(() => {
      component.spotifyStore = _storeService.getStore('spotify');
      spyStore = spyOn(component.spotifyStore, 'update').and.returnValue(true);

      track = {
        id: 'trackID3',
        uri: 'spotify:track:trackID3'
      };

      tracks = [{
        id: 'trackID1',
        uri: 'spotify:track:trackID1'
      }, {
        id: 'trackID2',
        uri: 'spotify:track:trackID2'
      }];

      component.playlists = [{
        id: 'somePlaylistID',
        tracks: {
          items: tracks
        }
      }] as any;
    });

    describe('ADD_TRACK', () => {
      let event;

      beforeEach(() => {
        event = {
          action: 'ADD_TRACK',
          playlist: component.playlists[0],
          tracks: [track]
        };
        spyApi = spyOn(_spotifyService, 'addPlaylistTrack').and.returnValue(observableOf(true));
      });

      it('should call endpoint to add track to playlist', () => {
        component.updatePlaylist(event);

        expect(spyApi).toHaveBeenCalledWith('spotify:track:trackID3', 'somePlaylistID');
      });

      it('if success should add track and update store', () => {
        jasmine.clock().install();
        expect(component.playlists[0].tracks.items.length).toBe(2);
        component.updatePlaylist(event);

        jasmine.clock().tick(5000);
        const newState = spyStore.calls.allArgs()[0][0];

        expect(newState.playlists[0].tracks.items.length).toBe(3);
        jasmine.clock().uninstall();
      });
    });

    describe('DELETE_TRACK', () => {
      let event;

      beforeEach(() => {
        event = {
          action: 'DELETE_TRACK',
          playlist: component.playlists[0],
          tracks: [tracks[0]]
        };
        spyApi = spyOn(_spotifyService, 'deletePlaylistTrack').and.returnValue(observableOf(true));
      });

      it('should call endpoint to delete track from playlist', () => {
        component.updatePlaylist(event);

        expect(spyApi).toHaveBeenCalledWith({ tracks: [{ uri: 'spotify:track:trackID1' }] }, 'somePlaylistID');
      });

      it('if success should remove track from playlist and update store', () => {
        jasmine.clock().install();
        expect(component.playlists[0].tracks.items.length).toBe(2);
        component.updatePlaylist(event);

        jasmine.clock().tick(5000);
        const newState = spyStore.calls.allArgs()[0][0];

        expect(newState.playlists[0].tracks.items.length).toBe(1);
        jasmine.clock().uninstall();
      });
    });

    describe('CREATE_PLAYLIST', () => {
      let event;
      let newPlaylist;

      beforeEach(() => {
        newPlaylist = {
          name: 'New playlist'
        };

        component.user = {
          id: 'someUserId'
        } as any;

        event = {
          action: 'CREATE_PLAYLIST',
          playlist: newPlaylist,
          tracks: [tracks[0]]
        };
        spyApi = spyOn(_spotifyService, 'createPlaylist').and.returnValue(observableOf({ ...newPlaylist, id: 'someNewId' }));
      });

      it('should call endpoint to create playlist', () => {
        component.updatePlaylist(event);

        expect(spyApi).toHaveBeenCalledWith('someUserId', newPlaylist);
      });

      it('if success should create playlist and update store', () => {
        jasmine.clock().install();
        expect(component.playlists.length).toBe(1);
        component.updatePlaylist(event);

        jasmine.clock().tick(5000);
        const newState = spyStore.calls.allArgs()[0][0];

        expect(newState.playlists.length).toBe(2);
        jasmine.clock().uninstall();
      });
    });

    describe('REMOVE_PLAYLIST', () => {
      let event;
      let deletePlaylist;

      beforeEach(() => {
        deletePlaylist = {
          name: 'New playlist',
          id: 'newPlaylistID'
        };

        component.playlists.push(deletePlaylist);

        event = {
          action: 'REMOVE_PLAYLIST',
          playlist: deletePlaylist
        };
        spyApi = spyOn(_spotifyService, 'unfollowPlaylist').and.returnValue(observableOf(true));
      });

      it('should call endpoint to unfollow playlist', () => {
        component.updatePlaylist(event);

        expect(spyApi).toHaveBeenCalledWith(deletePlaylist.id);
      });

      it('if success should unfollow playlist and update store', () => {
        jasmine.clock().install();
        expect(component.playlists.length).toBe(2);

        component.updatePlaylist(event);

        jasmine.clock().tick(5000);
        const newState = spyStore.calls.allArgs()[0][0];

        expect(newState.playlists.length).toBe(1);
        jasmine.clock().uninstall();
      });
    });
  });
});
