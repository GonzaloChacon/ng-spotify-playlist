/**
 * Gonzalo Chacón
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StoreService, AuthService } from '@app/core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit, OnDestroy {
  private _destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _storeService: StoreService,
    private _authService: AuthService,
    private _activatedRouter: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    this._storeService.emitEvent('loading', false);

    this._activatedRouter.fragment
      .pipe(takeUntil(this._destroy))
      .subscribe((fragment: string) => {
        const hashParams = new URLSearchParams(fragment);
        const accessToken = hashParams.get('access_token');

        if (accessToken) {
          this._storeService.emitEvent('loading', true);
          this._authService.setToken(accessToken);
          this._router.navigate(['playlist']);
        }
      });
  }

  ngOnDestroy() {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
