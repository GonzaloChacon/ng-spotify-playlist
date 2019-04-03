# App Features

Below are listes a couple of features, only the ones worth mention.
There are plenty of libraries that address the below features, but I wanted something simple and small. The idea is to avoid to implement a complete library just for two or three features, also, part of the idea of this app was to to experiment.

- [Store Service](#store-service)
- [Notifications](#notifications)

## Store Service

This service was intended for a couple of reasons:
- Being able to implement a Flux pattern to handle the Model and create stateless component that reacts to it, making info flow into one direction.
- Optimize content requests to Spotify. Since the service is a singleton, we can persist desired info, avoiding to call for the same info.
- Bind info between components. Angular Routed doesn't let you bind @Input and @Output when implementing a <routher-outlet>
- Handle events between components that are nested deep withing the application.

### Store creation

To create a store you should implement `.createStore(name, state)` method, which accepts the store name as a first param, and if desired, we can provide the initial state, if not provided the store will create a empty object by default.

```js
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService, Store } from '@app/core/services';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html'
})
export class NewComponent implements OnInit, OnDestroy {
  let someStore: Store;

  constructor(
    private _storeService: StoreService
  ) {}

  ngOnInit() {
    this.someStore = this._storeService.createStore('spotify', { playlists: [] });
  }

  ngOnDestroy() {
    this.someStore.destroy();

    /*
     * We could also implement this._storeService.deleteStore('spotify');
     * in case the store is created in another component and we do not
     * have a instantiation in this compoent.
     */
  }
}
```
**Important:** if the component who creates the store could be destroyed at some point, you need to implement `OnDestroy` method from Angular lifecicle to destroy store and avoid memory leaks.

### Event creation

To create a event you should implement `.createEvent(name)` method, event name as a first param.

```js
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService, Event } from '@app/core/services';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html'
})
export class NewComponent implements OnInit, OnDestroy {
  let someEvent: Event;

  constructor(
    private _storeService: StoreService
  ) {}

  ngOnInit() {
    this.someEvent = this._storeService.Event('updatePlaylist');
  }

  ngOnDestroy() {
    this.someEvent.destroy();

    /*
     * We could also implement this._storeService.deleteEvent('updatePlaylist');
     * in case the event is created in another component and we do not
     * have a instantiation in this compoent.
     */
  }
}
```
**Important:** if the component who creates the event could be destroyed at some point, you need to implement `OnDestroy` method from Angular lifecicle to destroy store and avoid memory leaks.

### Store/Events subscription and event trigger

In order to subscribe to a store or a event we have three options:

#### **.getStore(storeName)**
will let you subscribe and update the Store.
```js
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService, Store } from '@app/core/services';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html'
})
export class NewComponent implements OnInit, OnDestroy {
  private _destroy: Subject<boolean> = new Subject<boolean>();

  let someStore: Store;

  constructor(
    private _storeService: StoreService
  ) {}

  ngOnInit() {
    this.someStore = this._storeService.getStore('spotify');
    this.someStore.emitter.
      .pipe(takeUntil(this._destroy))
      .subscribe(state => {
        this.playlists = state.playlists;
      });
  }

  update(newState) {
    this.someStore.update(newState);
  }

  ngOnDestroy() {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
```

#### **.getEvent(eventName)**
will let you subscribe to an event, and emit one.
```js
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService, Event } from '@app/core/services';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html'
})
export class NewComponent implements OnInit, OnDestroy {
  private _destroy: Subject<boolean> = new Subject<boolean>();

  let someEvent: Event;

  constructor(
    private _storeService: StoreService
  ) {}

  ngOnInit() {
    this.someEvent = this._storeService.getEvent('updatePlaylist');
    this.someEvent.emitter.
      .pipe(takeUntil(this._destroy))
      .subscribe(payload => {
        console.log(`New event!!! ${payload}`);
      });
  }

  update(payload) {
    this.someEvent.emit(payload);
  }

  ngOnDestroy() {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
```

#### **.listenTo(type, name)**
allow us just to subscribe to the store or event and just listen for changes, this is in case we just need to listen but not update. This method require the type of object you want to observe, and the name.
```js
import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService } from '@app/core/services';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html'
})
export class NewComponent implements OnInit, OnDestroy {
  private _destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private _storeService: StoreService
  ) {}

  ngOnInit() {
    this._storeService.listenTo('store', 'spotify')
      .pipe(takeUntil(this._destroy))
      .subscribe(({ playlists }: { playlists: IPlaylist[] }) => {
        this.playlists = playlists.filter(playlist => playlist.public);
      });

    this._storeService.listenTo('event', 'playlsitUpdate')
      .pipe(takeUntil(this._destroy))
      .subscribe((payload) => {
        console.log(`Event!!! ${payload}`);
      });
  }

  update(payload) {
    this.someEvent.emit(payload);
  }

  ngOnDestroy() {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
```
**Important:** if the component who subscribes the store/event could be destroyed at some point, you need to implement `OnDestroy` method from Angular lifecicle to destroy unsubscribe from strems.

#### **.emitEvent(name, payload)**
allow us trigger and event without having to get the event.
```js
import { Component, OnInit } from '@angular/core';
import { StoreService } from '@app/core/services';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html'
})
export class NewComponent {
  constructor(
    private _storeService: StoreService
  ) {}

  update(payload) {
    this.someEvent.emitEvent('updatePlaylist', payload);
  }
}
```

## Notifications

Notifications component was implemented in order to have a light custom toast/notification to comunicate the user about some interactions.

To implement it first we need to include the component in the main html structure.
```html
// Within the app.component.html

<app-notifications-component class="notifications-container"></app-notifications-component>
```
Of course we need to include the compnent in the main module
```js
import { NotificationsComponent } from '@app/core/components';

@NgModule({
  ...
  declarations: [
    ...
    NotificationsComponent,
    ...
  ]
  ...
});
```

Since the notifications.service is implementing 'forRoot', there's no need to include in as part of the providers of the main module.

Once we complete this, we can display notifications through the `NotificationsService` calling the `.add(type, message)` method, which needs two params, the first one is the type of message we want to display (allowed types are `success`, `error`, `warning` and `info`), and the second one is the message we want to display.
```js
import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '@app/core/services';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html'
})
export class NewComponent {
  constructor(
    private _notificationsService: NotificationsService
  ) {}

  notify() {
    this._notificationsService.add('success', 'Your notification service is working!!!');
  }
}
```

#### Sections
- [StoreService](#store-service)
- [Notifications](#notifications)
