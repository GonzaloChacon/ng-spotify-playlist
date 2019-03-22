/**
 * Gonzalo Chacón
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpotifyService } from '@app/playlistModule/services';
import { IAlbum, ITrack, IPlaylist } from '@app/playlistModule/interfaces';
import { StoreService, Event } from '@app/core/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html'
})
export class AlbumComponent implements OnInit, OnDestroy {
  private _destroy: Subject<boolean> = new Subject<boolean>();

  playlistEvent: Event;
  playlists: IPlaylist[] = [];
  album: IAlbum;

  constructor(
    private _spotifyService: SpotifyService,
    private _storeService: StoreService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.playlistEvent = this._storeService.getEvent('updatePlaylist');

    this._storeService.getStore('spotify').emitter
      .pipe(takeUntil(this._destroy))
      .subscribe(({ playlists }: { playlists: IPlaylist[] }) => {
        this.playlists = playlists.filter(playlist => playlist.public);
      });

    this._activatedRoute.params
      .pipe(takeUntil(this._destroy))
      .subscribe(params => {
        this._spotifyService.getAlbum(params['albumId'])
          .subscribe((resp: IAlbum) => {
            this.album = resp;
          });
      });
  }

  addToPlaylist(playlistId: string, track: ITrack) {
    track.album = {
      id: this.album.id,
      name: this.album.name,
      artists: this.album.artists
    };

    this.playlistEvent.emit({
      action: 'ADD_TRACK',
      track,
      playlist: {
        id: playlistId
      }
    });
  }

  ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
