/**
 * Gonzalo Chacón
 */

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ApiService } from './api.service';
import { getCookie, setCookie, deleteCookie } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {
  private _cookieName = 'spotify-access-token';
  private _headerSet = false;

  constructor(
    private _api: ApiService,
    private _router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const storedToken = getCookie(this._cookieName);

    if (!storedToken) {
      this._router.navigate(['login']);
    } else {
      if (!this._headerSet) {
        this.setHeader(storedToken);
      }
      return true;
    }
  }

  setToken(accessToken: string) {
    if (getCookie(this._cookieName)) {
      this._api.resetHeaders();
    }

    // Store token in a cookie in case of browser reload
    setCookie({ name: this._cookieName, value: accessToken, expDays: 1 });
    this.setHeader(accessToken);
  }

  setHeader(accessToken: string) {
    this._headerSet = true;

    this._api.setHeaders({
      Authorization: `Bearer ${accessToken}`
    });
  }

  logout() {
    deleteCookie(this._cookieName);
    this._api.resetHeaders();
    this._router.navigate(['login']);
  }
}
