import { fetchTMDB } from "./tmdbFetch";
import { PersonDetail as ApiPersonDetail } from "../types/tmdb-person";
import { PersonDetail } from "../../src/shared/types";
import { mapPersonDetail } from "../utils/mappers";

export async function getPerson(id: number): Promise<PersonDetail> {
  const params = new URLSearchParams();
  // Both credit lists ride on the person response: one upstream round trip from the edge.
  params.append("append_to_response", "movie_credits,tv_credits");

  const person = await fetchTMDB<ApiPersonDetail>(`/person/${id}`, params);

  return mapPersonDetail(person);
}
