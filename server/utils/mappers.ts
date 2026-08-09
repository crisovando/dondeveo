import {
  AudioVisualDto,
  DetailItem,
  Person as PersonShared,
  PersonCast,
  ProviderWithType,
  Review as SharedReview,
  ProductionCompany,
} from "../../src/shared/types";
import { ProvidersType } from "../../src/shared/enums";
import {
  MovieDetail,
  TvDetail,
  ProvidersResponse,
  CreditsResponse,
  Review,
  ProductionCompany as ApiProductionCompany,
  ReleaseDateResult,
  ContentRatingResult,
} from "../types/tmdb-item-detail";
import { Movie, TV, Person } from "../types/tmdb-common";

function isProviderType(key: string): key is keyof typeof ProvidersType {
  return Object.keys(ProvidersType).includes(key);
}

export function mapWatchProviders(
  providersResponse?: ProvidersResponse,
  region: string = "AR",
): ProviderWithType[] {
  if (!providersResponse) return [];

  const providers = providersResponse.results?.[region] ?? [];
  if (!providers) return [];

  return Object.entries(providers).flatMap(([key, value]) => {
    if (!isProviderType(key) || !Array.isArray(value)) return [];

    return value.map((provider) => ({
      providerId: provider.provider_id,
      providerName: provider.provider_name,
      logoPath: provider.logo_path,
      displayPriority: provider.display_priority,
      type: key,
    }));
  });
}

export function mapCredits(credits?: CreditsResponse): { cast: PersonCast[]; crew: PersonCast[] } {
  if (!credits) return { cast: [], crew: [] };
  return {
    cast: credits.cast.map((cast) => ({
      id: cast.id,
      name: cast.name,
      profilePath: cast.profile_path || "",
      character: cast.character,
      knownFor: cast.known_for_department,
    })),
    crew: credits.crew.map((crew) => ({
      id: crew.id,
      name: crew.name,
      profilePath: crew.profile_path || "",
      job: crew.job,
      knownFor: crew.known_for_department,
    })),
  };
}

export function mapReview(review?: Review): SharedReview | undefined {
  if (!review) return undefined;

  return {
    author: review.author,
    content: review.content,
    rating: review.author_details.rating ?? 0,
  };
}

export function mapPerson(person?: Person): PersonShared | undefined {
  if (!person) return undefined;

  return {
    id: person.id,
    name: person.name,
    profilePath: person.profile_path || "",
  };
}

export function mapProductionCompanies(
  productionCompanies?: ApiProductionCompany[],
): ProductionCompany[] {
  if (!productionCompanies) return [];

  return productionCompanies.map((company) => ({
    name: company.name,
    logoPath: company.logo_path || "",
    originCountry: company.origin_country,
  }));
}

export function mapContentRating(item: MovieDetail | TvDetail): string {
  const isMovie = "title" in item;
  const results = isMovie
    ? (item as MovieDetail).release_dates?.results || []
    : (item as TvDetail).content_ratings?.results || [];

  const priorityOrder = ["AR", "BR", "ES", "MX", "US"];
  let rawRating = "";

  for (const country of priorityOrder) {
    const found = results.find((r) => r.iso_3166_1 === country);
    if (found) {
      if (isMovie) {
        const releaseDates = (found as ReleaseDateResult).release_dates;
        const release = releaseDates.find((rd) => rd.certification !== "") || releaseDates[0];
        rawRating = release?.certification || "";
      } else {
        rawRating = (found as ContentRatingResult).rating || "";
      }
      if (rawRating) break;
    }
  }

  if (!rawRating) return "S/C";

  const digits = rawRating.match(/\d+/);
  if (digits) return `+${digits[0]}`;

  const specials: Record<string, string> = {
    "TV-MA": "+18",
    R: "+18",
    "TV-14": "+13",
    "PG-13": "+13",
    "TV-G": "ATP",
    G: "ATP",
    ATP: "ATP",
    C: "+18",
    L: "ATP",
  };

  return specials[rawRating.trim()] || rawRating;
}

export function mapBaseDetail(
  item: MovieDetail | TvDetail,
): Omit<DetailItem, "title" | "duration" | "mediaType"> {
  return {
    id: item.id,
    poster: item.poster_path,
    backdrop: item.backdrop_path,
    rating: item.vote_average,
    overview: item.overview,
    genres: item.genres,
    productionCompanies: mapProductionCompanies(item.production_companies),
    providers: mapWatchProviders(item["watch/providers"]),
    credits: mapCredits(item.credits),
    review: mapReview(item.reviews?.results[0]),
    contentRating: mapContentRating(item),
  };
}

export function mapMovieDetail(movie: MovieDetail): DetailItem {
  return {
    ...mapBaseDetail(movie),
    title: movie.title,
    duration: movie.runtime ?? undefined,
    mediaType: "movie",
  };
}

export function mapTvDetail(tv: TvDetail): DetailItem {
  return {
    ...mapBaseDetail(tv),
    title: tv.name,
    createdBy: tv.created_by?.map(mapPerson).filter((p): p is PersonShared => !!p),
    mediaType: "tv",
  };
}

export function mapToAudioVisualDto(item: Movie | TV | any): AudioVisualDto {
  const isMovie = item.media_type === "movie" || !!item.title;

  return {
    id: item.id,
    title: isMovie ? item.title : item.name,
    poster: item.poster_path || item.profile_path || "",
    backdrop: item.backdrop_path || null,
    rating: item.vote_average ?? null,
    overview: item.overview ?? null,
    mediaType: item.media_type || (isMovie ? "movie" : "tv"),
    genreIds: item.genre_ids,
    releaseDate: isMovie ? item.release_date : item.first_air_date,
  };
}
