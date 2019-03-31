/**
 * Gonzalo Chacón
 */

import { setDisplay, playlistIncludes, toggleTrackOpt } from './utils';

describe('setDisplay()', () => {
  it('should set track.display TRUE', () => {
    const track = {
      display: false
    };
    jasmine.clock().install();

    setDisplay(track as any, 0);
    jasmine.clock().tick(1000);

    expect(track.display).toBe(true);
    jasmine.clock().uninstall();
  });

  it('should not set track.display FALSE if display already TRUE', () => {
    const track = {
      display: true
    };
    jasmine.clock().install();

    setDisplay(track as any, 0);
    jasmine.clock().tick(1000);

    expect(track.display).toBe(true);
    jasmine.clock().uninstall();
  });
});

describe('playlistIncludes()', () => {
  let playlist;

  beforeEach(() => {
    playlist = {
      tracks: {
        items: [
          {
            id: '123'
          },
          {
            id: '456'
          },
          {
            id: '789'
          }
        ]
      }
    };
  });

  it('should return TRUE if playlist include track', () => {
    expect(playlistIncludes(playlist, { id: '123' } as any)).toBe(true);
  });

  it('should return FALSE if playlist does NOT include track', () => {
    expect(playlistIncludes(playlist, { id: '555' } as any)).toBe(false);
  });
});

describe('toggleTrackOpt()', () => {
  const e = {
    stopPropagation() { return; }
  };

  it('should store track index in options', () => {
    const obj = {
      options: 0,
      toggleTrackOpt
    };

    obj.toggleTrackOpt(e, 1);
    expect(obj.options).toBe(1);
  });
});
