/**
 * Gonzalo Chacón
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpotifyService } from '@app/playlistModule/services';
import { IArtist } from '@app/playlistModule/interfaces';
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
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this._destroy)
      )
      .subscribe(params => {
        this._spotifyService.getArtist(params['artistId'])
          .subscribe((resp: any) => this.artist = resp);
      });
  }

  ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
