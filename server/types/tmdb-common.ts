export interface BaseMedia {
  id: number;
  popularity: number;
}

export interface MediaContent extends BaseMedia {
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
  original_language: string;
  vote_average: number;
  vote_count: number;
}

export interface Movie extends MediaContent {
  media_type: "movie";
  title: string;
  original_title: string;
  release_date: string;
  adult: boolean;
  video: boolean;
}

export interface TV extends MediaContent {
  media_type: "tv";
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
}

export type AudioVisual = Movie | TV;

export interface Person extends BaseMedia {
  media_type: "person";
  name: string;
  profile_path: string | null;
  adult: boolean;
  known_for: AudioVisual[];
}
