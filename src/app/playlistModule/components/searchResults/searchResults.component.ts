/**
 * Gonzalo Chacón
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { SpotifyService } from '@app/playlistModule/services';
import { IAlbum, ITrack, IArtist } from '@app/playlistModule/interfaces';
import { StoreService, Event } from '@app/core/services';

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
    private _storeService: StoreService
  ) {}

  ngOnInit() {
    this.playlistEvent = this._storeService.getEvent('updatePlaylist');

    this._storeService.getEvent('search').emitter
      .subscribe(this.searchOnSpotify.bind(this));
  }

  searchOnSpotify({ search, artists, albums, tracks }) {
    // TODO: improove this.
    if (artists && search) {
      this._spotifyService.search(search, 'artist')
        .subscribe((resp: any) => this.artists = resp.artists.items);
    } else {
      this.artists = [];
    }

    if (albums && search) {
      this._spotifyService.search(search, 'album')
        .subscribe((resp: any) => this.albums = resp.albums.items);
    } else {
      this.albums = [];
    }

    if (tracks && search) {
      this._spotifyService.search(search, 'track')
        .subscribe((resp: any) => this.tracks = resp.tracks.items);
    } else {
      this.tracks = [];
    }
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
