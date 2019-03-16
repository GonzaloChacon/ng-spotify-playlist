/**
 * Gonzalo Chacón
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { ApiService } from '@app/core/services';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  private _endpoint: string = environment.spotifyUrl;

  constructor(private api: ApiService) {}

  search(query: string, type: string): Observable<any[]> {
    return this.api.get(`${this._endpoint}/search?q=${query}&type=${type}`);
  }

  getTrack(id: string): Observable<any[]> {
    return this.api.get(`${this._endpoint}/tracks/${id}`);
  }

  getArtist(id: string): Observable<any[]> {
    return this.api.get(`${this._endpoint}/artists/${id}`);
  }

  getAlbum(id: string): Observable<any[]> {
    return this.api.get(`${this._endpoint}/albums/${id}`);
  }
}
