/**
 * Gonzalo Chacón
 */

import { StoreService } from './store.service';

describe('StoreService Unit Tests:', () => {
  let service: StoreService;

  beforeEach(() => {
    service = new StoreService();
  });

  describe('listenTo()', () => {
    it('should return listen for store content', () => {
      const state = { some: 'info' };
      service.createStore('newStore', state);

      // On store subscription you receive the store state
      service.listenTo('store', 'newStore')
        .toPromise()
        .then((storeState: any) => {
          expect(storeState).toEqual(state);
        });
    });

    it('should return listen for event', done => {
      service.createEvent('newEvent');

      service.listenTo('event', 'newEvent')
        .subscribe((event: any) => {
          expect(event).toEqual('event payload');
          done();
        });

      service.emitEvent('newEvent', 'event payload');
    });

    it('should throw error if instantiation for listener does not exists', () => {
      try {
        service.listenTo('store', 'newStore')
          .subscribe(() => {});
      } catch (e) {
        expect(e.message).toBe('store newStore does not exist.');
      }
    });
  });

  describe('Events', () => {
    describe('createEvent()', () => {
      it('should create event', () => {
        service.createEvent('test');

        expect(service.listenTo('event', 'test')).toBeTruthy();
      });

      it('should throw error if event already instantiated', () => {
        service.createEvent('test');

        try {
          service.createEvent('test');
        } catch (e) {
          expect(e.message).toBe('Event test already instantiated.');
        }
      });
    });

    describe('getEvent()', () => {
      it('should return event', () => {
        service.createEvent('test');
        const event = service.getEvent('test');

        expect(event.constructor.name === 'Event').toBeTruthy();
      });

      it('should throw error if event does not exists', () => {
        try {
          service.getEvent('test');
        } catch (e) {
          expect(e.message).toBe('Event test does not exist.');
        }
      });
    });

    describe('emitEvent()', () => {
      it('should complete event and destroy it', () => {
        const event = service.createEvent('test');
        const spy = spyOn(event, 'emit').and.returnValue(true);

        service.emitEvent('test');

        expect(spy).toHaveBeenCalled();
      });
    });

    describe('deleteEvent()', () => {
      it('should complete event and destroy it', () => {
        service.createEvent('test');

        try {
          service.deleteEvent('test');
        } catch (e) {
          expect(e.message).toBe('Event test does not exist.');
        }
      });

      it('should return error if event does not exists', () => {
        try {
          service.deleteEvent('anotherTest');
        } catch (e) {
          expect(e.message).toBe('Event anotherTest does not exist.');
        }
      });
    });
  });

  describe('Stores', () => {
    describe('createStore()', () => {
      it('should create store', () => {
        service.createStore('test');

        expect(service.listenTo('store', 'test')).toBeTruthy();
      });

      it('should throw error if store already instantiated', () => {
        service.createStore('test');

        try {
          service.createStore('test');
        } catch (e) {
          expect(e.message).toBe('Store test already instantiated.');
        }
      });
    });

    describe('getStore()', () => {
      it('should return store', () => {
        service.createStore('test');
        const store = service.getStore('test');

        expect(store.constructor.name === 'Store').toBeTruthy();
      });

      it('should throw error if store does not exists', () => {
        try {
          service.getStore('test');
        } catch (e) {
          expect(e.message).toBe('Store test does not exist.');
        }
      });
    });

    describe('deleteStore()', () => {
      it('should complete store and destroy it', () => {
        service.createStore('test');

        try {
          service.deleteStore('test');
        } catch (e) {
          expect(e.message).toBe('Store test does not exist.');
        }
      });

      it('should return error if store does not exists', () => {
        try {
          service.deleteStore('test');
        } catch (e) {
          expect(e.message).toBe('Store test does not exist.');
        }
      });
    });
  });
});
