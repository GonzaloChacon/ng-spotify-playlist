/**
 * Gonzalo Chacón
 *
 * There are plenty of state management libraries, but I needed
 * a very simple solution. This is enough for what I need, and
 * I do like to keep my bundles small... also, wouldn't be as funny
 * if I implement yet another soultion from someone else ;)
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable,  Subject } from 'rxjs';
import { mergeDeep } from '../utils/utils';

export class Store {
  private storeEmmiter: BehaviorSubject<any>;
  emitter: Observable<any>;

  constructor(
    private state: any
  ) {
    this.storeEmmiter = new BehaviorSubject(this.state);
    this.emitter = this.storeEmmiter.asObservable();
  }

  async update(state: any) {
    this.state = await mergeDeep(this.state, state);
    this.storeEmmiter.next(this.state);
  }

  destroy(): void {
    this.storeEmmiter.complete();
  }
}

export class Event {
  private eventEmmiter: Subject<any>;
  emitter: Observable<any>;

  constructor() {
    this.eventEmmiter = new Subject();
    this.emitter = this.eventEmmiter.asObservable();
  }

  emit(event: any) {
    this.eventEmmiter.next(event);
  }

  destroy(): void {
    this.eventEmmiter.complete();
  }
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private events: Event[] = [];
  private stores: Store[] = [];

  listenTo(type: string, key: string): Observable<any> {
    try {
      switch (type) {
        case 'store': {
          return this.stores[key].emitter;
        }
        case 'event': {
          return this.events[key].emitter;
        }
      }
    } catch (e) {
      throw new Error(`${type} ${key} does not exist.`);
    }
  }

  // Events
  createEvent(key: string): Event {
    if (this.stores[key]) {
      throw new Error(`Event ${key} already instantiated.`);
    } else {
      this.events[key] = new Event();
      return this.events[key];
    }
  }

  getEvent(key: string): Event {
    return this.events[key];
  }

  emitEvent(key: string, state?: any) {
    this.events[key].emit(state);
  }

  deleteEvent(key: string) {
    if (this.events[key]) {
      this.events[key].destroy();
      delete this.events[key];
    } else {
      throw new Error(`Event ${key} does not exist.`);
    }
  }

  // Store
  createStore(key: string, initialState: any = {}): Store {
    if (this.stores[key]) {
      throw new Error(`Store ${key} already instantiated.`);
    } else {
      this.stores[key] = new Store(initialState);
      return this.stores[key];
    }
  }

  getStore(key: string): Store {
    return this.stores[key];
  }

  deleteStore(key: string) {
    if (this.stores[key]) {
      this.stores[key].destroy();
      delete this.stores[key];
    } else {
      throw new Error(`Store ${key} does not exist.`);
    }
  }
}
