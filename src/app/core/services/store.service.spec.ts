/**
 * Gonzalo Chacón
 */

import { StoreService } from './store.service';

describe('StoreService Unit Tests:', () => {
  let service: StoreService;

  beforeEach(() => {
    service = new StoreService();
  });

  describe('Events', () => {
    beforeEach(() => {
      service.createEvent('test');
    });

    it('createEvent() should create event', () => {
      expect(service.listenTo('event', 'test')).toBeTruthy();
    });

    it('getEvent() should return event', () => {
      const event = service.getEvent('test');

      expect(event.constructor.name === 'Event').toBeTruthy();
    });

    it('emmitEvent() should complete event and destroy it', () => {
      const event = service.getEvent('test');
      const spy = spyOn(event, 'emit').and.returnValue(true);

      service.emitEvent('test');

      expect(spy).toHaveBeenCalled();
    });

    it('deleteEvent() should complete event and destroy it', () => {
      service.deleteEvent('test');

      try {
        service.listenTo('event', 'test');
      } catch (e) {
        expect(e.message).toBe('event test does not exist.');
      }
    });
  });

  describe('Stores', () => {
    beforeEach(() => {
      service.createStore('test');
    });

    it('createStore() should create store', () => {
      expect(service.listenTo('store', 'test')).toBeTruthy();
    });

    it('getStore() should return store', () => {
      const store = service.getStore('test');

      expect(store.constructor.name === 'Store').toBeTruthy();
    });

    it('deleteStore() should complete store and destroy it', () => {
      service.deleteStore('test');

      try {
        service.listenTo('store', 'test');
      } catch (e) {
        expect(e.message).toBe('store test does not exist.');
      }
    });
  });
});
