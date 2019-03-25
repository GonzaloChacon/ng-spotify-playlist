/**
 * Gonzalo Chacón
 */

import { Component, OnInit, Input } from '@angular/core';
import { ITrack } from '@app/playlistModule/interfaces';
import { StoreService, Event } from '@app/core/services';

@Component({
  selector: 'app-playlist-tracks',
  templateUrl: './playlistTracks.component.html'
})
export class PlaylistTracksComponent implements OnInit {
  /*
   * TODO: Angular change detection doesn't recognize changes within arrays,
   * only changes to the array reference. When a new track is added to the
   * playlist, it's not reflected in the template.
   * The binding to 'playlistLength' has no other purpose to be able to detect
   * when the playlist length changes and update the template.
   *
   * Since the component is staleles, it will work for now, but check for
   * a better solution (outside calling the Store in inside the playlist).
   */
  @Input('playlistLength') set newLenght(_: number) {
    if (this.tracks) {
      this.tracks.forEach(this.displayTrack);
    }
  }

  @Input('playlistId') playlistId: string;
  @Input('playlistOwner') canEdit: string;
  @Input('playlistTracks') set playlistTracks(tracks: ITrack[]) {
    this.tracks = tracks;
    this.tracks.forEach(this.displayTrack);
  }

  update = false;
  playlistEvent: Event;
  tracks: ITrack[];

  constructor(
    private _storeService: StoreService
  ) {}

  ngOnInit() {
    this.playlistEvent = this._storeService.getEvent('updatePlaylist');
  }

  displayTrack(track: ITrack, i: number) {
    if (!track.display) {
      setTimeout(() => {
        track.display = true;
      }, (i * 50));
    }
  }

  deleteTrack(track: ITrack) {
    this.playlistEvent.emit({
      action: 'DELETE_TRACK',
      tracks: [track],
      playlist: {
        id: this.playlistId
      }
    });
  }
}
