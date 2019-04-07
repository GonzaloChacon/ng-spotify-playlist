/**
 * Gonzalo Chacón
 *
 * @description Notification service to display messages with the NotificationsComponent.
 * @method add(): 3 params
 *    'type': determines the style of modal 'success', 'error', 'warning', 'info'
 *    'message': string with message to display
 *    'displayTime': specifies how much time the message should be displayed, by default is set to 3 seconds
 *
 * @example this._notificationsService.add('success', 'Some message')
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export class Notification {
  constructor(
    public type: string = '',
    public message: string = '',
    public displayTime: number,
    public hide: boolean = false
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private _notifications = new Subject<Notification>();
  private _messageType = ['success', 'error', 'info'];

  noteAdded: Observable<any>;

  constructor() {
    this.noteAdded = this._notifications.asObservable();
  }

  add(type: string, message: string, displayTime: number = 3000) {

    if (!this._messageType.includes(type)) {
      throw new Error(`Message type invalid, valid card types are [${this._messageType}]`);
    }
    this._notifications.next(new Notification(type, message, displayTime));
  }
}
