/**
 * Gonzalo Chacón
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { StoreService, Store, Event } from '@app/core/services';
import { SpotifyService } from '@app/playlistModule/services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ITrack, IPlaylist, IOwner } from '@app/playlistModule/interfaces';
import { objMergeDeep } from '@app/core/utils/utils';
import { Router } from '@angular/router';

export interface IPlaylistEvent {
  action: string
  tracks: ITrack[]
  playlist: any
}

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html'
})
export class PlaylistComponent implements OnInit, OnDestroy {
  private _destroy: Subject<boolean> = new Subject<boolean>();

  newPlaylist = false;

  spotifyStore: Store;
  playlistEvent: Event;
  user: IOwner;
  // used to store reference to open playlsit, instead of search for it everywhere
  currentPlaylist: IPlaylist;
  playlists: IPlaylist[] = [];

  searchForm: FormGroup = new FormGroup({
    search: new FormControl(null)
  });

  playlistForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    public: new FormControl(false)
  });

  constructor(
    private _spotifyService: SpotifyService,
    private _storeService: StoreService,
    private _router: Router
  ) {
    /*
     * Components loaded through the router-outlet can't bind values
     * through @Input, that's why I've included a event interface in the
     * Store service in order to subscribe in another components and
     * receive or send info. This also alow to comunicate directly between
     * component nested several levels away.
     */
    this.playlistEvent = this._storeService.createEvent('updatePlaylist');
  }

  ngOnInit() {
    this.spotifyStore = this._storeService.getStore('spotify');

    this.spotifyStore.emitter
      .pipe(takeUntil(this._destroy))
      .subscribe(state => {
        this.playlists = state.playlists;
      });

    this._spotifyService.getUser()
      .subscribe(user => {
        this.user = user;
        this.getPalylists();
      });

    this.searchForm.valueChanges
      .pipe(takeUntil(this._destroy))
      .pipe(debounceTime(500))
      .subscribe(searchValues => {
        this._router.navigate([`playlist/search/${searchValues.search}`]);
      });

    this.playlistEvent.emitter.subscribe(playload => {
      this.updatePlaylist(playload);
    });

    this._storeService.emitEvent('loading', false);
  }

  getPalylists() {
    this._spotifyService.getAllPlaylists(this.user.id)
      .subscribe(playlists => {

        playlists.forEach((playlist: IPlaylist, i: number) => {
          this.getPlaylistTracks(playlist);
          this.slideInPlaylist(playlist, i);
        });

        this.spotifyStore.update({ playlists });
      });
  }

  getPlaylistTracks(playlist: IPlaylist) {
    playlist.tracks.items = [];

    this._spotifyService.getPlaylistTracks(this.user.id, playlist.id)
      .subscribe((tracks: ITrack[]) => {
        playlist.tracks.items = tracks;
      });
  }

  setDisplays(playlist: IPlaylist) {
    if (playlist.tracks.items.length) {
      playlist.tracks.items.forEach(track => track.display = false);
    }

    this.currentPlaylist = playlist;
  }

  slideInPlaylist(playlist: IPlaylist, i: number) {
    playlist.display = false;

    setTimeout(() => {
      playlist.display = true;
    }, (i * 250));
  }

  updatePlaylist({ action, playlist, tracks }: IPlaylistEvent) {
    let playlistToUpdate: IPlaylist;
    let playlistIndex: number;
    const playlists = this.playlists.map(item => objMergeDeep({}, item));

    if (playlist.id) {
      playlistIndex = this.playlists.findIndex(item => item.id === playlist.id);
      playlistToUpdate = playlists[playlistIndex];
    }

    switch (action) {

      case 'DELETE_TRACK': {
        const body = {
          tracks: [{ uri: tracks[0].uri }]
        };

        this._spotifyService.deletePlaylistTrack(body, playlist.id)
          .subscribe(() => {
            const index = playlistToUpdate.tracks.items.findIndex(item => item.id === tracks[0].id);
            /*
             * We set this value in order to make the animaiton of the track leaving,
             * after it's gone we remove the track from the list.
             */
            tracks[0].remove = true;
            setTimeout(() => {
              playlistToUpdate.tracks.items.splice(index, 1);

              this.spotifyStore.update({ playlists });
            }, 500);
          });

        break;
      }

      case 'ADD_TRACK': {
        if (playlistToUpdate.tracks.items && playlistToUpdate.tracks.items.findIndex(item => item.id === tracks[0].id) === -1) {
          this._spotifyService.addPlaylistTrack(tracks[0].uri, playlist.id)
            .subscribe(() => {
              tracks[0].display = false;
              tracks[0].remove = false;

              playlistToUpdate.tracks.items.push(tracks[0]);
              this.spotifyStore.update({ playlists });
            });
        }

        break;
      }

      case 'CREATE_PLAYLIST': {
        this._spotifyService.createPlaylist(this.user.id, playlist)
          .subscribe((newPlaylist: IPlaylist) => {
            playlists.push(newPlaylist);

            this.spotifyStore.update({ playlists });
          });

        break;
      }

      case 'REMOVE_PLAYLIST': {
        this._spotifyService.unfollowPlaylist(playlist.id)
          .subscribe(() => {
            /*
             * We set this value in order to make the animaiton of the track leaving,
             * after it's gone we remove the track from the list.
             */
            this.playlists[playlistIndex].remove = true;
            setTimeout(() => {
              playlists.splice(playlistIndex, 1);
              this.spotifyStore.update({ playlists });
            }, 500);
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.playlistEvent.destroy();

    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
