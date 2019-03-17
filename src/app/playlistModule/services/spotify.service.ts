/**
 * Gonzalo Chacón
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { ApiService } from '@app/core/services';
import { IOwner, IPlaylist, IAlbum, IArtist, ITrack } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private _endpoint: string = environment.spotifyUrl;

  constructor(private _api: ApiService) {}

  search(query: string, type: string): Observable<any[]> {
    return this._api.get(`${this._endpoint}/search?q=${query}&type=${type}`);
  }

  getUser(): Observable<IOwner> {
    return this._api.get(`${this._endpoint}/me`);
  }

  getTrack(id: string): Observable<ITrack> {
    return this._api.get(`${this._endpoint}/tracks/${id}`)
      .pipe(map(res => res.items));
  }

  getArtist(id: string): Observable<IArtist> {
    return this._api.get(`${this._endpoint}/artists/${id}`);
  }

  getAlbum(id: string): Observable<IAlbum> {
    return this._api.get(`${this._endpoint}/albums/${id}`);
  }

  // Playlists
  getAllPlaylists(userId: string): Observable<IPlaylist[]> {
    return this._api.get(`${this._endpoint}/users/${userId}/playlists`)
      .pipe(map(res => res.items));
  }

  createPlaylist(body: {description: string, name: string, public: boolean}): Observable<any> {
    return this._api.post(`${this._endpoint}/playlists`, body);
  }

  getPlaylistTracks(userId: string, playlistId: string): Observable<ITrack[]> {
    return this._api.get(`${this._endpoint}/users/${userId}/playlists/${playlistId}/tracks`)
      .pipe(
        map(({ items }) => {
          const res = [];
          items.forEach((item: any) => res.push(item.track));

          return res;
        })
      );
  }

  addPlaylistTrack(uris: string, playlist_id: string): Observable<any> {
    return this._api.post(`${this._endpoint}/playlists/${playlist_id}/tracks?uris=${uris}`, null);
  }

  deletePlaylistTrack(body: {}, playlist_id: string): Observable<any> {
    return this._api.delete(`${this._endpoint}/playlists/${playlist_id}/tracks`, body);
  }
}
