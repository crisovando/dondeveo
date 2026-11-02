import { fetchTMDB } from "./tmdbFetch";
import { MovieDetail, TvDetail } from "../types/tmdb-item-detail";
import { DetailItem } from "../../src/shared/types";
import { mapMovieDetail, mapTvDetail } from "../utils/mappers";

export async function getDetail(path: string, type: string): Promise<DetailItem> {
  const appendToResponse =
    "credits,reviews,watch/providers,content_ratings,release_dates,recommendations,videos";

  const params = new URLSearchParams();
  params.append("append_to_response", appendToResponse);
  // Without this list TMDB returns only Spanish assets, dropping every trailer on
  // titles that were never localized.
  params.append("include_video_language", "es,en,null");

  const detail = await fetchTMDB<MovieDetail | TvDetail>(path, params);

  if (type === "movie") {
    return mapMovieDetail(detail as MovieDetail);
  }

  if (type === "tv") {
    return mapTvDetail(detail as TvDetail);
  }

  throw new Error(`Tipo no soportado para obtener detalles: ${type}`);
}
