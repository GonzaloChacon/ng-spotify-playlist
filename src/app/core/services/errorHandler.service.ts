/**
 * Gonzalo Chacón
 */

import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { NotificationsService } from '@app/core/components/notifications/notifications.service';
import { AuthService } from './authentication.service';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  _notificationsService: NotificationsService;
  _authService: AuthService;

  constructor(
    private _injector: Injector
  ) {}

  handleError(error) {
    if (!this._notificationsService) {
      this._notificationsService = this._injector.get<NotificationsService>(NotificationsService);
    }

    if (!this._authService) {
      this._authService = this._injector.get<AuthService>(AuthService);
    }

    if (error.status === 401) {
      this._notificationsService.add('error', 'Session has expired, please log in again.');
      this._authService.logout();
    }

    // For now just console, since I do not have any error tracking like Sentry or similar.
    console.error(error);
  }
}
