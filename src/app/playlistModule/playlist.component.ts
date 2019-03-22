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
import { objCloneDeep } from '@app/core/utils/utils';

export interface IPlaylistEvent {
  action: string
  track: ITrack
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
  searchEvent: Event;
  playlistEvent: Event;
  user: IOwner;
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
    private _storeService: StoreService
  ) {}

  ngOnInit() {
    this.spotifyStore = this._storeService.getStore('spotify');

    this.spotifyStore.emitter
      .pipe(takeUntil(this._destroy))
      .subscribe(state => {
        this.playlists = state.playlists;
      });

    /*
     * Components loaded through the router-outlet can't bind values
     * through @Input, that's why I've included a event interface in the
     * Store service in order to subscribe in another components and
     * receive or send info. This also alow to comunicate directly between
     * component nested several levels away.
     */
    this.searchEvent = this._storeService.createEvent('search');
    this.playlistEvent = this._storeService.createEvent('updatePlaylist');

    this._spotifyService.getUser()
      .subscribe(user => {
        this.user = user;
        this.getPalylists();
      });

    this.searchForm.valueChanges
      .pipe(takeUntil(this._destroy))
      .pipe(debounceTime(500))
      .subscribe(searchValues => {
        this.searchEvent.emit(searchValues);
      });

    this.playlistEvent.emitter.subscribe(playload => {
      this.updatePlaylist(playload);
    });

    this._storeService.emitEvent('loading', false);
  }

  getPalylists() {
    this._spotifyService.getAllPlaylists(this.user.id)
      .subscribe(playlists => {
        this.playlists = playlists;
        this.playlists.forEach(this.displayPlaylist);

        this.spotifyStore.update({ playlists: this.playlists });
      });
  }

  displayPlaylist(playlist: IPlaylist, i: number) {
    playlist.dislpay = false;
    setTimeout(() => {
      playlist.dislpay = true;
    }, (i * 250));
  }

  updatePlaylist({ action, playlist, track }: IPlaylistEvent) {
    let currentPlaylist: IPlaylist;
    let playlistIndex: number;
    const playlists = this.playlists.map(item => objCloneDeep({}, item));

    if (playlist.id) {
      playlistIndex = this.playlists.findIndex(item => item.id === playlist.id);
      currentPlaylist = playlists[playlistIndex];
    }

    switch (action) {

      case 'DELETE_TRACK': {
        const body = {
          tracks: [{ uri: track.uri }]
        };

        this._spotifyService.deletePlaylistTrack(body, playlist.id)
          .subscribe(() => {
            const index = currentPlaylist.tracks.items.findIndex(item => item.id === track.id);
            /*
             * We set this value in order to make the animaiton of the track leaving,
             * after it's gone we remove the track from the list.
             */
            track.remove = true;
            setTimeout(() => {
              currentPlaylist.tracks.items.splice(index, 1);

              this.spotifyStore.update({ playlists });
            }, 500);
          });

        break;
      }

      case 'ADD_TRACK': {
        this._spotifyService.addPlaylistTrack(track.uri, playlist.id)
          .subscribe(() => {
            if (currentPlaylist.tracks.items && currentPlaylist.tracks.items.findIndex(item => item.id === track.id) === -1) {
              currentPlaylist.tracks.items.push(track);
            }

            this.spotifyStore.update({ playlists });
          });

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
    this.searchEvent.destroy();
    this.playlistEvent.destroy();

    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
