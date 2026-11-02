export interface AudioVisualDto {
  id: number;
  title: string;
  poster: string;
  backdrop: string | null;
  rating?: number | null;
  overview: string | null;
  mediaType: string;
  genres?: Genres[];
  genreIds?: number[];
  releaseDate?: string;
  providers?: ProviderWithType[];
}

export interface ScheduledNotification {
  scheduledAt: string;
  comment: string;
  sent: boolean;
}

export interface FavoriteEntry extends AudioVisualDto {
  notification?: ScheduledNotification;
}

export interface RouletteEntry {
  id: number;
  title: string;
  poster: string | null;
  mediaType: string;
}

export interface PlatformRow {
  providerId: number;
  providerName: string;
  logoPath: string;
  movies: AudioVisualDto[];
  tv: AudioVisualDto[];
}

export interface PlatformData {
  providerId: number;
  providerName: string;
  logoPath: string;
  movies: AudioVisualDto[];
  tv: AudioVisualDto[];
  page: number;
  totalPages: number;
}

export interface HomeData {
  trending: AudioVisualDto[];
  topRatedMovies: AudioVisualDto[];
  topRatedTv: AudioVisualDto[];
  topAnime: AudioVisualDto[];
  newReleases: AudioVisualDto[];
  mostPopularAR: AudioVisualDto[];
  platforms: PlatformRow[];
}

export interface Genres {
  id: number;
  name: string;
}

export interface ProviderWithType {
  logoPath: string;
  providerId: number;
  providerName: string;
  displayPriority: number;
  type: string;
}

export interface KeyCrew {
  directors: string[];
  writers: string[];
  music: string[];
  photography: string[];
}

export interface SeasonSummary {
  number: number;
  name: string;
  episodeCount: number;
  airDate: string | null;
  poster: string | null;
}

export interface NetworkSummary {
  name: string;
  logoPath: string;
}

export interface NextEpisode {
  name: string;
  airDate: string | null;
  seasonNumber: number;
  episodeNumber: number;
}

export interface Trailer {
  key: string;
  name: string;
}

export interface DetailItem {
  id: number;
  title: string;
  poster: string | null;
  backdrop: string | null;
  rating: number;
  overview: string | null;
  genres: Genres[];
  mediaType: string;
  duration?: number;
  contentRating?: string;
  productionCompanies?: ProductionCompany[];
  providers?: ProviderWithType[];
  review?: Review;
  createdBy?: Person[];
  credits?: {
    cast: PersonCast[];
    crew: PersonCast[];
  };
  tagline?: string | null;
  releaseDate?: string | null;
  status?: string;
  originalTitle?: string | null;
  voteCount?: number;
  countryCodes?: string[];
  languageCodes?: string[];
  keyCrew?: KeyCrew;
  networks?: NetworkSummary[];
  seasonsCount?: number;
  episodesCount?: number;
  seasons?: SeasonSummary[];
  nextEpisode?: NextEpisode;
  recommendations?: AudioVisualDto[];
  trailer?: Trailer | null;
}

export interface SearchData {
  audiovisuals: AudioVisualDto[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface GenresResponse {
  genres: Genres[];
  movieGenres?: Genres[];
  tvGenres?: Genres[];
}

export type ExploreOrder = "popular" | "rated" | "recent";

export interface ExploreCollection {
  id: string;
  title: string;
  subtitle: string;
  mediaType: "movie" | "tv";
}

export interface ExploreProvider {
  providerId: number;
  providerName: string;
  logoPath: string;
}

export interface ExploreFilters {
  genres: number[];
  minRating: number | null;
  fromYear: number | null;
  toYear: number | null;
  providerId: number | null;
  streamOnly: boolean;
  order: ExploreOrder;
}

export interface Person {
  id: number;
  name: string;
  profilePath: string;
}

export interface Review {
  author: string;
  content: string;
  rating: number;
}

export interface PersonCast {
  id: number;
  name: string;
  profilePath: string;
  character?: string;
  knownFor?: string;
  department?: string;
  job?: string;
}

export interface PersonCredit {
  id: number;
  title: string;
  poster: string | null;
  mediaType: "movie" | "tv";
  date: string | null;
  character: string;
  popularity: number;
}

export interface PersonDetail {
  id: number;
  name: string;
  profilePath: string | null;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  placeOfBirth: string | null;
  knownFor: string;
  credits: PersonCredit[];
}

export interface ProductionCompany {
  name: string;
  logoPath: string;
  originCountry: string;
}

export type MediaTypeFilter = "all" | "movie" | "tv";

export interface SearchFilters {
  mediaType: MediaTypeFilter;
  genres: number[];
  minRating: number | null;
  streamOnly: boolean;
}
