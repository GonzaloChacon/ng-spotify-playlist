/**
 * Gonzalo Chacón
 */

import { IPlaylist, ITrack } from '../interfaces';

/**
 * @method toggleTrackOpt(): Toggle tracks dropdown options.
 * @param e
 * @param i
 */
export function toggleTrackOpt(e, i: number) {
  e.stopPropagation();
  this.options = (this.options !== i) ? i : null;
}

/**
 * @method setDisplay():
 * @param item
 * @param i
 */
export function setDisplay(item: any, i: number) {
  if (!item.display) {
    setTimeout(() => {
      item.display = true;
    }, (i * 50));
  }
}

/**
 * @method playlistIncludes():
 * This function exists because Angular ngIf doesn't allow the implementation of
 * array methods like filter, map, etc. Since I had to extract this as a method
 * instead of using filter, I've implemented the for loop which is more efficient.
 *
 * @param playlist
 * @param track
 */
export function playlistIncludes(playlist: IPlaylist, track: ITrack): boolean {
  let res = false;

  for (const playlsitTrack of playlist.tracks.items) {
    if (playlsitTrack.id === track.id) {
      res = true;
      break;
    }
  }

  return res;
}
