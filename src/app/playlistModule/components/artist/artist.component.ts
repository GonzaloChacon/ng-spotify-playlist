/**
 * Gonzalo Chacón
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpotifyService } from '@app/playlistModule/services';
import { IArtist, IAlbum } from '@app/playlistModule/interfaces';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit, OnDestroy {
  private _destroy: Subject<boolean> = new Subject<boolean>();

  playlistEvent: Event;
  artist: IArtist;
  albums: IAlbum[];
  relatedArtists: IArtist[];

  constructor(
    private _spotifyService: SpotifyService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this._activatedRoute.params
      .pipe(takeUntil(this._destroy))
      .subscribe(params => {
        this._spotifyService.getArtist(params['artistId'])
          .subscribe((artist: IArtist) => this.artist = artist);

        this._spotifyService.getArtistAlbums(params['artistId'])
          .subscribe((albums: IAlbum[]) => this.albums = albums);

        this._spotifyService.getArtistRelated(params['artistId'])
          .subscribe((relatedArtists: IArtist[]) => this.relatedArtists = relatedArtists);
      });
  }

  ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
