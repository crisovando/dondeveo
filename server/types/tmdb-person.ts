interface PersonCreditBase {
  id: number;
  poster_path: string | null;
  character: string;
  popularity: number;
}

export interface PersonMovieCredit extends PersonCreditBase {
  title: string;
  release_date: string;
}

export interface PersonTvCredit extends PersonCreditBase {
  name: string;
  first_air_date: string;
}

export interface PersonMovieCredits {
  cast: PersonMovieCredit[];
}

export interface PersonTvCredits {
  cast: PersonTvCredit[];
}

export interface PersonDetail {
  id: number;
  name: string;
  profile_path: string | null;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  movie_credits?: PersonMovieCredits;
  tv_credits?: PersonTvCredits;
}
