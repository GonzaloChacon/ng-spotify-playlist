/**
 * Gonzalo Chacón
 */

import { async } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { ApiService } from './api.service';
import { AuthService } from './authentication.service';
import { setCookie, deleteCookie } from '../utils/utils';

const cookieName = 'spotify-access-token';

describe('AuthService Unite Tests:', () => {
  let service: AuthService;
  let api: ApiService;

  const router: any = {
    navigate() {
      return;
    }
  };

  let spyOnRouter;
  let spyApiResetHeaders;
  let spyApiSetHeaders;

  beforeEach(() => {
    api = new ApiService(null);
    service = new AuthService(api, router);

    spyOnRouter = spyOn(router, 'navigate').and.returnValue(observableOf(true));
    spyApiResetHeaders = spyOn(api, 'resetHeaders').and.returnValue(true);
    spyApiSetHeaders = spyOn(api, 'setHeaders').and.returnValue(true);
  });

  describe('canActivate()', () => {
    let spySetHeader;

    beforeEach(() => {
      spySetHeader = spyOn(service, 'setHeader').and.returnValue(true);
    });

    it('should call setHeader() if storedToken and _headerSet FALSE', async(() => {
      setCookie({ name: cookieName, value: '123', expDays: 1 });

      service.canActivate().then(() => {
        expect(spySetHeader).toHaveBeenCalledWith('123');
        deleteCookie(cookieName);
      });
    }));

    it('should return TRUE if storedToken', async(() => {
      setCookie({ name: cookieName, value: '123', expDays: 1 });

      service.canActivate().then(res => {
        expect(res).toBe(true);
      });
    }));
  });

  describe('setToken()', () => {
    let spySetHeader;

    beforeEach(() => {
      spySetHeader = spyOn(service, 'setHeader').and.returnValue(true);
    });

    it('should reset api headers if token stored', () => {
      service.setToken('123');

      expect(spyApiResetHeaders).toHaveBeenCalled();
    });

    it('should call setHeader', () => {
      service.setToken('123');

      expect(spySetHeader).toHaveBeenCalledWith('123');
    });
  });

  describe('setHeader()', () => {
    const token = 'token123';

    beforeEach(() => {
      service.setHeader(token);
    });

    it('should set api headers', () => {
      expect(spyApiSetHeaders).toHaveBeenCalledWith({
        Authorization: `Bearer ${token}`
      })
    });
  });

  describe('logout()', () => {
    beforeEach(() => {
      service.logout();
    });

    it('should reset api headers', () => {
      expect(spyApiResetHeaders).toHaveBeenCalled();
    });

    it('should navigate to login', () => {
      expect(spyOnRouter).toHaveBeenCalledWith(['login']);
    });
  });
});
