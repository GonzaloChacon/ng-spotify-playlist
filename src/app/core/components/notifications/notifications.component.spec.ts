/**
 * Gonzalo Chacón
 */

import { NotificationsComponent } from './notifications.component';
import { NotificationsService, Notification } from './notifications.service';

describe('NotificationsComponent Unit Tests:', () => {
  let component: NotificationsComponent;
  let _notificationsService: NotificationsService;

  beforeEach(() => {
    _notificationsService = new NotificationsService();
    component = new NotificationsComponent(_notificationsService);
  });

  describe('ngOnInit()', () => {
    it('should subscribe to noteAdded event in NotificationsService', () => {
      component.ngOnInit();
      _notificationsService.add('success', 'Some message');

      expect(component._notifications.length).toBe(1);
    });

    it('should set timetout and remove message', () => {
      component.ngOnInit();
      _notificationsService.add('success', 'Some message', 10);

      expect(component._notifications.length).toBe(1);

      setTimeout(() => {
        expect(component._notifications.length).toBe(0);
      }, 20);
    });

    it('should return error if card type is not valid', () => {
      component.ngOnInit();

      expect(_notificationsService.add.bind(_notificationsService, 'wathever', 'Some message', 10)).toThrowError('Message type invalid, valid card types are [success,error,warning,info]');
    });
  });

  describe('hide()', () => {
    const note = new Notification('error', 'some message', 5, false);

    it('should remove notification from the current notifications array', () => {
      component._notifications = [note];
      component.hide(note);

      expect(component._notifications.length).toBe(0);
    });

    it('should not do anything if note is not part or the array', () => {
      component._notifications = [note];
      const newNote = new Notification('error', 'Lalo Landa', 5, true);
      component.hide(newNote);

      expect(component._notifications.length).toBe(1);
      component.hide(note);
    });

  });
});
