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
}

export interface ScheduledNotification {
  scheduledAt: string;
  comment: string;
  sent: boolean;
}

export interface FavoriteEntry extends AudioVisualDto {
  notification?: ScheduledNotification;
}

export interface HomeData {
  trending: AudioVisualDto[];
  topRatedMovies: AudioVisualDto[];
  topRatedTv: AudioVisualDto[];
  topAnime: AudioVisualDto[];
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
}

export interface SearchData {
  audiovisuals: AudioVisualDto[];
  page: number;
  totalPages: number;
  totalResults: number;
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

export interface ProductionCompany {
  name: string;
  logoPath: string;
  originCountry: string;
}
