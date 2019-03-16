/**
 * Gonzalo Chacón
 *
 * @description Notification component to display messages. There is no setup other than add the component into the
 * main root template. It subscribes to the notifications array from NotificationnsService and shows or displays the
 * message removing the item from the _notes array.
 */

import { Component, OnInit } from '@angular/core';

import { Notification, NotificationsService } from './notifications.service';

@Component({
  selector: 'app-notifications-component',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  _notifications: Notification[] = [];

  constructor(
    private _notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this._notificationsService.noteAdded.subscribe(note => {
      this._notifications.push(note);

      setTimeout(() => {
        note.hide = true;
      }, (note.displayTime - 500));

      setTimeout(() => {
        this.hide.bind(this)(note);
      }, note.displayTime);
    });
  }

  hide(note) {
    const index = this._notifications.indexOf(note);

    if (index >= 0) {
      this._notifications.splice(index, 1);
    }
  }
}
