import {
  AudioVisualDto,
  DetailItem,
  Person as PersonShared,
  PersonCast,
  PersonCredit,
  PersonDetail,
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
  RecommendationsResponse,
  Season,
  Video,
  VideosResponse,
} from "../types/tmdb-item-detail";
import { Movie, TV, Person } from "../types/tmdb-common";
import {
  PersonDetail as ApiPersonDetail,
  PersonMovieCredit,
  PersonTvCredit,
} from "../types/tmdb-person";

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

function mapMovieCredit(credit: PersonMovieCredit): PersonCredit {
  return {
    id: credit.id,
    title: credit.title,
    poster: credit.poster_path,
    mediaType: "movie",
    date: credit.release_date || null,
    character: credit.character,
    popularity: credit.popularity,
  };
}

function mapTvCredit(credit: PersonTvCredit): PersonCredit {
  return {
    id: credit.id,
    title: credit.name,
    poster: credit.poster_path,
    mediaType: "tv",
    date: credit.first_air_date || null,
    character: credit.character,
    popularity: credit.popularity,
  };
}

export function mapPersonDetail(person: ApiPersonDetail): PersonDetail {
  const credits = [
    ...(person.movie_credits?.cast ?? []).map(mapMovieCredit),
    ...(person.tv_credits?.cast ?? []).map(mapTvCredit),
  ];

  // One person can be credited twice on a title; movie and tv ids are separate namespaces.
  const seen = new Set<string>();
  const deduped = credits.filter((credit) => {
    const key = `${credit.mediaType}:${credit.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    id: person.id,
    name: person.name,
    profilePath: person.profile_path,
    biography: person.biography,
    birthday: person.birthday,
    deathday: person.deathday,
    placeOfBirth: person.place_of_birth,
    knownFor: person.known_for_department,
    credits: deduped,
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

const KEY_CREW_JOBS = {
  directors: ["Director"],
  writers: ["Screenplay", "Writer"],
  music: ["Original Music Composer"],
  photography: ["Director of Photography"],
};

function mapKeyCrew(credits?: CreditsResponse): DetailItem["keyCrew"] {
  if (!credits) return undefined;

  const namesFor = (jobs: string[]) => {
    const seen = new Set<string>();
    return credits.crew
      .filter((member) => jobs.includes(member.job))
      .map((member) => member.name)
      .filter((name) => {
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      });
  };

  const crew = {
    directors: namesFor(KEY_CREW_JOBS.directors),
    writers: namesFor(KEY_CREW_JOBS.writers),
    music: namesFor(KEY_CREW_JOBS.music),
    photography: namesFor(KEY_CREW_JOBS.photography),
  };

  return Object.values(crew).some((names) => names.length > 0) ? crew : undefined;
}

// Language fallback matters: a title without Spanish assets still has a trailer.
function pickTrailer(videos?: VideosResponse): DetailItem["trailer"] {
  const candidates = (videos?.results ?? []).filter(
    (video: Video) =>
      video.site === "YouTube" && (video.type === "Trailer" || video.type === "Teaser"),
  );

  if (candidates.length === 0) return null;

  const score = (video: Video) =>
    (video.type === "Trailer" ? 100 : 50) +
    (video.iso_639_1?.startsWith("es") ? 20 : 0) +
    (video.official ? 5 : 0);

  const best = [...candidates].sort((a, b) => score(b) - score(a))[0];
  return { key: best.key, name: best.name };
}

function mapRecommendations(recs?: RecommendationsResponse): DetailItem["recommendations"] {
  const items = (recs?.results ?? []).slice(0, 20).map(mapToAudioVisualDto);
  return items.length > 0 ? items : undefined;
}

function mapSeasons(seasons?: Season[]): DetailItem["seasons"] {
  const items = (seasons ?? [])
    .filter((season) => season.season_number > 0)
    .sort((a, b) => a.season_number - b.season_number)
    .map((season) => ({
      number: season.season_number,
      name: season.name,
      episodeCount: season.episode_count,
      airDate: season.air_date,
      poster: season.poster_path,
    }));

  return items.length > 0 ? items : undefined;
}

export function mapBaseDetail(
  item: MovieDetail | TvDetail,
): Omit<DetailItem, "title" | "duration" | "mediaType"> {
  const isMovie = "release_date" in item;

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
    tagline: item.tagline,
    releaseDate: isMovie ? item.release_date : item.first_air_date,
    status: item.status,
    originalTitle: isMovie ? item.original_title : item.original_name,
    voteCount: item.vote_count,
    countryCodes: item.production_countries?.map((country) => country.iso_3166_1) ?? [],
    languageCodes: item.spoken_languages?.map((language) => language.iso_639_1) ?? [],
    keyCrew: mapKeyCrew(item.credits),
    recommendations: mapRecommendations(item.recommendations),
    trailer: pickTrailer(item.videos),
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
    seasonsCount: tv.number_of_seasons,
    episodesCount: tv.number_of_episodes,
    networks: tv.networks?.map((network) => ({
      name: network.name,
      logoPath: network.logo_path ?? "",
    })),
    seasons: mapSeasons(tv.seasons),
    nextEpisode: tv.next_episode_to_air
      ? {
          name: tv.next_episode_to_air.name,
          airDate: tv.next_episode_to_air.air_date,
          seasonNumber: tv.next_episode_to_air.season_number,
          episodeNumber: tv.next_episode_to_air.episode_number,
        }
      : undefined,
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
