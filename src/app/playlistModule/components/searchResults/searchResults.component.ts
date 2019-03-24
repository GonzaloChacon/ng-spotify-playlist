/**
 * Gonzalo Chacón
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpotifyService } from '@app/playlistModule/services';
import { IAlbum, ITrack, IArtist } from '@app/playlistModule/interfaces';
import { StoreService, Event } from '@app/core/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './searchResults.component.html'
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  private _destroy: Subject<boolean> = new Subject<boolean>();

  playlistEvent: Event;

  albums: IAlbum[] = [];
  artists: IArtist[] = [];
  tracks: ITrack[] = [];

  constructor(
    private _spotifyService: SpotifyService,
    private _storeService: StoreService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.playlistEvent = this._storeService.getEvent('updatePlaylist');

    this._activatedRoute.params
      .pipe(takeUntil(this._destroy))
      .subscribe(params => {
        this.searchOnSpotify(params['search']);
      });
  }

  searchOnSpotify(search: string) {
    // TODO: improove this.
    if (search) {
      this._spotifyService.search(search, 'artist')
        .subscribe((resp: any) => this.artists = resp.artists.items);
    } else {
      this.artists = [];
    }

    if (search) {
      this._spotifyService.search(search, 'album')
        .subscribe((resp: any) => this.albums = resp.albums.items);
    } else {
      this.albums = [];
    }

    if (search) {
      this._spotifyService.search(search, 'track')
        .subscribe((resp: any) => this.tracks = resp.tracks.items);
    } else {
      this.tracks = [];
    }
  }

  addToPlaylist(playlistId: string, track: ITrack) {
    // track.album = {
    //   id: this.album.id,
    //   name: this.album.name,
    //   artists: this.album.artists
    // };

    this.playlistEvent.emit({
      action: 'ADD_TRACK',
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
