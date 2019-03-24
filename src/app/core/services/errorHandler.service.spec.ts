/**
 * Gonzalo Chacón
 */

import { AppErrorHandler } from './errorHandler.service';

const add = jasmine.createSpy('ErrorSpy');
const logout = jasmine.createSpy('ErrorSpy');

class MockInjector {
  get(dep: { name: string }) {
    switch (dep.name) {
      case 'NotificationsService': {
        return {
          add
        };
      }
      case 'AuthService': {
        return {
          logout
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
    service = new AppErrorHandler(injector as any);

    consoleErrorSpy = spyOn(console, 'error').and.returnValue('');
  });

  describe('handleError()', () => {
    it('should set NotificationsService if not defined', () => {
      expect(service._notificationsService).toBeUndefined();
      service.handleError({ message: 'someError' });

      expect(service._authService).toBeDefined();
    });

    it('should set AuthService if not defined', () => {
      expect(service._notificationsService).toBeUndefined();
      service.handleError({ message: 'someError' });

      expect(service._notificationsService).toBeDefined();
    });

    it('should display error in browser console', () => {
      service.handleError({
        message: 'someError',
        status: 404
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith({ message: 'someError', status: 404 });
    });

    it('should display toastr error message if status error 401', () => {
      service.handleError({
        message: 'someError',
        status: 401
      });

      expect(add).toHaveBeenCalledWith('error', 'Session has expired, please log in again.');
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
