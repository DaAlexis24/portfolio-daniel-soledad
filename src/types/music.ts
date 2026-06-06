export interface Song {
  id: string;
  title: string;
  artist: string;
  image_url: string;
  audio_url: string;
}

export interface PlaylistSong {
  added_at: string;
  song: Song;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  created_at: string;
  updated_at: string;
  songs: PlaylistSong[];
}