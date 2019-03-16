/**
 * Gonzalo Chacón
 */

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { SpotifyService } from '@app/playlistModule/services';
import { IAlbum, ITrack } from '@app/playlistModule/interfaces';
import { IPlaylistEvent } from '../playlist/playlist.component';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html'
})
export class AlbumsComponent implements OnInit, OnDestroy {
  private _destroy: Subject<boolean> = new Subject<boolean>();

  @Output('albumsUpdate') playlistUpdate: EventEmitter<IPlaylistEvent> = new EventEmitter<IPlaylistEvent>();
  @Input('albumsSearch') set search(album: string) {
    if (album) {
      this.searchOnSpotify(album);
    } else {
      this.albums = [];
    }
  }

  albums: IAlbum[];

  constructor(
    private _spotifyService: SpotifyService
  ) {}

  ngOnInit() {}

  searchOnSpotify(value: string) {
    this._spotifyService.search(value, 'album')
      .subscribe((resp: any) => this.albums = resp.albums.items);
  }

  addTrack(track: ITrack) {
    this.playlistUpdate.emit({
      action: 'ADD_TRACK',
      track
    });
  }

  ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
