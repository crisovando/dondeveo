export interface ApiGenreListResponse {
  genres: ApiGenre[];
}

export interface ApiGenre {
  id: number;
  name: string;
}
