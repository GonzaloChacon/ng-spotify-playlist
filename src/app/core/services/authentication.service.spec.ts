/**
 * Gonzalo Chacón
 */

import { async } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { ApiService } from './api.service';
import { AuthService } from './authentication.service';

describe('AuthService Unite Tests:', () => {
  let service: AuthService;
  let api: ApiService;

  const router: any = {
    navigate() {
      return;
    }
  };

  let spyOnRouter;

  beforeEach(() => {
    api = new ApiService(null);
    service = new AuthService(api, router);

    spyOnRouter = spyOn(router, 'navigate').and.returnValue(observableOf(true));
  });

  describe('canActivate()', () => {
    it('should navigate to login if no session token', async(() => {
      service.canActivate().then(() => {
        expect(spyOnRouter).toHaveBeenCalledWith(['login']);
      });
    }));

    it('should return FALSE if no session token', async(() => {
      service.canActivate().then(res => {
        expect(res).toBe(false);
      });
    }));
  });
});
