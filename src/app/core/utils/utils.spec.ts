/**
 * Gonzalo Chacón
 */

import {
  isObject,
  objMergeDeep,
  getCookie,
  setCookie,
  deleteCookie
} from './utils';

describe('Utils Unit Test:', () => {
  describe('isObject()', () => {
    it('should return TRUE if object', () => {
      const obj = {};
      expect(isObject(obj)).toBe(true);
    });

    it('should return FALSE if object', () => {
      const obj = 'obj';
      expect(isObject(obj)).toBe(false);
    });
  });

  describe('objMergeDeep()', () => {
    it('should merge objects', () => {
      const obj1 = {
        a: 1,
        b: 2,
        c: {
          a: 1,
          b: 2
        }
      };
      const obj2 = {
        a: 'a',
        c: {
          b: 'b',
          c: 'c'
        }
      };
      const obj3 = {
        a: 'a',
        b: 2,
        c: {
          a: 1,
          b: 'b',
          c: 'c'
        }
      };

      expect(objMergeDeep(obj1, obj2)).toEqual(obj3);
    });
  });

  describe('getCookie()', () => {
    it('should return cookie', () => {
      setCookie({ name: 'cookie-test', value: 'something', expDays: 1 });

      expect(getCookie('cookie-test')).toEqual('something');
    });
  });

  describe('deleteCookie()', () => {
    it('should delete cookie', () => {
      setCookie({ name: 'cookie-test', value: 'something', expDays: 1 });
      deleteCookie('cookie-test', 'localhost');
      expect(getCookie('cookie-test')).toBeFalsy();
    });
  });

  describe('setCookie()', () => {
    it('should set cookie', () => {
      setCookie({ name: 'cookie-test', value: 'something', expDays: 1 });

      expect(getCookie('cookie-test')).toEqual('something');
    });
  });
});
