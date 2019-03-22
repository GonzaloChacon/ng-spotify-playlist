/**
 * Gonzalo Chacón
 */

import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from '@app/playlistModule/services';
import { ITrack, IOwner, IPlaylist } from '@app/playlistModule/interfaces';
import { StoreService, Event } from '@app/core/services';

@Component({
  selector: 'app-playlist-tracks',
  templateUrl: './playlistTracks.component.html'
})
export class PlaylistTracksComponent implements OnInit {

  @Input('user') user: IOwner;
  @Input('playlist') set currentPlaylist(playlist: IPlaylist) {
    if (playlist) {
      this.playlist = playlist;
      this.getTracks();
    }
  }

  playlistEvent: Event;
  playlist: IPlaylist;
  tracks: ITrack[];

  constructor(
    private _spotifyService: SpotifyService,
    private _storeService: StoreService
  ) {}

  ngOnInit() {
    this.playlistEvent = this._storeService.getEvent('updatePlaylist');
  }

  getTracks() {
    this._spotifyService.getPlaylistTracks(this.user.id, this.playlist.id)
      .subscribe((tracks: ITrack[]) => {
        this.playlist.tracks.items = this.tracks = tracks;
        this.tracks.forEach(this.displayTrack);
      });
  }

  displayTrack(track: ITrack, i: number) {
    track.dislpay = false;
    setTimeout(() => {
      track.dislpay = true;
    }, (i * 50));
  }

  deleteTrack(track: ITrack) {
    this.playlistEvent.emit({
      action: 'DELETE_TRACK',
      track,
      playlist: {
        id: this.playlist.id
      }
    });
  }
}
