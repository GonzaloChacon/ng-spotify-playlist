/**
 * Gonzalo Chacón
 */

import { Injector } from '@angular/core';
import { AppErrorHandler } from './errorHandler.service';

const add = jasmine.createSpy('ErrorSpy');
const logout = jasmine.createSpy('ErrorSpy');
const navigate = jasmine.createSpy('ErrorSpy');
class MockInjector extends Injector {
  get(dep) {
    switch (dep.name) {
      case 'AlertsService': {
        return {
          add
        };
      }
      case 'AuthService': {
        return {
          logout
        };
      }
      case 'Router': {
        return {
          navigate
        };
      }
    }
  }
}

describe('AppErrorHandler Unit Tests:', () => {
  let service: AppErrorHandler;
  let injector: MockInjector;

  let consoleErrorSpy;

  beforeEach(() => {
    injector = new MockInjector();
    service = new AppErrorHandler(injector);

    consoleErrorSpy = spyOn(console, 'error').and.returnValue('');
  });

  describe('handleError()', () => {
    it('should set toastr service if not defined', () => {
      expect(service._notificationsService).toBeUndefined();
      service.handleError({ message: 'someError' });

      expect(service._notificationsService).toBeDefined();
    });

    it('should display toastr error message if status error 404', () => {
      service.handleError({
        message: 'someError',
        status: 404
      });

      expect(add).toHaveBeenCalledWith('error', { translate: 'common.messages.notFound' });
    });

    it('should display error in browser console', () => {
      service.handleError({
        message: 'someError',
        status: 404
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith({ message: 'someError', status: 404 });
    });

    it('should navigate to jobs if status error 404', () => {
      service.handleError({
        message: 'someError',
        status: 404
      });

      expect(navigate).toHaveBeenCalledWith(['jobs']);
    });

    it('should display toastr error message if status error 401', () => {
      service.handleError({
        message: 'someError',
        status: 401
      });

      expect(add).toHaveBeenCalledWith('error', { translate: 'common.messages.unauthorized' });
    });

    it('should call AuthService.logout if status error 401', () => {
      service.handleError({
        message: 'someError',
        status: 401
      });

      expect(logout).toHaveBeenCalled();
    });
  });
});
