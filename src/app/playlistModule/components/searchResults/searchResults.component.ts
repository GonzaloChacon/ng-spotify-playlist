/**
 * Gonzalo Chacón
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpotifyService } from '@app/playlistModule/services';
import { IAlbum, ITrack, IArtist, IPlaylist } from '@app/playlistModule/interfaces';
import { StoreService, Event } from '@app/core/services';
import { ActivatedRoute } from '@angular/router';
import { toggleTrackOpt, playlistIncludes, setDisplay } from '@app/playlistModule/components/utils';

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
  playlists: IPlaylist[] = [];
  options: number;

  toggleTrackOpt: () => any = toggleTrackOpt.bind(this);
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
        this.searchOnSpotify(params['search']);
      });
  }

  searchOnSpotify(search: string) {
    if (search) {
      this._spotifyService.search(search, 'artist')
        .subscribe((resp: any) => this.artists = resp.artists.items);

      this._spotifyService.search(search, 'album')
        .subscribe((resp: any) => this.albums = resp.albums.items);

      this._spotifyService.search(search, 'track')
        .subscribe((resp: any) => {
          resp.tracks.items.forEach(setDisplay);
          this.tracks = resp.tracks.items;
        });
    } else {
      this.artists = [];
      this.albums = [];
      this.tracks = [];
    }
  }

  updatePlaylist(action: string, playlistId: string, track: ITrack) {
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
