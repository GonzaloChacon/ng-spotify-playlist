/**
 * Gonzalo Chacón
 */

import { of as observableOf } from 'rxjs';

import { environment } from '@env/environment';
import { SpotifyService } from './spotify.service';
import { ApiService } from '@app/core/services';

describe('SpotifyService Unit Tests:', () => {
  let service: SpotifyService;
  let api: ApiService;

  const endpoint = environment.spotifyUrl;
  let spyApiGet;
  let spyApiPost;
  let spyApiDelete;

  beforeEach(() => {
    api = new ApiService(null);
    service = new SpotifyService(api);

    spyApiGet = spyOn(api, 'get').and.returnValue(observableOf({ items: [{ track: {} }], artists: [] }));
    spyApiPost = spyOn(api, 'post').and.returnValue(observableOf(true));
    spyApiDelete = spyOn(api, 'delete').and.returnValue(observableOf(true));
  });

  it('search() should call endpoint to get results', () => {
    service.search('someSearch', 'album').subscribe();

    expect(spyApiGet).toHaveBeenCalledWith(`${endpoint}/search?q=someSearch&type=album`);
  });

  it('getUser() should call endpoint to get user info', () => {
    service.getUser().subscribe();

    expect(spyApiGet).toHaveBeenCalledWith(`${endpoint}/me`);
  });

  it('getTrack() should call endpoint to get tracks', () => {
    service.getTrack('id123').subscribe();

    expect(spyApiGet).toHaveBeenCalledWith(`${endpoint}/tracks/id123`);
  });

  it('getArtist() should call endpoint to get artist', () => {
    service.getArtist('id123').subscribe();

    expect(spyApiGet).toHaveBeenCalledWith(`${endpoint}/artists/id123`);
  });

  it('getArtistAlbums() should call endpoint to get artist albums', () => {
    service.getArtistAlbums('id123').subscribe();

    expect(spyApiGet).toHaveBeenCalledWith(`${endpoint}/artists/id123/albums`);
  });

  it('getArtistRelated() should call endpoint to get related artists', () => {
    service.getArtistRelated('id123').subscribe();

    expect(spyApiGet).toHaveBeenCalledWith(`${endpoint}/artists/id123/related-artists`);
  });

  it('getAlbum() should call endpoint to get album', () => {
    service.getAlbum('id123').subscribe();

    expect(spyApiGet).toHaveBeenCalledWith(`${endpoint}/albums/id123`);
  });

  it('getAllPlaylists() should call endpoint to get user playlists', () => {
    service.getAllPlaylists('id123').subscribe();

    expect(spyApiGet).toHaveBeenCalledWith(`${endpoint}/users/id123/playlists`);
  });

  it('createPlaylist() should call endpoint to create a new playlsit', () => {
    const playlist = {
      name: 'New playlist',
      description: 'some description',
      public: true
    };

    service.createPlaylist('id123', playlist).subscribe();

    expect(spyApiPost).toHaveBeenCalledWith(`${endpoint}/users/id123/playlists`, playlist);
  });

  it('unfollowPlaylist() should call endpoint to unfollow a playlist', () => {
    service.unfollowPlaylist('id123').subscribe();

    expect(spyApiDelete).toHaveBeenCalledWith(`${endpoint}/playlists/id123/followers`);
  });

  it('getPlaylistTracks() should call endpoint to get playlists tracks', () => {
    service.getPlaylistTracks('id123', 'id456').subscribe();

    expect(spyApiGet).toHaveBeenCalledWith(`${endpoint}/users/id123/playlists/id456/tracks`);
  });

  it('addPlaylistTrack() should call endpoint to add a track into a playlist', () => {
    service.addPlaylistTrack('some:uri:123', 'id123').subscribe();

    expect(spyApiPost).toHaveBeenCalledWith(`${endpoint}/playlists/id123/tracks?uris=some:uri:123`, null);
  });

  it('deletePlaylistTrack() should call endpoint to remove track from playlist', () => {
    const body = {
      tracks: [{ uri: 'some:track:123' }]
    };
    service.deletePlaylistTrack(body, 'id123').subscribe();

    expect(spyApiDelete).toHaveBeenCalledWith(`${endpoint}/playlists/id123/tracks`, body);
  });
});
