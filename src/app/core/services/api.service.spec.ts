/**
 * Gonzalo Chacón
 */

import { HttpClient } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { ApiService } from './api.service';

describe('ApiService Unite Tests:', () => {
  let service: ApiService;
  let http: HttpClient;

  let spyPost;
  let spyPatch;
  let spyDelete;
  let spyGet;
  let spyPut;

  beforeEach(() => {
    http = new HttpClient(null);
    service = new ApiService(http);

    spyPost = spyOn(http, 'post').and.returnValue(observableOf(true));
    spyPatch = spyOn(http, 'patch').and.returnValue(observableOf(true));
    spyDelete = spyOn(http, 'delete').and.returnValue(observableOf(true));
    spyGet = spyOn(http, 'get').and.returnValue(observableOf(true));
    spyPut = spyOn(http, 'put').and.returnValue(observableOf(true));
  });

  it('get() should call http client to get request info', () => {
    const path = 'http://somePath/';
    service.get(path).subscribe();

    expect(spyGet).toHaveBeenCalled();
    expect(spyGet.calls.allArgs()[0][0]).toBe(path);
  });

  it('put() should call http client to post post info with corresponding body', () => {
    const path = 'http://somePath/';
    const body = 'something';
    service.put(path, body).subscribe();

    expect(spyPut).toHaveBeenCalled();
    expect(spyPut.calls.allArgs()[0][0]).toBe(path);
    expect(spyPut.calls.allArgs()[0][1]).toContain(body);
  });

  it('post() should call http client to post post info with corresponding body', () => {
    const path = 'http://somePath/';
    const body = 'something';
    service.post(path, body).subscribe();

    expect(spyPost).toHaveBeenCalled();
    expect(spyPost.calls.allArgs()[0][0]).toBe(path);
    expect(spyPost.calls.allArgs()[0][1]).toContain(body);
  });

  it('patch() should call http client to post patch info with corresponding body', () => {
    const path = 'http://somePath/';
    const body = 'something';
    service.patch(path, body).subscribe();

    expect(spyPatch).toHaveBeenCalled();
    expect(spyPatch.calls.allArgs()[0][0]).toBe(path);
    expect(spyPatch.calls.allArgs()[0][1]).toContain(body);
  });

  it('delete() should call http client to post delete info', () => {
    const path = 'http://somePath/';
    service.delete(path).subscribe();

    expect(spyDelete).toHaveBeenCalled();
    expect(spyDelete.calls.allArgs()[0][0]).toBe(path);
  });

  it('setHeaders() should set values in headers', () => {
    service.setHeaders({ TestHeader: 'Test header content' });

    expect(service.headers.get('TestHeader')).toBe('Test header content');
  });

  it('resetHeaders() should reset values in headers', () => {
    service.setHeaders({ TestHeader: 'Test header content' });
    service.resetHeaders();

    expect(service.headers.get('TestHeader')).toBe(null);
  });
});
