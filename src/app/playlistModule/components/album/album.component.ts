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
import { toggleTrackOpt, playlistIncludes, setDisplay } from '@app/playlistModule/components/utils';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html'
})
export class AlbumComponent implements OnInit, OnDestroy {
  private _destroy: Subject<boolean> = new Subject<boolean>();

  playlistEvent: Event;
  playlists: IPlaylist[] = [];
  album: IAlbum;
  options: number = null;

  toggleTrackOpt = toggleTrackOpt.bind(this);
  playlistIncludes = playlistIncludes;

  constructor(
    private _spotifyService: SpotifyService,
    private _storeService: StoreService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.playlistEvent = this._storeService.getEvent('updatePlaylist');

    this._storeService.listenTo('store', 'spotify')
      .pipe(takeUntil(this._destroy))
      .subscribe(({ playlists }: { playlists: IPlaylist[] }) => {
        this.playlists = playlists.filter(playlist => playlist.public);
      });

    this._activatedRoute.params
      .pipe(takeUntil(this._destroy))
      .subscribe(params => {
        this._spotifyService.getAlbum(params['albumId'])
          .subscribe((album: IAlbum) => {
            album.tracks.items.forEach(setDisplay);
            this.album = album;
          });
      });
  }

  updatePlaylist(action: string, playlistId: string, track: ITrack) {
    track.album = {
      id: this.album.id,
      name: this.album.name,
      artists: this.album.artists
    };

    this.playlistEvent.emit({
      action,
      tracks: [track],
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
