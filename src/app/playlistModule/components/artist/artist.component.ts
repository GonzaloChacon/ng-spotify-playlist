/**
 * Gonzalo Chacón
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpotifyService } from '@app/playlistModule/services';
import { ITrack, IArtist } from '@app/playlistModule/interfaces';
import { StoreService, Event } from '@app/core/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html'
})
export class ArtistComponent implements OnInit, OnDestroy {
  private _destroy: Subject<boolean> = new Subject<boolean>();

  playlistEvent: Event;
  artist: IArtist;

  constructor(
    private _spotifyService: SpotifyService,
    private _storeService: StoreService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.playlistEvent = this._storeService.getEvent('updatePlaylist');

    this._activatedRoute.params
      .pipe(
        takeUntil(this._destroy)
      )
      .subscribe(params => {
        this._spotifyService.getArtist(params['artistId'])
          .subscribe((resp: any) => this.artist = resp);
      });
  }

  addTrack(track: ITrack) {
    this.playlistEvent.emit({
      action: 'ADD_TRACK',
      track
    });
  }

  ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
