/**
 * Gonzalo Chacón
 */

import { Component, OnInit, Input } from '@angular/core';
import { SpotifyService } from '@app/playlistModule/services';
import { ITrack, IOwner } from '@app/playlistModule/interfaces';
import { StoreService, Event } from '@app/core/services';

@Component({
  selector: 'app-playlist-tracks',
  templateUrl: './playlistTracks.component.html'
})
export class PlaylistTracksComponent implements OnInit {

  @Input('user') user: IOwner;
  @Input('playlistId') set playlistId(id: string) {
    if (id) {
      this.getTracks(id);
    }
  }

  playlistEvent: Event;
  tracks: ITrack[];

  constructor(
    private _spotifyService: SpotifyService,
    private _storeService: StoreService
  ) {}

  ngOnInit() {
    this.playlistEvent = this._storeService.getEvent('updatePlaylist');
  }

  getTracks(id: string) {
    this._spotifyService.getPlaylistTracks(this.user.id, id)
      .subscribe((tracks: ITrack[]) => {
        this.tracks = tracks;
        this.tracks.forEach(this.displayTrack);
      });
  }

  displayTrack(track: ITrack, i: number) {
    track.dislpay = false;
    setTimeout(() => {
      track.dislpay = true;
    }, (i * 50));
  }

  addTrack(track: ITrack) {
    this.playlistEvent.emit({
      action: 'ADD_TRACK',
      track
    });
  }
}
