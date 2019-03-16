/**
 * Gonzalo Chacón
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { StoreService, Store } from '@app/core/services';
// import { SpotifyService } from '@app/playlistModule/services';
import { FormGroup, FormControl } from '@angular/forms';
import { ITrack } from '@app/playlistModule/interfaces';

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
  playlist: {};
  search = '';

  searchForm: FormGroup = new FormGroup({
    search: new FormControl(null)
  });

  constructor(
    // private _spotifyService: SpotifyService,
    private _storeService: StoreService
  ) {}

  ngOnInit() {
    this.playlistStore = this._storeService.getStore('playlist');

    this.playlistStore.emitter
      .pipe(takeUntil(this._destroy))
      .subscribe(state => {
        this.playlist = state;
      });

    this.searchForm.valueChanges
      .pipe(takeUntil(this._destroy))
      .pipe(debounceTime(500))
      .subscribe(val => {
        this.search = val.search;
      });

    this._storeService.emitEvent('loading', false);
  }

  updatePlaylist({ action, track }: IPlaylistEvent) {
    switch (action) {
      case 'DELETE_TRACK': {
        delete this.playlist[track.id];
        break;
      }
      case 'ADD_TRACK': {
        if (!this.playlist[track.id]) {
          this.playlist[track.id] = track;
        }
        break;
      }
    }

    this.playlistStore.update(this.playlist);
  }

  ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
