/**
 * Gonzalo Chacón
 */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(
    private _http: HttpClient
  ) {}

  setHeaders(headers): void {
    Object.keys(headers).forEach(header => {
      this.headers = this.headers.append(header, headers[header]);
    });
  }

  resetHeaders(): void {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  get(path: string): Observable<any> {
    return this._http.get(path, { headers: this.headers });
  }

  put(path: string, body: any): Observable<any> {
    return this._http.put(
      path,
      JSON.stringify(body),
      { headers: this.headers }
    );
  }

  post(path: string, body: any): Observable<any> {
    return this._http.post(
      path,
      JSON.stringify(body),
      {
        headers: this.headers,
        responseType: 'json'
      }
    );
  }

  patch(path: string, body: any): Observable<any> {
    return this._http.patch(
      path,
      JSON.stringify(body),
      { headers: this.headers }
    );
  }

  delete(path: string): Observable<any> {
    return this._http.delete(
      path,
      { headers: this.headers }
    );
  }
}
