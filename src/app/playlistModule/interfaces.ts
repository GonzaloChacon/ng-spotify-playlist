/**
 * Gonzalo Chacón
 */

export interface IArtist {
  external_urls: {
    spotify: string
  }
  followers?: {
    href: string
    total: number
  }
  genres?: string[]
  href: string
  id: string
  images?: IImage[]
  name: string
  popularity?: number
  type: string
  uri: string
}

export interface IAlbum {
  album_type?: string
  artists: IArtist[]
  available_markets?: string[]
  external_urls?: {
    spotify: string
  }
  genres?: string[]
  href?: string
  id: string
  images?: IImage[]
  label?: string
  name: string
  popularity?: number
  tracks?: {
    href: string
    items: ITrack[]
    limit: number
    next: string
    offset: number
    previous: string
    total: number
  }
  release_date?: string
  release_date_precision?: string
  total_tracks?: number
  type?: string
  uri?: string
}

export interface ITrack {
  album: IAlbum
  artists: IArtist[]
  available_markets: string[]
  disc_number: number
  display?: boolean
  duration_ms: number
  explicit: boolean
  external_ids: {
    isrc: string
  }
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  remove?: boolean
  track_number: number
  type: string
  uri: string
}

export interface IImage {
  height: number
  url: string
  width: number
}

export interface IPlaylist {
  collaborative: boolean
  description?: string
  display?: boolean
  external_urls: {
    spotify: string
  }
  followers: {
    href: string
    total: number
  }
  href: string
  id: string
  images: IImage[]
  name: string
  owner: IOwner
  primary_color: string
  public: boolean
  remove?: boolean
  snapshot_id: string
  tracks: {
    href: string
    total: number
    items?: ITrack[]
  }
  type: string
  uri: string
}

export interface IOwner {
  country?: string
  display_name: string
  email?: string
  external_urls: {
    spotify: string
  }
  followers?: {
    href: string
    total: number
  }
  href: string
  id: string
  images?: IImage[]
  product?: string
  type: string
  uri: string
}
