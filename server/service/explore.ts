import { fetchTMDB } from "./tmdbFetch";
import { getWatchProvidersBatched } from "./providers";
import { mapToAudioVisualDto } from "../utils/mappers";
import { DiscoverMovieResponse, DiscoverTVResponse } from "../types/tmdb-discover";
import {
  AudioVisualDto,
  ExploreCollection,
  ExploreFilters,
  ExploreOrder,
  ProviderWithType,
  SearchData,
} from "../../src/shared/types";

type DiscoverType = "movie" | "tv";

// Genre ids shared by the movie and TV vocabularies, so a collection can only
// use ids that exist for its own media type.
const GENRE = {
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  FAMILY: 10751,
} as const;

// Certifications are read off the US scale: the AR scale tags far fewer titles
// (112 against 669 on the same genres). TV Discover ignores the parameter
// outright, so a recipe may only carry one for a movie.
const CERTIFICATION_COUNTRY = "US";

// Both weighted orders need a vote floor; without one TMDB ranks single-vote
// 10.0 titles and unreleased announcements first.
const ORDER_MIN_VOTES: Partial<Record<ExploreOrder, number>> = {
  rated: 200,
  recent: 50,
};

const ORDER_SORT: Record<DiscoverType, Record<ExploreOrder, string>> = {
  movie: {
    popular: "popularity.desc",
    rated: "vote_average.desc",
    recent: "primary_release_date.desc",
  },
  tv: {
    popular: "popularity.desc",
    rated: "vote_average.desc",
    recent: "first_air_date.desc",
  },
};

const DATE_RANGE: Record<DiscoverType, { from: string; to: string }> = {
  movie: { from: "primary_release_date.gte", to: "primary_release_date.lte" },
  tv: { from: "first_air_date.gte", to: "first_air_date.lte" },
};

// Max titles enriched with provider availability per page; covers a full result
// page while keeping the extra TMDb calls bounded.
const MAX_PROVIDER_ENRICH = 20;

const TMDB_PAGE_SIZE = 20;

interface CollectionRecipe extends ExploreCollection {
  genres: number[];
  certification?: string;
  minRating: number;
  toYear?: number;
}

// Each recipe is a Discover query; the filter panel refines on top of it by
// adding genres and tightening the shared dimensions.
export const COLLECTIONS: CollectionRecipe[] = [
  {
    id: "infantil",
    title: "Infantil",
    subtitle: "Animación y familia, para los más chicos",
    mediaType: "movie",
    genres: [GENRE.ANIMATION, GENRE.FAMILY],
    certification: "G|PG",
    minRating: 6.5,
  },
  {
    id: "compartir",
    title: "Para ver en familia",
    subtitle: "Aventura y familia para compartir",
    mediaType: "movie",
    genres: [GENRE.FAMILY, GENRE.ADVENTURE],
    certification: "G|PG|PG-13",
    minRating: 6.5,
  },
  {
    id: "comedia-familiar",
    title: "Comedia familiar",
    subtitle: "Para reírse en grupo",
    mediaType: "movie",
    genres: [GENRE.FAMILY, GENRE.COMEDY],
    certification: "G|PG|PG-13",
    minRating: 6,
  },
  {
    id: "clasicos",
    title: "Infantiles de siempre",
    subtitle: "Los clásicos que ya viste mil veces",
    mediaType: "movie",
    genres: [GENRE.ANIMATION, GENRE.FAMILY],
    certification: "G|PG",
    minRating: 6.5,
    toYear: 1999,
  },
  {
    id: "series-familia",
    title: "Series para ver juntos",
    subtitle: "Animación y familia, en capítulos",
    mediaType: "tv",
    genres: [GENRE.ANIMATION, GENRE.FAMILY],
    minRating: 6.5,
  },
  {
    id: "series-comedia",
    title: "Series para reír en casa",
    subtitle: "Comedia familiar de todos los días",
    mediaType: "tv",
    genres: [GENRE.COMEDY, GENRE.FAMILY],
    minRating: 6.5,
  },
];

export const findCollection = (id: string): CollectionRecipe | undefined =>
  COLLECTIONS.find((collection) => collection.id === id);

export const listCollections = (): ExploreCollection[] =>
  COLLECTIONS.map(({ id, title, subtitle, mediaType }) => ({
    id,
    title,
    subtitle,
    mediaType,
  }));

function buildParams(
  collection: CollectionRecipe,
  filters: ExploreFilters,
  page: number,
): URLSearchParams {
  const mediaType = collection.mediaType;

  const params = new URLSearchParams({
    include_adult: "false",
    sort_by: ORDER_SORT[mediaType][filters.order],
    page: String(page),
  });

  // The recipe's genres are the base and the panel adds to them, so the
  // selection always stays inside what the collection promised.
  const genres = [...new Set([...collection.genres, ...filters.genres])];
  params.set("with_genres", genres.join(","));

  const minVotes = ORDER_MIN_VOTES[filters.order];
  if (minVotes) params.set("vote_count.gte", String(minVotes));

  const minRating = Math.max(collection.minRating, filters.minRating ?? 0);
  params.set("vote_average.gte", String(minRating));

  const range = DATE_RANGE[mediaType];
  if (filters.fromYear) params.set(range.from, `${filters.fromYear}-01-01`);
  const toYear = filters.toYear ?? collection.toYear;
  if (toYear) params.set(range.to, `${toYear}-12-31`);

  // Restricting to AR flatrate availability is the server-side equivalent of
  // search's client-side "solo en streaming" filter.
  if (filters.providerId) {
    params.set("watch_region", "AR");
    params.set("with_watch_monetization_types", "flatrate");
    params.set("with_watch_providers", String(filters.providerId));
  } else if (filters.streamOnly) {
    params.set("watch_region", "AR");
    params.set("with_watch_monetization_types", "flatrate");
  }

  if (collection.certification && mediaType === "movie") {
    params.set("certification_country", CERTIFICATION_COUNTRY);
    params.set("certification", collection.certification);
  }

  return params;
}

const DEFAULT_FILTERS: ExploreFilters = {
  genres: [],
  minRating: null,
  fromYear: null,
  toYear: null,
  providerId: null,
  streamOnly: false,
  order: "popular",
};

export async function explore(
  collectionId: string,
  filters: Partial<ExploreFilters>,
  page: number,
): Promise<SearchData | null> {
  const collection = findCollection(collectionId);
  if (!collection) return null;

  const resolved: ExploreFilters = { ...DEFAULT_FILTERS, ...filters };
  const params = buildParams(collection, resolved, page);

  const isMovie = collection.mediaType === "movie";
  const path = isMovie ? "/discover/movie" : "/discover/tv";

  // TMDb failures propagate up: an outage must surface as a real API error, not
  // as an empty result set that looks like "nothing matches".
  const response = await fetchTMDB<DiscoverMovieResponse | DiscoverTVResponse>(path, params);

  const audiovisuals: AudioVisualDto[] = (response.results ?? []).map(mapToAudioVisualDto);

  const providersMap: Record<string, ProviderWithType[]> = {};
  try {
    const batched = await getWatchProvidersBatched(
      audiovisuals.slice(0, MAX_PROVIDER_ENRICH).map((item) => ({
        type: item.mediaType,
        id: item.id,
      })),
    );
    Object.assign(providersMap, batched);
  } catch (error) {
    console.error(`Provider enrichment failed for collection "${collectionId}":`, error);
  }

  const totalResults = response.total_results ?? audiovisuals.length;

  return {
    audiovisuals: audiovisuals.map((item) => ({
      ...item,
      providers: providersMap[`${item.mediaType}:${item.id}`] ?? undefined,
    })),
    page,
    totalPages: Math.max(1, response.total_pages ?? Math.ceil(totalResults / TMDB_PAGE_SIZE)),
    totalResults,
  };
}
