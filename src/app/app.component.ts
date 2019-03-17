/**
 * Gonzalo Chacón
 */

import { Component, OnInit } from '@angular/core';
import { StoreService } from '@app/core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  // Flags
  loading = true;

  constructor(
    private _storeService: StoreService
  ) {}

  ngOnInit() {
    this._storeService.createEvent('loading').emitter
      .subscribe(state => {
        this.loading = state;
      });

    this._storeService.createStore('playlist', []);
  }
}
