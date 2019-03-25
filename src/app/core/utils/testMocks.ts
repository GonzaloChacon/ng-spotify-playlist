/**
 * Gonzalo Chacón
 */

export const USER_MOCK = {
  display_name: 'Gonzalo Chacón',
  email: 'gonzalochacon@gmail.com',
  id: 'gonzalo_chacon'
};

export const PLAYLISTS_MOCK = [
  {
    collaborative: false,
    external_urls: {
      spotify: 'https://open.spotify.com/playlist/somePlaylistID'
    },
    href: 'https://api.spotify.com/v1/playlists/somePlaylistID',
    id: 'somePlaylistID',
    images: [
      {
        height: 640,
        url: 'https://i.scdn.co/image/someImmageID',
        width: 640
      }
    ],
    name: 'Test',
    owner: USER_MOCK,
    public: true,
    tracks: {
      href: 'https://api.spotify.com/v1/playlists/somePlaylistID/tracks',
      total: 1
    },
    type: 'playlist',
    uri: 'spotify:playlist:somePlaylistID'
  }
];

export const ARTIST_MOCK = {
  external_urls: {
    spotify: 'https://open.spotify.com/artist/someArtistID'
  },
  genres: ['melodic hardcore', 'skate punk'],
  href: 'https://api.spotify.com/v1/artists/someArtistID',
  id: 'someArtistID',
  images: [
    {
      height: 224,
      url: 'https://i.scdn.co/image/someImageID',
      width: 340
    }
  ],
  name: 'Artist 1',
  uri: 'spotify:artist:someArtistID'
};

export const TRACKS_MOCK = [
  {
    artists: [ARTIST_MOCK],
    id: 'trackID1',
    name: 'Track 1',
    track_number: 1,
    type: 'track',
    uri: 'spotify:track:trackID1'
  },
  {
    artists: [ARTIST_MOCK],
    id: 'trackID2',
    name: 'Track 1',
    track_number: 2,
    type: 'track',
    uri: 'spotify:track:trackID2'
  }
];

export const ALBUM_MOCK = {
  album_type: 'album',
  artists: [ARTIST_MOCK],
  id: '0kaYtACg9wLVZZyrqSEHyU',
  images: [
    {
      height: 64,
      url: 'https://i.scdn.co/image/4bc5e31f335dd076ce1bd0409c781de130fcf89b',
      width: 64
    }
  ],
  name: 'Super awesome album',
  release_date: '2004-05-18',
  release_date_precision: 'day',
  total_tracks: 2,
  tracks: {
    href:
      'https://api.spotify.com/v1/albums/someAlbumID/tracks?offset=0&limit=50',
    items: TRACKS_MOCK,
    limit: 50,
    next: null,
    offset: 0,
    previous: null,
    total: 12
  },
  type: 'album',
  uri: 'spotify:album:someAlbumID'
};
