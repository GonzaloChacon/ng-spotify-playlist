/**
 * Gonzalo Chacón
 */

import { async } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { CustomModulePreloading } from './customPreloading.service';

describe('CustomModulePreloading Unite Tests:', () => {
  let service: CustomModulePreloading;

  beforeEach(() => {
    service = new CustomModulePreloading();
  });

  describe('preload()', () => {
    const route = {
      data: {
        preload: true
      },
      path: 'some/path'
    };
    const spyObj = jasmine.createSpy().and.returnValue(observableOf('some value'));

    it('should return observable of NULL if route.data and router.data["preload"] undefined', async(() => {
      service.preload({}, null).subscribe(res => {
        expect(res).toBe(null);
      });
    }));

    it('should return given observable if route.data and router.data["preload"] are defined', async(() => {
      service.preload(route, spyObj as any).subscribe(res => {
        expect(res).toBe('some value');
      });
    }));

    it('should push path into preloadedModules if route.data and router.data["preload"] are defined', async(() => {
      service.preload(route, spyObj as any).subscribe(() => {
        expect(service.preloadedModules[0]).toBe('some/path');
      });
    }));
  });

});
