/**
 * Gonzalo Chacón
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { StoreService, Store, Event } from '@app/core/services';
import { SpotifyService } from '@app/playlistModule/services';
import { FormGroup, FormControl } from '@angular/forms';
import { ITrack, IPlaylist, IOwner } from '@app/playlistModule/interfaces';

export interface IPlaylistEvent {
  action: string,
  track: ITrack
}

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html'
})
export class PlaylistComponent implements OnInit, OnDestroy {
  private _destroy: Subject<boolean> = new Subject<boolean>();

  playlistStore: Store;
  searchEvent: Event;
  playlistEvent: Event;
  user: IOwner;
  playlistId: string;

  playlists: IPlaylist[] = [];

  searchForm: FormGroup = new FormGroup({
    search: new FormControl(null),
    artists: new FormControl(true),
    albums: new FormControl(true),
    tracks: new FormControl(true)
  });

  constructor(
    private _spotifyService: SpotifyService,
    private _storeService: StoreService
  ) {}

  ngOnInit() {
    this.playlistStore = this._storeService.getStore('playlist');

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

    this.playlistStore.emitter
      .pipe(takeUntil(this._destroy))
      .subscribe(state => {
        this.playlists = state;
      });

    this.searchForm.valueChanges
      .pipe(takeUntil(this._destroy))
      .pipe(debounceTime(500))
      .subscribe(searchValues => {
        this.searchEvent.emit(searchValues);
      });

    this._storeService.emitEvent('loading', false);
  }

  getPalylists() {
    this._spotifyService.getAllPlaylists(this.user.id)
      .subscribe(playlists => {
        this.playlists = playlists;
        this.playlists.forEach(this.displayPlaylist);
      });
  }

  displayPlaylist(playlist: IPlaylist, i: number) {
    playlist.dislpay = false;
    setTimeout(() => {
      playlist.dislpay = true;
    }, (i * 250));
  }

  updatePlaylist({ action, track }: IPlaylistEvent) {
    switch (action) {
      case 'DELETE_TRACK': {
        delete this.playlists[track.id];
        break;
      }

      case 'ADD_TRACK': {
        if (!this.playlists[track.id]) {
          this.playlists[track.id] = track;
        }
        break;
      }
    }

    this.playlistStore.update(this.playlists);
  }

  ngOnDestroy(): void {
    this.searchEvent.destroy();
    this.playlistEvent.destroy();

    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
